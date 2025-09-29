import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Sparkles } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  index: number;
}

function PricingCard({ title, price, duration, description, features, isPopular, buttonText, index }: PricingCardProps) {
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
        duration: 0.6, 
        delay: index * 0.2,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      className={`relative ${isPopular ? 'scale-110 z-10' : ''}`}
    >
      <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl h-full ${
        isPopular 
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
            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
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
            transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
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
                  duration: 0.4, 
                  delay: index * 0.2 + featureIndex * 0.1 + 0.6
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
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className={`w-full font-semibold py-4 fluid-text-base relative overflow-hidden ${
                isPopular
                  ? 'bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white shadow-lg'
                  : 'glass-card border-2 border-brand-aqua text-brand-teal hover:bg-brand-aqua/10'
              }`}
              onClick={() => console.log(`${buttonText} clicked for ${title}`)}
              data-testid={`button-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="relative z-10">{buttonText}</span>
              {isPopular && (
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
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Pricing() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const plans = [
    {
      title: 'Clarity Session',
      price: '₹4,999',
      duration: 'session',
      description: '90-minute deep-dive session with comprehensive career assessment and personalized action plan.',
      features: [
        'Comprehensive career assessment',
        'Personalized action plan',
        'Industry insights and trends',
        'Goal setting framework',
        'Follow-up resource guide'
      ],
      buttonText: 'Book Session'
    },
    {
      title: 'Career Accelerator',
      price: '₹19,999',
      duration: 'package',
      description: '4 comprehensive sessions including resume optimization, LinkedIn revamp, and interview preparation.',
      features: [
        '4 one-on-one coaching sessions',
        'Resume and cover letter optimization',
        'LinkedIn profile transformation',
        'Interview preparation and practice',
        'Salary negotiation strategies',
        '30-day email support'
      ],
      isPopular: true,
      buttonText: 'Get Started'
    },
    {
      title: 'Executive Package',
      price: '₹29,999',
      duration: 'package',
      description: '6 sessions focused on long-term career strategy with ongoing support for senior professionals.',
      features: [
        '6 executive coaching sessions',
        'Long-term career strategy development',
        'Leadership skills assessment',
        'Executive presence coaching',
        'Network building strategies',
        '90-day ongoing support',
        'Priority scheduling'
      ],
      buttonText: 'Invest Now'
    }
  ];

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-center">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              duration={plan.duration}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
              buttonText={plan.buttonText}
              index={index}
            />
          ))}
        </div>

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
    </section>
  );
}