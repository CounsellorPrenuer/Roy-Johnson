import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Sparkles, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadRazorpayScript } from '@/lib/razorpay';
import { RazorpayButton } from './RazorpayButton';
import type { CoachingPackage } from '@shared/schema';

// Extended type to include paymentButtonId since we added it to mock data
interface ExtendedCoachingPackage extends CoachingPackage {
  paymentButtonId?: string;
}

interface PricingCardProps {
  title: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  index: number;
  packageId: string;
  category: string;
  paymentButtonId?: string;
}

function PricingCard({ title, price, duration, description, features, isPopular, buttonText, index, packageId, category, paymentButtonId }: PricingCardProps) {
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
      className={`relative ${isPopular ? 'scale-110 z-10' : ''}`}
    >
      <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl h-full ${isPopular
        ? 'glass-card ring-2 ring-brand-aqua shadow-xl'
        : 'glass-card border-brand-aqua/20 hover:border-brand-aqua/40'
        }`}>
        {/* Animated gradient background for popular card */}
        {isPopular && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 via-brand-aqua/5 to-brand-teal/5"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(0,55,82,0.05) 0%, rgba(64,143,164,0.05) 50%, rgba(0,55,82,0.05) 100%)',
                'linear-gradient(45deg, rgba(64,143,164,0.05) 0%, rgba(0,55,82,0.05) 50%, rgba(64,143,164,0.05) 100%)',
                'linear-gradient(45deg, rgba(0,55,82,0.05) 0%, rgba(64,143,164,0.05) 50%, rgba(0,55,82,0.05) 100%)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {isPopular && (
          <motion.div
            className="absolute top-0 left-0 right-0"
            initial={{ y: -20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
            transition={{ duration: 0.4, delay: index * 0.15 + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="bg-gradient-to-r from-brand-teal to-brand-aqua text-white text-center py-3 text-sm font-medium relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
              <Star className="w-4 h-4 inline mr-2" />
              Most Popular
              <Sparkles className="w-4 h-4 inline ml-2" />
            </div>
          </motion.div>
        )}

        <CardHeader className={`text-center relative z-10 ${isPopular ? 'pt-16' : 'pt-6'}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: index * 0.15 + 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
          >
            <CardTitle className="fluid-text-2xl font-bold text-brand-teal mb-6">{title}</CardTitle>
            <div className="mb-6">
              <motion.span
                className="fluid-text-4xl font-bold bg-gradient-to-r from-brand-teal to-brand-aqua bg-clip-text text-transparent"
                animate={isPopular ? {
                  scale: [1, 1.05, 1]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {price}
              </motion.span>
              <span className="text-muted-foreground fluid-text-base">/{duration}</span>
            </div>
            <CardDescription className="text-muted-foreground leading-relaxed fluid-text-sm">
              {description}
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="pt-0 relative z-10">
          <ul className="space-y-4 mb-8">
            {features.map((feature, featureIndex) => (
              <motion.li
                key={featureIndex}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.15 + featureIndex * 0.06 + 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <Check className="w-5 h-5 text-brand-aqua flex-shrink-0 mt-0.5" />
                </motion.div>
                <span className="text-muted-foreground fluid-text-sm">{feature}</span>
              </motion.li>
            ))}
          </ul>

          <div className="w-full flex justify-center min-h-[50px]">
            {paymentButtonId ? (
              <RazorpayButton paymentButtonId={paymentButtonId} />
            ) : (
              <div className="text-brand-teal font-medium">Contact for Pricing</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


import { client } from '@/lib/sanity';
import { MOCK_PACKAGES } from '@/lib/mock_data';

// Static map of ID and payment button IDs to ensure secure payments logic remains static
const PACKAGE_CONFIG: { [key: string]: { id: string; paymentButtonId: string } } = {
  'discover': { id: 'pkg_1', paymentButtonId: 'pl_RwDuOx96VYrsyN' },
  'discovery_plus': { id: 'pkg_2', paymentButtonId: 'pl_RwDq8XpK76OhB3' },
  'achieve': { id: 'pkg_3', paymentButtonId: 'pl_RwDxvLPQP7j4rG' },
  'achieve_plus': { id: 'pkg_4', paymentButtonId: 'pl_RwDzfVkQYEdAIf' },
  'ascend': { id: 'pkg_5', paymentButtonId: 'pl_RwE1evNHrHWJDW' },
  'ascend_plus': { id: 'pkg_6', paymentButtonId: 'pl_RwE3WEILWB9WeJ' }
};

export default function Pricing() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [activeCategory, setActiveCategory] = useState<'freshers' | 'middle-management' | 'senior-professionals'>('freshers');
  const { toast } = useToast();

  // Fetch packages from Sanity
  // NOTE: We fetch TEXT content from Sanity, but logic comes from static map
  const [sanityPackages, setSanityPackages] = useState<any[] | null>(null);

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
    {
      id: 'freshers' as const,
      title: 'Freshers',
      subtitle: 'Strategic career foundation & professional readiness'
    },
    {
      id: 'middle-management' as const,
      title: 'Middle Management',
      subtitle: 'Leadership development & strategic advancement'
    },
    {
      id: 'senior-professionals' as const,
      title: 'Senior Professionals',
      subtitle: 'Executive transformation & C-suite positioning'
    }
  ];


  // Transform API packages to match component structure
  // Transform API packages to match component structure
  const getPackageData = () => {
    const getCategoryInfo = (cat: string) => {
      switch (cat) {
        case 'senior-professionals':
          return {
            title: 'Packages for Senior Professionals',
            subtitle: 'Executive transformation & C-suite positioning',
            desc: 'For Senior Executives'
          };
        case 'middle-management':
          return {
            title: 'Packages for Middle Management',
            subtitle: 'Leadership development & strategic advancement',
            desc: 'For Working Professionals'
          };
        default:
          return {
            title: 'Packages for Freshers',
            subtitle: 'Strategic career foundation & professional readiness',
            desc: 'For College Graduates'
          };
      }
    };

    const info = getCategoryInfo(activeCategory);
    let packagesToDisplay = [];

    if (sanityPackages && sanityPackages.length > 0) {
      packagesToDisplay = sanityPackages
        .filter((pkg: any) => pkg.category === activeCategory)
        .map((pkg: any) => {
          const config = PACKAGE_CONFIG[pkg.packageType];
          // Determine ID securely
          const id = config ? config.id : `sanity-${pkg._id}`;
          // Determine button ID securely
          const paymentButtonId = config ? config.paymentButtonId : undefined;

          return {
            id,
            title: pkg.title,
            price: pkg.price ? `₹${pkg.price}` : 'Contact for Price',
            duration: 'package',
            description: pkg.description || info.desc,
            features: pkg.features || [],
            isPopular: pkg.isPopular,
            buttonText: config ? `Choose ${pkg.title}` : 'Contact Us',
            category: pkg.category,
            paymentButtonId
          };
        });
    } else {
      // Fallback
      packagesToDisplay = MOCK_PACKAGES
        .filter(pkg => pkg.category === activeCategory)
        .map(pkg => ({
          id: pkg.id,
          title: pkg.name,
          price: `₹${parseFloat(pkg.price).toLocaleString('en-IN')}`,
          duration: 'package',
          description: info.desc,
          features: pkg.features,
          isPopular: pkg.packageType === 'ascend_plus',
          buttonText: `Choose ${pkg.name}`,
          category: pkg.category,
          paymentButtonId: pkg.paymentButtonId
        }));
    }

    packagesToDisplay.sort((a: any, b: any) => a.id.localeCompare(b.id));

    return {
      heading: info.title,
      subheading: info.subtitle,
      packages: packagesToDisplay
    };
  };

  if (sanityPackages === null) return null;

  const packageData = getPackageData();

  return (
    <section id="pricing" className="py-16 md:py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-light/30 via-background to-brand-light/20" />
        <motion.div
          className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-brand-aqua/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tr from-brand-teal/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="fluid-text-5xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-brand-teal via-brand-aqua to-brand-teal bg-clip-text text-transparent">
              Invest in Your Future
            </span>
          </motion.h2>
          <motion.p
            className="fluid-text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Choose the perfect plan to accelerate your career growth and achieve your professional goals.
          </motion.p>
        </motion.div>

        {/* Category Selector Tabs */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 ${activeCategory === category.id
                    ? 'glass-card ring-2 ring-brand-aqua shadow-lg border-brand-aqua/40'
                    : 'glass-card border-brand-aqua/20 hover:border-brand-aqua/30 hover:shadow-md'
                    }`}
                  onClick={() => setActiveCategory(category.id)}
                  data-testid={`tab-${category.id}`}
                >
                  <CardHeader className="text-center p-6">
                    <CardTitle className={`fluid-text-xl font-bold mb-2 ${activeCategory === category.id
                      ? 'text-brand-teal'
                      : 'text-muted-foreground'
                      }`}>
                      {category.title}
                    </CardTitle>
                    <CardDescription className="fluid-text-sm leading-relaxed">
                      {category.subtitle}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Content Area */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Category Heading */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="fluid-text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-brand-teal via-brand-aqua to-brand-teal bg-clip-text text-transparent">
                {packageData.heading}
              </span>
            </h3>
            <p className="fluid-text-lg text-muted-foreground">
              {packageData.subheading}
            </p>
          </motion.div>

          {/* Package Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto justify-items-center">
            {packageData.packages?.map((pkg: any, index: number) => (
              <PricingCard
                key={`${activeCategory}-${index}`}
                title={pkg.title}
                price={pkg.price}
                duration={pkg.duration}
                description={pkg.description}
                features={pkg.features}
                isPopular={pkg.isPopular}
                buttonText={pkg.buttonText}
                packageId={pkg.id}
                category={pkg.category}
                index={index}
                paymentButtonId={pkg.paymentButtonId}
              />
            ))}
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {[
              "30-day satisfaction guarantee",
              "Flexible scheduling",
              "Online & In-person options",
              "Certified coaching"
            ].map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <Badge
                  variant="outline"
                  className="glass-card border-brand-aqua/30 text-brand-teal hover:border-brand-aqua/50 transition-all duration-300 px-4 py-2"
                >
                  {text}
                </Badge>
              </motion.div>
            ))}
          </div>
          <motion.p
            className="fluid-text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            All sessions can be conducted online or in-person based on your preference.
          </motion.p>
        </motion.div>
      </div>

      {/* Payment Contact Modal removed */}
    </section>
  );
}