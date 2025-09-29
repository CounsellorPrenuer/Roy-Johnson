import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Phone, X, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

const discoveryCallSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  currentBackground: z.string().min(1, 'Please select your current background'),
});

type DiscoveryCallForm = z.infer<typeof discoveryCallSchema>;

interface DiscoveryCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscoveryCallModal({ isOpen, onClose }: DiscoveryCallModalProps) {
  const { toast } = useToast();
  
  const form = useForm<DiscoveryCallForm>({
    resolver: zodResolver(discoveryCallSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      currentBackground: '',
    },
  });

  const discoveryCallMutation = useMutation({
    mutationFn: async (data: DiscoveryCallForm) => {
      return apiRequest('POST', '/api/contact', {
        name: data.fullName,
        email: '', // Not required for discovery call
        phone: data.phoneNumber,
        message: `Discovery Call Request - Background: ${data.currentBackground}`,
        type: 'discovery_call'
      });
    },
    onSuccess: () => {
      toast({
        title: "Discovery Call Requested!",
        description: "We'll contact you within 24 hours to schedule your free call.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Booking failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DiscoveryCallForm) => {
    discoveryCallMutation.mutate(data);
  };

  const backgroundOptions = [
    'Student/Recent Graduate',
    'Early Career Professional (0-3 years)',
    'Mid-Level Professional (3-7 years)', 
    'Senior Professional (7-15 years)',
    'Executive/Leadership Role',
    'Career Transition/Break',
    'Entrepreneur/Business Owner',
    'Other'
  ];

  const freeFeatures = [
    {
      title: '10-min focused discussion',
      description: 'about your career situation'
    },
    {
      title: 'Actionable roadmap',
      description: 'with 2-3 immediate next steps'
    },
    {
      title: 'Expert assessment',
      description: 'of your primary career challenge'
    },
    {
      title: 'Personalized guidance',
      description: 'based on your background'
    }
  ];

  const paidOnlyFeatures = [
    'Full psychometric assessment & detailed report',
    '60-90 minute deep-dive counselling session',
    'Career compatibility analysis',
    'Ongoing mentorship support'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl p-0">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="relative bg-gradient-to-r from-brand-teal to-brand-aqua text-white p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              data-testid="button-close-modal"
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
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Free Discovery Call</h2>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                  <span className="text-sm text-white/90">Trusted by 3,725+ professionals</span>
                </div>
              </div>
            </motion.div>
          </DialogHeader>

          <div className="p-6">
            {/* Features Grid */}
            <motion.div 
              className="grid md:grid-cols-2 gap-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* What You'll Get (Free) */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  What You'll Get (Free)
                </h3>
                <div className="space-y-3">
                  {freeFeatures.map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-green-800">{feature.title}</span>
                        <span className="text-green-600 text-sm"> {feature.description}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Not Included (Paid Only) */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Not Included (Paid Only)
                </h3>
                <div className="space-y-2">
                  {paidOnlyFeatures.map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    >
                      <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-500 text-sm line-through">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick & Valuable Banner */}
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6" />
                <div>
                  <h4 className="font-semibold">Quick & Valuable</h4>
                  <p className="text-sm text-blue-100">Get clarity in just 10 minutes - no strings attached!</p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <motion.div 
                  className="grid md:grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="border-gray-300 focus:border-brand-teal"
                            data-testid="input-full-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Number */}
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+91 98765 43210"
                            className="border-gray-300 focus:border-brand-teal"
                            data-testid="input-phone-number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Current Background */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="currentBackground"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Current Background *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger 
                              className="border-gray-300 focus:border-brand-teal"
                              data-testid="select-background"
                            >
                              <SelectValue placeholder="Select your current background" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {backgroundOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    disabled={discoveryCallMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    data-testid="button-book-free-call"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />
                      {discoveryCallMutation.isPending ? 'Booking...' : 'Book a Free Call'}
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