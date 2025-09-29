import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Linkedin, Instagram, Send, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your inquiry. Roy will get back to you within 24 hours.",
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    },
    onError: (error: Error) => {
      console.error('Contact form error:', error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill in all required fields",
        description: "Name, email, and message are required.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: 'Email',
      value: 'royjohns@gmail.com',
      href: 'mailto:royjohns@gmail.com',
      description: 'Send us an email'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: 'Phone',
      value: '+91 80759 15530',
      href: 'tel:+918075915530',
      description: 'Call us directly'
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      label: 'LinkedIn',
      value: 'Connect with Roy',
      href: 'https://www.linkedin.com/in/roy-johnson-10355b4/',
      description: 'Professional network'
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      label: 'Instagram',
      value: '@careerplanspro',
      href: 'https://www.instagram.com/careerplanspro',
      description: 'Follow our journey'
    }
  ];
  
  const additionalInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Location',
      value: 'India (Remote Available)'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Response Time',
      value: 'Within 24 hours'
    }
  ];

  return (
    <section id="contact" className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute top-1/4 left-0 w-80 h-80 bg-gradient-to-r from-brand-teal/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h2 
            className="fluid-text-5xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.68, -0.55, 0.265, 1.55] }}
          >
            <span className="bg-gradient-to-r from-brand-teal via-brand-aqua to-brand-teal bg-clip-text text-transparent">
              Let's Start Your Journey
            </span>
          </motion.h2>
          <motion.p 
            className="fluid-text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Ready to take the next step in your career? Get in touch and let's discuss how we can help you achieve your goals.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="glass-card border-brand-aqua/20 hover:border-brand-aqua/40 transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="fluid-text-2xl text-brand-teal flex items-center gap-2">
                  <Send className="w-6 h-6" />
                  Send us a message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Input
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="glass-card border-brand-aqua/20 focus:border-brand-aqua focus:ring-brand-aqua/20 transition-all duration-300"
                      data-testid="input-name"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="glass-card border-brand-aqua/20 focus:border-brand-aqua focus:ring-brand-aqua/20 transition-all duration-300"
                      data-testid="input-email"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Your Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="glass-card border-brand-aqua/20 focus:border-brand-aqua focus:ring-brand-aqua/20 transition-all duration-300"
                      data-testid="input-phone"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Textarea
                      name="message"
                      placeholder="Tell us about your career goals and how we can help..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="glass-card border-brand-aqua/20 focus:border-brand-aqua focus:ring-brand-aqua/20 resize-none transition-all duration-300"
                      data-testid="textarea-message"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white font-semibold py-4 fluid-text-base relative overflow-hidden"
                      data-testid="button-send-message"
                    >
                      {contactMutation.isPending ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Send Message
                            <Send className="w-4 h-4" />
                          </span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 2,
                              ease: "easeInOut"
                            }}
                          />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-brand-teal to-brand-aqua text-white relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <CardContent className="p-8 relative z-10">
                  <h3 className="fluid-text-2xl font-bold mb-4">Get in Touch</h3>
                  <p className="text-white/90 leading-relaxed fluid-text-base">
                    Ready to transform your career? Reach out today and let's discuss your professional goals and how Career Plans can help you achieve them.
                  </p>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {additionalInfo.map((info, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="text-white/80">{info.icon}</div>
                        <div>
                          <div className="text-xs text-white/70">{info.label}</div>
                          <div className="text-sm font-medium">{info.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block p-6 glass-card border border-brand-aqua/20 rounded-xl hover:border-brand-aqua/40 hover:shadow-lg transition-all duration-300 group"
                  data-testid={`link-${item.label.toLowerCase()}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="text-brand-teal group-hover:text-brand-aqua transition-colors duration-300 p-2 bg-brand-teal/10 rounded-lg group-hover:bg-brand-aqua/10"
                      whileHover={{ rotate: 5 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-semibold text-brand-teal group-hover:text-brand-aqua transition-colors duration-300 fluid-text-sm mb-1">
                        {item.label}
                      </div>
                      <div className="text-muted-foreground fluid-text-xs mb-1">
                        {item.value}
                      </div>
                      <div className="text-muted-foreground/70 fluid-text-xs">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}