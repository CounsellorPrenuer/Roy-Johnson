import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, FileText, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

function ServiceCard({ icon, title, description, features }: ServiceCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-background/80 backdrop-blur-sm border-brand-aqua/20 hover:border-brand-aqua/40">
      <CardHeader className="pb-4">
        <div className="mb-4 p-3 bg-gradient-to-br from-brand-teal/10 to-brand-aqua/10 rounded-xl w-fit group-hover:from-brand-teal/20 group-hover:to-brand-aqua/20 transition-all duration-300">
          <div className="text-brand-teal group-hover:text-brand-aqua transition-colors duration-300">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl font-semibold text-brand-teal group-hover:text-brand-aqua transition-colors duration-300">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-brand-aqua rounded-full mt-2 flex-shrink-0"></div>
              {feature}
            </li>
          ))}
        </ul>
        <Button 
          variant="outline"
          className="w-full border-brand-aqua/40 text-brand-teal hover:bg-brand-aqua/10 group/btn"
          onClick={() => console.log(`Learn more about ${title}`)}
          data-testid={`button-learn-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          Learn More
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Services() {
  const services = [
    {
      icon: <Target className="w-6 h-6" />,
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
      icon: <FileText className="w-6 h-6" />,
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
      icon: <MessageSquare className="w-6 h-6" />,
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
      icon: <ArrowRight className="w-6 h-6" />,
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

  return (
    <section id="services" className="py-16 md:py-24 bg-brand-light/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-teal mb-6">
            How We Help You Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive career guidance tailored to your unique professional journey and aspirations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
}