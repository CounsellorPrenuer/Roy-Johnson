export interface Env {
    // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
    // MY_SERVICE: Fetcher;
    DB: D1Database;
    SANITY_PROJECT_ID: string;
    SANITY_DATASET: string;
    SANITY_API_TOKEN: string;
    RAZORPAY_KEY_ID: string;
    RAZORPAY_KEY_SECRET: string;
    RAZORPAY_WEBHOOK_SECRET: string;
}

// Helpers
async function validateCoupon(env: Env, couponCode: string, amount: number) {
    const query = `*[_type == "coupon" && code == $code][0]`;
    const sanityUrl = `https://${env.SANITY_PROJECT_ID}.apicdn.sanity.io/v2022-03-07/data/query/${env.SANITY_DATASET}?query=${encodeURIComponent(query)}&%24code=${encodeURIComponent('"' + couponCode.toUpperCase() + '"')}`;

    const sanityRes = await fetch(sanityUrl, {
        headers: { Authorization: `Bearer ${env.SANITY_API_TOKEN}` }
    });

    const sanityData: any = await sanityRes.json();
    const coupon = sanityData.result;

    if (!coupon) return { valid: false, reason: "Invalid coupon code" };
    if (!coupon.active) return { valid: false, reason: "Coupon is inactive" };
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { valid: false, reason: "Coupon has expired" };
    }

    if (coupon.max_redemptions) {
        const countResult: any = await env.DB.prepare("SELECT COUNT(*) as count FROM coupon_redemptions WHERE coupon_code = ?").bind(coupon.code).first();
        if ((countResult?.count || 0) >= coupon.max_redemptions) {
            return { valid: false, reason: "Coupon usage limit reached" };
        }
    }

    let discount = coupon.discount_type === 'percentage'
        ? (amount * (coupon.discount_value / 100))
        : coupon.discount_value;

    // Convert to number just in case
    discount = Number(discount);
    let finalAmount = Number(amount);

    discount = Math.min(discount, finalAmount);

    return {
        valid: true,
        code: coupon.code,
        discount_amount: discount,
        final_amount: finalAmount - discount,
        message: "Coupon applied successfully"
    };
}

