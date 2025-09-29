import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { insertContactInquirySchema, insertUserSchema, insertBookingSchema, insertPaymentSchema, createOrderSchema, verifyPaymentSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve attached_assets as static files
  app.use('/attached_assets', express.static(path.resolve(process.cwd(), 'attached_assets')));
  
  // Initialize Razorpay
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  // Validate required environment variables
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are required');
  }
  
  // ADMIN_TOKEN with secure default for development
  const adminToken = process.env.ADMIN_TOKEN || 'secure_admin_token_dev_2024';
  if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_TOKEN) {
    throw new Error('ADMIN_TOKEN environment variable is required in production');
  }
  
  if (adminToken === 'secure_admin_token_dev_2024') {
    console.warn('⚠️  WARNING: Using default admin token for development. Set ADMIN_TOKEN environment variable in production!');
  }

  // Admin authentication middleware
  const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(`Admin auth failed: Missing or invalid auth header from ${req.ip}`);
      return res.status(401).json({ 
        success: false, 
        error: "Authentication required. Please provide admin token." 
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const expectedToken = adminToken;
    
    // Use timing-safe comparison
    const tokenBuffer = Buffer.from(token, 'utf8');
    const expectedBuffer = Buffer.from(expectedToken, 'utf8');
    
    if (tokenBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(tokenBuffer, expectedBuffer)) {
      console.log(`Admin auth failed: Invalid token from ${req.ip}`);
      return res.status(403).json({ 
        success: false, 
        error: "Invalid admin token. Access denied." 
      });
    }
    
    console.log(`Admin authenticated: ${req.method} ${req.path} from ${req.ip}`);
    next();
  };
  // Contact Form API
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactInquirySchema.parse(req.body);
      const inquiry = await storage.createContactInquiry(contactData);
      res.json({ success: true, id: inquiry.id });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("Contact form error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Get all contact inquiries (admin)
  app.get("/api/admin/contacts", requireAdminAuth, async (req, res) => {
    try {
      const inquiries = await storage.getAllContactInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching contact inquiries:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Mark contact inquiry as read (admin)
  app.patch("/api/admin/contacts/:id/read", requireAdminAuth, async (req, res) => {
    try {
      await storage.markContactInquiryAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking contact as read:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Coaching Packages API
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.get("/api/packages/category/:category", async (req, res) => {
    try {
      const packages = await storage.getPackagesByCategory(req.params.category);
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages by category:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.get("/api/packages/:id", async (req, res) => {
    try {
      const pkg = await storage.getPackageById(req.params.id);
      if (!pkg) {
        return res.status(404).json({ success: false, error: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      console.error("Error fetching package:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Admin route to create packages
  app.post("/api/admin/packages", requireAdminAuth, async (req, res) => {
    try {
      // Validate package data with Zod schema
      const packageSchema = z.object({
        name: z.string().min(1, "Package name is required"),
        category: z.enum(["freshers", "middle-management", "senior-professionals"]),
        packageType: z.enum(["ascend", "ascend_plus"]),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
        features: z.array(z.string()).min(1, "At least one feature is required")
      });
      
      const validatedData = packageSchema.parse(req.body);
      const pkg = await storage.createPackage({
        ...validatedData,
        isActive: true // Default new packages to active
      });
      res.json({ success: true, package: pkg });
    } catch (error) {
      console.error("Error creating package:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // User Management API
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ success: false, error: "User already exists with this email" });
      }

      const user = await storage.createUser(userData);
      // Remove password from response
      const { password, ...safeUser } = user;
      res.json({ success: true, user: safeUser });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("User registration error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Booking System API
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json({ success: true, booking });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("Booking creation error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.get("/api/bookings/user/:userId", async (req, res) => {
    try {
      const bookings = await storage.getUserBookings(req.params.userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.get("/api/admin/bookings", requireAdminAuth, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.patch("/api/bookings/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const statusSchema = z.object({
        status: z.enum(["pending", "confirmed", "completed", "cancelled"])
      });
      const { status } = statusSchema.parse(req.body);
      
      await storage.updateBookingStatus(req.params.id, status);
      console.log(`Admin updated booking ${req.params.id} status to ${status}`);
      res.json({ success: true });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("Error updating booking status:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Payment System API - REMOVED: Direct payment creation is unsafe
  // Payments should only be created through the verified Razorpay flow via /api/payments/create-order

  // Update payment status (admin only - for manual reconciliation)
  app.patch("/api/payments/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const statusSchema = z.object({
        status: z.enum(["pending", "completed", "failed", "refunded"]),
        paymentId: z.string().optional(),
        reason: z.string().min(1, "Reason for manual status change is required")
      });
      const { status, paymentId, reason } = statusSchema.parse(req.body);
      
      await storage.updatePaymentStatus(req.params.id, status, paymentId);
      console.log(`Admin manually updated payment ${req.params.id} status to ${status}, reason: ${reason}`);
      res.json({ success: true });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("Error updating payment status:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Get user payments (admin only)
  app.get("/api/payments/user/:userId", requireAdminAuth, async (req, res) => {
    try {
      const payments = await storage.getUserPayments(req.params.userId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching user payments:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Razorpay Payment Routes
  
  // Create Razorpay order for package purchase
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      // Validate request body
      const validationResult = createOrderSchema.parse(req.body);
      const { packageId, userId } = validationResult;

      // Get package details from database (server-side truth)
      const pkg = await storage.getPackageById(packageId);
      if (!pkg) {
        return res.status(404).json({ success: false, error: "Package not found" });
      }

      // Server-derived amount from database
      const amountInPaise = Math.round(parseFloat(pkg.price) * 100);

      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          packageId: pkg.id,
          packageName: pkg.name,
          userId: userId,
          category: pkg.category
        }
      });

      // Create payment record in database with package verification data
      const payment = await storage.createPayment({
        userId: userId,
        amount: pkg.price,
        packageId: pkg.id, // Store for verification
        razorpayOrderId: order.id
      });

      // Log order creation (redact sensitive info)
      console.log(`Payment order created - Order: ${order.id}, Package: ${pkg.name}, Amount: ${pkg.price}, User: ${userId.substring(0, 8)}***`);

      res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment.id,
        packageDetails: {
          id: pkg.id,
          name: pkg.name,
          price: pkg.price,
          category: pkg.category
        }
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ success: false, error: "Failed to create payment order" });
    }
  });

  // Verify Razorpay payment
  app.post("/api/payments/verify", async (req, res) => {
    try {
      // Validate request body
      const validationResult = verifyPaymentSchema.parse(req.body);
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId, packageId, userId } = validationResult;

      // Get stored payment record by our payment ID
      const storedPayment = await storage.getPaymentById(paymentId);
      if (!storedPayment) {
        return res.status(404).json({ success: false, error: "Payment record not found" });
      }

      // Idempotency check - if already completed, return existing result
      if (storedPayment.status === "completed") {
        const existingBooking = await storage.getBookingById(storedPayment.bookingId!);
        return res.json({
          success: true,
          message: "Payment already verified",
          bookingId: existingBooking?.id,
          paymentDetails: {
            razorpayPaymentId: storedPayment.razorpayPaymentId,
            razorpayOrderId: storedPayment.razorpayOrderId,
            amount: storedPayment.amount,
            status: "completed"
          }
        });
      }

      // Verify order ID matches stored record
      if (storedPayment.razorpayOrderId !== razorpay_order_id) {
        console.error(`Order ID mismatch: stored=${storedPayment.razorpayOrderId}, received=${razorpay_order_id}`);
        return res.status(400).json({ success: false, error: "Order ID mismatch" });
      }

      // Verify package ID matches stored record
      if (storedPayment.packageId !== packageId) {
        console.error(`Package ID mismatch: stored=${storedPayment.packageId}, received=${packageId}`);
        return res.status(400).json({ success: false, error: "Package ID mismatch" });
      }

      // Verify user ID matches stored record
      if (storedPayment.userId !== userId) {
        console.error(`User ID mismatch: stored=${storedPayment.userId}, received=${userId}`);
        return res.status(400).json({ success: false, error: "User ID mismatch" });
      }

      // HMAC SHA256 signature verification with stored order ID
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${storedPayment.razorpayOrderId}|${razorpay_payment_id}`)
        .digest('hex');
      
      if (expectedSignature !== razorpay_signature) {
        console.error(`Signature verification failed for order ${razorpay_order_id}`);
        return res.status(400).json({ success: false, error: "Invalid payment signature" });
      }

      // Get package details from stored record
      const pkg = await storage.getPackageById(storedPayment.packageId);
      if (!pkg) {
        console.error(`Package not found: ${storedPayment.packageId}`);
        return res.status(404).json({ success: false, error: "Package not found" });
      }

      // Verify amount matches stored package price
      if (parseFloat(storedPayment.amount) !== parseFloat(pkg.price)) {
        console.error(`Amount mismatch: stored=${storedPayment.amount}, package=${pkg.price}`);
        return res.status(400).json({ success: false, error: "Amount verification failed" });
      }

      // Create booking record
      const booking = await storage.createBooking({
        userId: userId,
        packageId: packageId,
        totalAmount: pkg.price
      });

      // Update payment record with success status and payment ID
      await storage.updatePaymentStatus(paymentId, "completed", razorpay_payment_id);

      // Link booking to payment
      await storage.updateBookingPayment(booking.id, paymentId);

      // Log successful verification (redact sensitive info)
      console.log(`Payment verified successfully - Order: ${razorpay_order_id}, Booking: ${booking.id}, User: ${userId.substring(0, 8)}***`);

      res.json({
        success: true,
        message: "Payment verified successfully",
        bookingId: booking.id,
        paymentDetails: {
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          amount: pkg.price,
          status: "completed"
        }
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      console.error("Error verifying payment:", error);
      res.status(500).json({ success: false, error: "Payment verification failed" });
    }
  });

  // Get Razorpay key for frontend
  app.get("/api/payments/razorpay-key", (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
