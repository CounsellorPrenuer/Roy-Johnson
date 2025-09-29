import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
// TODO: Fix image import path after build setup
const logoPath = "/attached_assets/logo_1759141877823.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    console.log(`Scrolling to ${sectionId}`);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-card border-b border-brand-aqua/20 shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.img
              src={logoPath}
              alt="Career Plans Logo"
              className="h-10 w-auto"
              data-testid="img-logo"
              animate={isScrolled ? { scale: 0.9 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {[
                { label: 'About', section: 'about' },
                { label: 'Services', section: 'services' },
                { label: 'Pricing', section: 'pricing' },
                { label: 'Contact', section: 'contact' }
              ].map((item, index) => (
                <motion.button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className="relative text-foreground hover:text-brand-teal transition-colors font-medium group"
                  data-testid={`link-${item.section}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-teal to-brand-aqua origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => console.log('Book Discovery Call clicked')}
                className="relative overflow-hidden bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white font-medium px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="button-book-call"
              >
                <span className="relative z-10">Book a Discovery Call</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                />
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.div
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
                className="text-brand-teal hover:text-brand-aqua hover:bg-brand-teal/10"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? 'close' : 'open'}
                    initial={{ rotate: 0, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="px-2 pt-2 pb-3 space-y-1 glass-card border border-brand-aqua/20 rounded-lg mt-2 shadow-xl"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {[
                  { label: 'About', section: 'about' },
                  { label: 'Services', section: 'services' },
                  { label: 'Pricing', section: 'pricing' },
                  { label: 'Contact', section: 'contact' }
                ].map((item, index) => (
                  <motion.button
                    key={item.section}
                    onClick={() => scrollToSection(item.section)}
                    className="block px-3 py-2 text-foreground hover:text-brand-teal hover:bg-brand-teal/10 transition-all duration-300 font-medium w-full text-left rounded-lg"
                    data-testid={`link-${item.section}-mobile`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <motion.div 
                  className="px-3 py-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Button
                    onClick={() => {
                      console.log('Book Discovery Call clicked');
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white font-medium w-full"
                    data-testid="button-book-call-mobile"
                  >
                    Book a Discovery Call
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}