import { Linkedin, Instagram } from 'lucide-react';
// TODO: Fix image import path after build setup
const logoPath = "/attached_assets/logo_1759131412190.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
        icon: <Linkedin className="w-5 h-5" />
      },
      {
        name: 'Instagram',
        href: 'https://www.instagram.com/careerplanspro',
        icon: <Instagram className="w-5 h-5" />
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

  return (
    <footer className="bg-brand-teal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logoPath}
                alt="Career Plans Logo"
                className="h-10 w-auto brightness-0 invert"
                data-testid="img-footer-logo"
              />
            </div>
            <p className="text-white/80 leading-relaxed mb-6 max-w-md">
              Empowering professionals to take control of their careers with strategic guidance, 
              personalized coaching, and proven methodologies for sustainable success.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-300"
                  data-testid={`link-${social.name.toLowerCase()}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/80 hover:text-white transition-colors duration-300 text-left"
                    data-testid={`link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/80 hover:text-white transition-colors duration-300 text-left"
                    data-testid={`link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} Career Plans. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <button className="text-white/60 hover:text-white transition-colors duration-300">
                Privacy Policy
              </button>
              <button className="text-white/60 hover:text-white transition-colors duration-300">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}