import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, FileText, MessageSquare, ArrowRight, Users, TrendingUp, Award, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/sanity';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  index: number;
}

// Icon mapping
const iconMap: { [key: string]: any } = {
  Target,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  Award,
  Briefcase
};

function ServiceCard({ icon, title, description, features, index }: ServiceCardProps) {
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
        transition: { duration: 0.2 }
      }}
    >
      <Card className="group glass-card border-brand-aqua/20 hover:border-brand-aqua/40 transition-all duration-500 hover:shadow-xl h-full relative overflow-hidden">
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 to-brand-aqua/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        <CardHeader className="pb-4 relative z-10">
          <motion.div
            className="mb-4 p-4 bg-gradient-to-br from-brand-teal/10 to-brand-aqua/10 rounded-2xl w-fit group-hover:from-brand-teal/20 group-hover:to-brand-aqua/20 transition-all duration-300 group-hover:scale-110"
            whileHover={{ rotate: 5 }}
          >
            <div className="text-brand-teal group-hover:text-brand-aqua transition-colors duration-300 text-2xl">
              {icon}
            </div>
          </motion.div>
          <CardTitle className="fluid-text-xl font-bold text-brand-teal group-hover:text-brand-aqua transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed fluid-text-sm">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <ul className="space-y-3 mb-6">
            {features?.map((feature, featureIndex) => (
              <motion.li
                key={featureIndex}
                className="flex items-start gap-3 text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.15 + featureIndex * 0.06 + 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <motion.div
                  className="w-2 h-2 bg-brand-aqua rounded-full mt-1.5 flex-shrink-0"
                  whileHover={{ scale: 1.5 }}
                />
                {feature}
              </motion.li>
            ))}
          </ul>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className="w-full glass-card border-brand-aqua/40 text-brand-teal hover:bg-brand-aqua/10 group/btn transition-all duration-300"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              data-testid={`button-learn-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              Learn More
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Services() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [services, setServices] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const query = `*[_type == "service"]`;
        const result = await client.fetch(query);
        const mappedResult = result.map((s: any) => ({
          ...s,
          icon: iconMap[s.icon] ? iconMap[s.icon] : <Target className="w-8 h-8" />
        }));
        setServices(mappedResult);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setServices([]);
      }
    };

    fetchServices();
  }, []);

  const fallbackServices = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Strategic Career Planning',
      description: 'Helping you define and achieve your long-term professional goals with a clear roadmap.',
      features: [
        'Comprehensive career assessment',
        'Goal setting and milestone planning',
        'Industry trend analysis',
        'Skill gap identification',
        'Career transition strategies'
      ]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Resume & LinkedIn Optimization',
      description: 'Crafting a powerful personal brand that gets you noticed by the right people.',
      features: [
        'ATS-optimized resume writing',
        'LinkedIn profile optimization',
        'Personal branding strategy',
        'Portfolio development',
        'Professional storytelling'
      ]
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Interview Preparation & Coaching',
      description: 'Building the confidence and skills to ace any interview with proven techniques.',
      features: [
        'Mock interview sessions',
        'Behavioral question preparation',
        'Salary negotiation strategies',
        'Body language coaching',
        'Follow-up best practices'
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Career Transition Support',
      description: 'Guiding you through the process of changing roles or industries smoothly.',
      features: [
        'Industry change guidance',
        'Transferable skills analysis',
        'Network building strategies',
        'Risk assessment and planning',
        'Timeline development'
      ]
    }
  ];

  // If loading (null), specific handling (e.g. return null or skeleton).
  // Per instruction: "// Still loading -> render nothing (or skeleton)"
  if (services === null) return null;

  const displayServices = services.length > 0 ? services.map((s: any) => ({
    icon: s.icon ? <s.icon className="w-8 h-8" /> : <Target className="w-8 h-8" />,
    title: s.title,
    description: s.description,
    features: s.features || []
  })) : fallbackServices;

  return (
    <section id="services" className="py-16 md:py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-light/30 via-background to-brand-light/20">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-aqua/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-brand-teal/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2]
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
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h2
            className="fluid-text-5xl font-bold text-brand-teal mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.68, -0.55, 0.265, 1.55] }}
          >
            How We Help You Succeed
          </motion.h2>
          <motion.p
            className="fluid-text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Comprehensive career guidance tailored to your unique professional journey and aspirations.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {displayServices.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}