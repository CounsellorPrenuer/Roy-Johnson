import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { client } from '@/lib/sanity';
import CheckoutModal from './CheckoutModal';

interface PricingCardProps {
  title: string;
  price: string;
  rawPrice?: number;
  planId: string;
  duration: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  index: number;
  section: 'standard' | 'custom';
  onBuy: (planId: string, title: string, price: number) => void;
}

function PricingCard({ title, price, rawPrice, planId, duration, description, features, isPopular, buttonText, index, section, onBuy }: PricingCardProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{
        y: -10,
        transition: { duration: 0.3 }
      }}
      className={`relative h-full ${isPopular ? 'scale-105 z-10' : ''}`}
    >
      <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl h-full flex flex-col ${isPopular
        ? 'glass-card ring-2 ring-brand-aqua shadow-xl'
        : 'glass-card border-brand-aqua/20 hover:border-brand-aqua/40'
        }`}>
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute top-0 right-0 bg-brand-aqua text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-20">
            Most Popular
          </div>
        )}

        <CardHeader className={`text-center relative z-10 ${isPopular ? 'pt-12' : 'pt-6'}`}>
          <CardTitle className="fluid-text-2xl font-bold text-brand-teal mb-4 h-16 flex items-center justify-center">{title}</CardTitle>
          <div className="mb-4">
            <span className="fluid-text-3xl font-bold bg-gradient-to-r from-brand-teal to-brand-aqua bg-clip-text text-transparent">
              {price}
            </span>
            {duration && <span className="text-muted-foreground text-sm">/{duration}</span>}
          </div>
          {/* Subgroup/Description */}
          <CardDescription className="text-muted-foreground leading-relaxed text-sm min-h-[3rem]">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 relative z-10 flex-grow flex flex-col">
          {/* Divider */}
          <div className="w-full h-px bg-brand-aqua/10 mb-6"></div>

          <ul className="space-y-3 mb-8 flex-grow">
            {features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-brand-aqua flex-shrink-0 mt-1" />
                <span className="text-muted-foreground text-sm text-left">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3">
            {section === 'custom' ? (
              <Button
                className="w-full bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Inquire Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : rawPrice ? (
              <Button
                className="w-full bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => onBuy(planId, title, rawPrice)}
              >
                {buttonText}
              </Button>
            ) : (
              <Button className="w-full" variant="outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Contact for Pricing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Custom ListItem Component for the "Custom" section list view
function CustomListItem({ pkg, index, onBuy }: { pkg: any, index: number, onBuy: () => void }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 glass-card border-brand-aqua/10 hover:border-brand-aqua/30 transition-all duration-300 rounded-xl mb-4 group hover:shadow-md"
    >
      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-xl group-hover:bg-brand-aqua/20 transition-colors">
        {index + 1}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
          <h4 className="text-lg font-bold text-brand-dark group-hover:text-brand-teal transition-colors">
            {pkg.title}
          </h4>
          <span className="inline-block px-3 py-1 bg-brand-aqua/10 text-brand-teal rounded-full text-sm font-bold whitespace-nowrap">
            {pkg.price}
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {pkg.description}
        </p>
      </div>

      <div className="flex-shrink-0 md:self-center mt-2 md:mt-0 w-full md:w-auto">
        <Button
          className="w-full md:w-auto bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white shadow-md hover:shadow-lg transition-all"
          onClick={onBuy}
        >
          Buy Now
        </Button>
      </div>
    </motion.div>
  )
}


export default function Pricing() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [activeCategory, setActiveCategory] = useState<string>('class-8-9');
  const [sanityPackages, setSanityPackages] = useState<any[] | null>(null);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ planId: string, title: string, price: number } | null>(null);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const query = `*[_type == "pricing"]`;
        const result = await client.fetch(query);
        setSanityPackages(result);
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
        setSanityPackages([]);
      }
    };

    fetchPricing();
  }, []);

  const categories = [
    { id: 'class-8-9', title: 'Class 8th-9th', subtitle: '8-9 Students' },
    { id: 'class-10-12', title: 'Class 10th-12th', subtitle: '10-12 Students' },
    { id: 'graduates', title: 'Graduates', subtitle: 'Graduates' },
    { id: 'working-professionals', title: 'Working Professionals', subtitle: 'Working Professionals' }
  ];

  const getFilteredPackages = () => {
    if (!sanityPackages) return { standard: [], custom: [] };

    // Standard Packages
    const standard = sanityPackages
      .filter((pkg: any) => pkg.category === activeCategory && (pkg.section === 'standard' || !pkg.section))
      .map((pkg: any) => ({
        id: pkg._id,
        title: pkg.title,
        price: pkg.price ? `₹${Number(pkg.price).toLocaleString('en-IN')}` : 'Contact',
        rawPrice: Number(pkg.price),
        planId: pkg.packageType,
        duration: '',
        description: categories.find(c => c.id === activeCategory)?.subtitle || '',
        features: pkg.features || [],
        isPopular: pkg.isPopular,
        buttonText: 'Buy Now',
        section: 'standard'
      }))
      .sort((a: any, b: any) => a.rawPrice - b.rawPrice);

    // Custom Packages
    const custom = sanityPackages
      .filter((pkg: any) => pkg.section === 'custom')
      .map((pkg: any) => ({
        id: pkg._id,
        title: pkg.title,
        price: pkg.price ? `₹${Number(pkg.price).toLocaleString('en-IN')}` : 'Flexible',
        description: pkg.description,
        planId: pkg.packageType,
        section: 'custom'
      }))
      .sort((a: any, b: any) => {
        return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
      });

    return { standard, custom };
  };

  const { standard, custom } = getFilteredPackages();

  const handleBuy = (planId: string, title: string, price: number) => {
    setSelectedPlan({ planId, title, price });
    setIsCheckoutOpen(true);
  };

  if (sanityPackages === null) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-teal" />
      </div>
    )
  }

  return (
    <section id="pricing" className="py-16 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-light/30 via-background to-brand-light/20 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="fluid-text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-brand-teal via-brand-aqua to-brand-teal bg-clip-text text-transparent">
              Mentoria Packages
            </span>
          </h2>
          <p className="fluid-text-xl text-muted-foreground max-w-3xl mx-auto">
            Scientifically designed for every stage of your career.
          </p>
        </motion.div>

        {/* STANDARD PACKAGES */}
        <div className="mb-24">
          {/* Category Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-12 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`py-4 px-2 rounded-xl text-sm md:text-base font-bold transition-all duration-300 border ${activeCategory === cat.id
                  ? 'bg-brand-teal text-white border-brand-teal shadow-lg scale-105'
                  : 'bg-white/50 text-muted-foreground border-brand-aqua/20 hover:border-brand-aqua hover:bg-white'
                  }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Packages Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {standard.map((pkg: any, idx: number) => (
              <PricingCard
                key={pkg.id}
                {...pkg}
                index={idx}
                buttonText="Buy Now"
                onBuy={handleBuy}
              />
            ))}

            {standard.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No packages available for this category yet.
              </div>
            )}
          </motion.div>
        </div>


        {/* CUSTOM PACKAGES */}
        {custom.length > 0 && (
          <div className="mt-24 pt-12 border-t border-brand-aqua/10">
            <div className="text-center mb-12">
              <h3 className="fluid-text-3xl font-bold text-brand-dark mb-4">Want To Customise Your Mentorship Plan?</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                If you want to subscribe to specific services from Mentoria that resolve your career challenges, you can choose one or more of the following:
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {custom.map((pkg: any, idx: number) => (
                <CustomListItem
                  key={pkg.id}
                  pkg={pkg}
                  index={idx}
                  onBuy={() => {
                    // Extract numeric price from string like "₹1,500"
                    const price = parseInt(pkg.price.replace(/[^\d]/g, ''), 10);
                    handleBuy(pkg.planId, pkg.title, price);
                  }}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          planId={selectedPlan.planId}
          title={selectedPlan.title}
          price={selectedPlan.price}
        />
      )}

    </section>
  );
}