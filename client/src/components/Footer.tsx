import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin, Instagram, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
const logoPath = "attached_assets/career_plans_logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const footerLinks = {
    services: [
      { name: 'Strategic Career Planning', href: '#services' },
      { name: 'Resume Optimization', href: '#services' },
      { name: 'Interview Coaching', href: '#services' },
      { name: 'Career Transition', href: '#services' }
    ],
    company: [
      { name: 'About Roy', href: '#about' },
      { name: 'Our Services', href: '#services' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Contact Us', href: '#contact' }
    ],
    social: [
      {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/in/roy-johnson-10355b4/',
        icon: <Linkedin className="w-6 h-6" />
      },
      {
        name: 'Instagram',
        href: 'https://www.instagram.com/careerplanspro',
        icon: <Instagram className="w-6 h-6" />
      }
    ]
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      ref={ref}
      className="bg-gradient-to-br from-brand-teal via-brand-teal to-brand-aqua text-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Back to top button */}
      <motion.div
        className="absolute top-8 right-8"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            variant="outline"
            className="bg-white/10 border-white/20 text-white backdrop-blur-sm"
            data-testid="button-back-to-top"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={logoPath}
                alt="Career Plans Logo"
                className="h-12 w-auto brightness-0 invert"
                data-testid="img-footer-logo"
              />
            </motion.div>
            <motion.p
              className="text-white/80 leading-relaxed mb-8 max-w-md fluid-text-base"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Empowering professionals to take control of their careers with strategic guidance,
              personalized coaching, and proven methodologies for sustainable success.
            </motion.p>
            <div className="flex gap-4">
              {footerLinks.social.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 group backdrop-blur-sm"
                  data-testid={`link-${social.name.toLowerCase()}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="group-hover:scale-110 transition-transform duration-200">
                    {social.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-bold fluid-text-lg mb-6 text-white">Services</h3>
            <ul className="space-y-4">
              {footerLinks.services.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <motion.button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/80 hover:text-white transition-colors duration-300 text-left group flex items-center gap-2"
                    data-testid={`link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-white transition-colors duration-300"
                      whileHover={{ scale: 1.5 }}
                    />
                    {link.name}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="font-bold fluid-text-lg mb-6 text-white">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                >
                  <motion.button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/80 hover:text-white transition-colors duration-300 text-left group flex items-center gap-2"
                    data-testid={`link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-white transition-colors duration-300"
                      whileHover={{ scale: 1.5 }}
                    />
                    {link.name}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/20 mt-16 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <motion.p
              className="text-white/60 fluid-text-sm"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              © {currentYear} Career Plans. All rights reserved.
            </motion.p>
            <div className="flex gap-6 fluid-text-sm">
              {['Privacy Policy', 'Terms of Service'].map((item, index) => (
                <motion.button
                  key={item}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Partnership Line */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <p className="text-white/60 fluid-text-sm">
              In partnership with Mentoria for enhanced career guidance services.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
}