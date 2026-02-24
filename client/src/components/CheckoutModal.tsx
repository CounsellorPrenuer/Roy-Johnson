import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, TicketPercent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    planId: string;
    title: string;
    price: number;
}

export default function CheckoutModal({ isOpen, onClose, planId, title, price }: CheckoutModalProps) {
    const { toast } = useToast();
    const [step, setStep] = useState<'info' | 'payment'>('info');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [couponCode, setCouponCode] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [discount, setDiscount] = useState<{ amount: number, code: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (!formData.name || !formData.email || !formData.phone) {
            toast({
                title: "Missing Information",
                description: "Please fill in all fields to proceed.",
                variant: "destructive"
            });
            return;
        }
        setStep('payment');
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsApplyingCoupon(true);
        try {
            const workerUrl = import.meta.env.VITE_API_BASE_URL || "https://careerplans-worker.garyphadale.workers.dev";
            const res = await fetch(`${workerUrl}/validate-coupon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ couponCode, amount: price })
            });
            const data = await res.json();

            if (data.valid) {
                setDiscount({ amount: data.discount_amount, code: data.code });
                toast({
                    title: "Coupon Applied!",
                    description: `You saved ₹${data.discount_amount}`,
                    className: "bg-green-600 text-white border-none"
                });
            } else {
                setDiscount(null);
                toast({
                    title: "Invalid Coupon",
                    description: data.reason,
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to validate coupon.",
                variant: "destructive"
            });
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const workerUrl = import.meta.env.VITE_API_BASE_URL || "https://careerplans-worker.garyphadale.workers.dev";

            // 1. Create Lead first
            await fetch(`${workerUrl}/submit-lead`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, source: 'checkout_attempt', message: `Attempting to buy ${title}` })
            });

            // 2. Create Pay Order
            const res = await fetch(`${workerUrl}/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    currency: "INR",
                    couponCode: discount ? discount.code : null
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Payment processing failed");
            }

            const data = await res.json();

            // 3. Open Razorpay
            const options = {
                key: data.key_id,
                amount: data.amount * 100,
                currency: data.currency,
                name: "Career Plans",
                description: `Payment for ${title}`,
                order_id: data.order_id,
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                handler: function (response: any) {
                    toast({
                        title: "Payment Successful!",
                        description: `Payment ID: ${response.razorpay_payment_id}`,
                        className: "bg-green-600 text-white border-none"
                    });

                    // Only trigger mailto for Roy's specific packages or customized logic
                    const royPackages = [
                        "career-report", "career-report-counselling",
                        "knowledge-gateway", "one-to-one-session",
                        "college-admission-planning", "exam-stress-management", "cap-100",
                        "test-payment"
                    ];

                    if (royPackages.includes(planId)) {
                        const subject = encodeURIComponent(`New Payment Received: ${title}`);
                        const body = encodeURIComponent(`Hello Roy,\n\nA new payment has been successfully captured for the "${title}" package.\n\nCustomer Details:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nPayment ID: ${response.razorpay_payment_id}\nAmount: ₹${finalPrice.toLocaleString('en-IN')}\n\nPlease follow up with the client as needed.\n\nBest,\nSystem Notification`);

                        // Create a temporary link to open the mail client
                        const mailtoLink = document.createElement('a');
                        mailtoLink.href = `mailto:roy@careerplans.pro?subject=${subject}&body=${body}`;
                        mailtoLink.target = '_blank';
                        document.body.appendChild(mailtoLink);
                        mailtoLink.click();
                        document.body.removeChild(mailtoLink);
                    }

                    onClose();
                },
                theme: { color: "#0F766E" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error: any) {
            console.error(error);
            toast({
                title: "Payment Error",
                description: error.message || "Something went wrong.",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const finalPrice = discount ? (price - discount.amount) : price;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md glass-card border-brand-teal/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-brand-dark">{title}</DialogTitle>
                    <DialogDescription>
                        {step === 'info' ? "Enter your details to proceed" : "Review and pay"}
                    </DialogDescription>
                </DialogHeader>

                {step === 'info' ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+91 99999 99999" />
                        </div>
                        <Button className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white mt-4" onClick={handleNext}>
                            Proceed to Payment
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* Summary */}
                        <div className="bg-brand-teal/5 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{price.toLocaleString('en-IN')}</span>
                            </div>
                            {discount && (
                                <div className="flex justify-between text-sm text-green-600 font-medium">
                                    <span>Discount ({discount.code})</span>
                                    <span>-₹{discount.amount.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="border-t border-brand-teal/10 pt-2 flex justify-between font-bold text-lg text-brand-teal">
                                <span>Total</span>
                                <span>₹{finalPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Coupon Input */}
                        <div className="flex gap-2">
                            <Input
                                placeholder="Have a coupon code?"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                disabled={!!discount || isApplyingCoupon}
                            />
                            <Button
                                variant="outline"
                                onClick={handleApplyCoupon}
                                disabled={!couponCode || !!discount || isApplyingCoupon}
                            >
                                {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : <TicketPercent className="w-4 h-4" />}
                            </Button>
                        </div>
                        {discount && (
                            <Button variant="ghost" size="sm" onClick={() => { setDiscount(null); setCouponCode(''); }} className="text-xs text-red-500 h-auto p-0">
                                Remove Coupon
                            </Button>
                        )}


                        <Button
                            className="w-full bg-gradient-to-r from-brand-teal to-brand-aqua text-white h-12 text-lg shadow-lg hover:shadow-xl transition-all"
                            onClick={handlePayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                </>
                            ) : (
                                `Pay ₹${finalPrice.toLocaleString('en-IN')}`
                            )}
                        </Button>

                        <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => setStep('info')}>
                            Back to Details
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
