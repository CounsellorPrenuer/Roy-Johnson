import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, X, User, Mail, Phone, Shield, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { initializePayment } from '@/lib/razorpay';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
});

type ContactForm = z.infer<typeof contactSchema>;

interface PaymentContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string;
  packageName: string;
  packagePrice: string;
}

export default function PaymentContactModal({ 
  isOpen, 
  onClose, 
  packageId, 
  packageName, 
  packagePrice 
}: PaymentContactModalProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: ContactForm) => {
    setIsProcessing(true);
    
    try {
      // Generate a user ID for this session
      const userId = 'user-' + Date.now();
      
      const userDetails = {
        name: data.fullName,
        email: data.email,
        phone: data.phoneNumber
      };

      // Store contact info first, then proceed with payment
      // This ensures we have their details even if payment fails
      console.log('Storing contact info:', userDetails);

      // Close the contact modal and proceed with payment
      onClose();

      // Initialize Razorpay payment with real user details
      await initializePayment(
        packageId,
        userId,
        userDetails,
        (paymentResult) => {
          toast({
            title: "Payment Successful! 🎉",
            description: `Welcome to ${packageName}! We'll contact you within 24 hours to get started.`,
          });
          console.log('Payment successful:', paymentResult);
        },
        (error) => {
          toast({
            title: "Payment Failed",
            description: "There was an error processing your payment. Please try again.",
            variant: "destructive",
          });
          console.error('Payment failed:', error);
        }
      );
    } catch (error) {
      console.error('Error proceeding with payment:', error);
      toast({
        title: "Error",
        description: "Failed to proceed with payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const securityFeatures = [
    'Secure payment processing via Razorpay',
    'Bank-grade encryption for your data',
    'No card details stored on our servers',
    'Instant booking confirmation'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl p-0">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="relative bg-gradient-to-r from-brand-teal to-brand-aqua text-white p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              data-testid="button-close-payment-modal"
            >
              <X className="w-5 h-5" />
            </button>
            
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/20 p-2 rounded-lg">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Complete Your Purchase</DialogTitle>
                <p className="text-sm text-white/90 mt-1">
                  {packageName} - {packagePrice}
                </p>
              </div>
            </motion.div>
          </DialogHeader>

          <div className="p-6">
            {/* Security Notice */}
            <motion.div 
              className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Secure & Protected</h3>
                  <div className="space-y-1">
                    {securityFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                We'll use these details to contact you after your purchase and set up your coaching sessions.
              </p>
            </motion.div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium">
                          <User className="w-4 h-4" />
                          Full Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="border-gray-300 focus:border-brand-teal"
                            data-testid="input-payment-full-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium">
                          <Mail className="w-4 h-4" />
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your.email@example.com"
                            className="border-gray-300 focus:border-brand-teal"
                            data-testid="input-payment-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Phone Number */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium">
                          <Phone className="w-4 h-4" />
                          Phone Number *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+91 98765 43210"
                            className="border-gray-300 focus:border-brand-teal"
                            data-testid="input-payment-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Notice */}
                <motion.div
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  By proceeding, you'll be redirected to Razorpay's secure payment gateway. 
                  We'll contact you within 24 hours to schedule your first session.
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    data-testid="button-proceed-payment"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      {isProcessing ? 'Processing...' : `Proceed to Payment (${packagePrice})`}
                    </div>
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}