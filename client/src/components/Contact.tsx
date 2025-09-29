import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Linkedin, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Show success message
    toast({
      title: "Message sent successfully!",
      description: "Thank you for your inquiry. Roy will get back to you within 24 hours.",
    });
    
    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: 'royjohns@gmail.com',
      href: 'mailto:royjohns@gmail.com'
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone',
      value: '+91 80759 15530',
      href: 'tel:+918075915530'
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: 'LinkedIn',
      value: 'Connect with Roy',
      href: 'https://www.linkedin.com/in/roy-johnson-10355b4/'
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      label: 'Instagram',
      value: '@careerplanspro',
      href: 'https://www.instagram.com/careerplanspro'
    }
  ];

  return (
    <section id="contact" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-teal mb-6">
            Let's Start Your Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to take the next step in your career? Get in touch and let's discuss how we can help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-background/80 backdrop-blur-sm border-brand-aqua/20">
            <CardHeader>
              <CardTitle className="text-2xl text-brand-teal">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border-brand-aqua/20 focus:border-brand-aqua"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-brand-aqua/20 focus:border-brand-aqua"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Your Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border-brand-aqua/20 focus:border-brand-aqua"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Tell us about your career goals and how we can help..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="border-brand-aqua/20 focus:border-brand-aqua resize-none"
                    data-testid="textarea-message"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white font-semibold py-3"
                  data-testid="button-send-message"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-brand-teal to-brand-aqua text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
                <p className="text-white/90 leading-relaxed">
                  Ready to transform your career? Reach out today and let's discuss your professional goals and how Career Plans can help you achieve them.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block p-4 bg-background/80 backdrop-blur-sm border border-brand-aqua/20 rounded-lg hover:border-brand-aqua/40 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-brand-teal">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium text-brand-teal text-sm">
                        {item.label}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {item.value}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}