async function verifyWebhookSignature(payload: string, signature: string, secret: string) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw", encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false, ["verify"]
    );
    // Convert hex signature to Uint8Array
    const signatureBytes = new Uint8Array(signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

    return await crypto.subtle.verify(
        "HMAC", key, signatureBytes, encoder.encode(payload)
    );
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Max-Age": "86400",
        };

        // Handle preflight OPTIONS requests
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        const url = new URL(request.url);

        // --- Health Check ---
        if (url.pathname === "/health" && request.method === "GET") {
            let dbStatus = "unknown";
            try {
                if (await env.DB.prepare("SELECT 1").first()) dbStatus = "connected";
            } catch (e) { dbStatus = "disconnected"; console.error(e); }

            return new Response(JSON.stringify({
                status: "ok", service: "cloudflare-worker", database: dbStatus, timestamp: new Date().toISOString()
            }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
        }

        // --- Validate Coupon ---
        if (url.pathname === "/validate-coupon" && request.method === "POST") {
            try {
                const { couponCode, amount } = await request.json() as any;
                if (!couponCode || !amount) {
                    return new Response(JSON.stringify({ valid: false, reason: "Missing inputs" }), { status: 400, headers: corsHeaders });
                }

                const result = await validateCoupon(env, couponCode, amount);
                return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json", ...corsHeaders } });
            } catch (error) {
                console.error(error);
                return new Response(JSON.stringify({ valid: false, reason: "Server Error" }), { status: 500, headers: corsHeaders });
            }
        }

        // --- Diag Endpoint ---
        if (url.pathname === "/_diag" && request.method === "GET") {
            return new Response(JSON.stringify({
                razorpay_key_configured: !!env.RAZORPAY_KEY_ID,
                razorpay_secret_configured: !!env.RAZORPAY_KEY_SECRET,
                webhook_secret_configured: !!env.RAZORPAY_WEBHOOK_SECRET,
                sanity_project_id_configured: !!env.SANITY_PROJECT_ID,
                sanity_token_configured: !!env.SANITY_API_TOKEN
            }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
        }

        // --- Create Order ---
        if (url.pathname === "/create-order" && request.method === "POST") {
            try {
                if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
                    console.error("Missing Razorpay credentials");
                    return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500, headers: corsHeaders });
                }

                const requestBody = await request.json() as any;
                const { planId, currency, couponCode } = requestBody;

                const PRICING_CONFIG: Record<string, number> = {
                    // Legacy IDs
                    "discover": 5500,
                    "discovery_plus": 15000,
                    "achieve": 5999,
                    "achieve_plus": 10599,
                    "ascend": 19999,
                    "ascend_plus": 29999,

                    // New Standard IDs (V2)
                    "pkg-1": 5500,   // Discover (8-9)
                    "pkg-2": 15000,  // Discover Plus+ (8-9)
                    "pkg-3": 5999,   // Achieve Online (10-12)
                    "pkg-4": 10599,  // Achieve Plus+ (10-12)
                    "pkg-5": 6499,   // Ascend Online (Graduates)
                    "pkg-6": 10599,  // Ascend Plus+ (Graduates)
                    "mp-3": 6499,    // Ascend Online (Professionals)
                    "mp-2": 10599,   // Ascend Plus+ (Professionals)

                    // Custom Packages
                    "career-report": 1500,
                    "career-report-counselling": 3000,
                    "knowledge-gateway": 100,
                    "one-to-one-session": 3500,
                    "college-admission-planning": 3000,
                    "exam-stress-management": 1000,
                    "cap-100": 199
                };

                const basePrice = PRICING_CONFIG[planId];

                if (!basePrice) {
                    console.error(`[CREATE-ORDER] Invalid planId: ${planId}`);
                    return new Response(JSON.stringify({ error: `Invalid planId: ${planId}.` }), { status: 400, headers: corsHeaders });
                }

                let finalAmount = Number(basePrice);
                let appliedCoupon = null;

                if (couponCode) {
                    const validation = await validateCoupon(env, couponCode, finalAmount);
                    if (validation.valid && validation.final_amount !== undefined) {
                        finalAmount = Number(validation.final_amount);
                        appliedCoupon = validation.code;
                    }
                }

                const credentials = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
                const razorpayPayload = {
                    amount: Math.round(finalAmount * 100),
                    currency: currency || "INR",
                    receipt: `txn_${Date.now()}`,
                    notes: {
                        coupon_code: appliedCoupon || "",
                        plan_id: planId
                    }
                };

                const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
                    method: "POST",
                    headers: { "Authorization": `Basic ${credentials}`, "Content-Type": "application/json" },
                    body: JSON.stringify(razorpayPayload)
                });

                if (!razorpayRes.ok) {
                    const errorText = await razorpayRes.text();
                    console.error(`[CREATE-ORDER] Razorpay error: ${razorpayRes.status} - ${errorText}`);
                    return new Response(JSON.stringify({ error: `Razorpay API error: ${errorText}` }), { status: 500, headers: corsHeaders });
                }
                const orderData: any = await razorpayRes.json();

                await env.DB.prepare(
                    "INSERT INTO transactions (id, order_id, amount, status, created_at) VALUES (?, ?, ?, ?, ?)"
                ).bind(
                    crypto.randomUUID(), orderData.id, finalAmount, "created", Math.floor(Date.now() / 1000)
                ).run();

                return new Response(JSON.stringify({
                    order_id: orderData.id,
                    amount: finalAmount,
                    currency: orderData.currency,
                    key_id: env.RAZORPAY_KEY_ID,
                    coupon_applied: !!appliedCoupon
                }), { headers: { "Content-Type": "application/json", ...corsHeaders } });

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error("[CREATE-ORDER] Caught error:", errorMessage, error);
                return new Response(JSON.stringify({ error: `Order Creation Failed: ${errorMessage}` }), { status: 500, headers: corsHeaders });
            }
        }

        // --- Razorpay Webhook ---
        if (url.pathname === "/razorpay-webhook" && request.method === "POST") {
            try {
                if (!env.RAZORPAY_WEBHOOK_SECRET) {
                    console.error("Missing Webhook Secret");
                    return new Response("Server Configuration Error", { status: 500 });
                }

                const signature = request.headers.get("X-Razorpay-Signature");
                const bodyText = await request.text();

                if (!signature || !(await verifyWebhookSignature(bodyText, signature, env.RAZORPAY_WEBHOOK_SECRET))) {
                    return new Response("Invalid Signature", { status: 401 });
                }

                const event = JSON.parse(bodyText);
                const { entity } = event.payload.payment || event.payload.order || {};

                // Razorpay payment.captured is the key event for successful payment
                if (event.event === "payment.captured" && entity) {
                    const orderId = entity.order_id;
                    const couponCode = entity.notes?.coupon_code;

                    if (orderId) {
                        // Update Transaction
                        await env.DB.prepare("UPDATE transactions SET status = 'paid' WHERE order_id = ?").bind(orderId).run();

                        // Record Coupon Redemption
                        if (couponCode) {
                            const existingRedemption = await env.DB.prepare(
                                "SELECT 1 FROM coupon_redemptions WHERE order_id = ?"
                            ).bind(orderId).first();

                            if (!existingRedemption) {
                                await env.DB.prepare(
                                    "INSERT INTO coupon_redemptions (id, coupon_code, order_id, redeemed_at) VALUES (?, ?, ?, ?)"
                                ).bind(crypto.randomUUID(), couponCode, orderId, Math.floor(Date.now() / 1000)).run();
                            }
                        }
                    }
                }

                return new Response("OK", { status: 200 });

            } catch (error) {
                console.error("Webhook Error:", error);
                return new Response("Internal Error", { status: 500 });
            }
        }

        // --- Submit Lead ---
        if (url.pathname === "/submit-lead" && request.method === "POST") {
            try {
                const { name, email, phone, message, source } = await request.json() as any;

                if (!name || !email) {
                    return new Response(JSON.stringify({ error: "Name and Email are required" }), { status: 400, headers: corsHeaders });
                }

                await env.DB.prepare(
                    "INSERT INTO leads (id, name, email, phone, message, source, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
                ).bind(
                    crypto.randomUUID(),
                    name.substring(0, 100), // Basic sanitization/truncation
                    email.substring(0, 100),
                    phone ? phone.substring(0, 20) : null,
                    message ? message.substring(0, 2000) : null,
                    source || "contact",
                    Math.floor(Date.now() / 1000)
                ).run();

                return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
            } catch (error) {
                console.error("Lead Submit Error:", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return new Response(JSON.stringify({ error: "Failed to submit lead", details: errorMessage }), { status: 500, headers: corsHeaders });
            }
        }

        return new Response("Not Found", { status: 404, headers: corsHeaders });
    },
};
