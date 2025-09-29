import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

function PricingCard({ title, price, duration, description, features, isPopular, buttonText }: PricingCardProps) {
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      isPopular 
        ? 'ring-2 ring-brand-aqua bg-gradient-to-br from-background to-brand-light/50' 
        : 'bg-background/80 backdrop-blur-sm hover:bg-background'
    }`}>
      {isPopular && (
        <div className="absolute top-0 left-0 right-0">
          <div className="bg-gradient-to-r from-brand-teal to-brand-aqua text-white text-center py-2 text-sm font-medium">
            <Star className="w-4 h-4 inline mr-1" />
            Most Popular
          </div>
        </div>
      )}
      
      <CardHeader className={`text-center ${isPopular ? 'pt-12' : 'pt-6'}`}>
        <CardTitle className="text-2xl font-bold text-brand-teal">{title}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold text-brand-teal">{price}</span>
          <span className="text-muted-foreground">/{duration}</span>
        </div>
        <CardDescription className="mt-4 text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-brand-aqua flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          className={`w-full font-semibold py-3 ${
            isPopular
              ? 'bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white'
              : 'bg-background border-2 border-brand-aqua text-brand-teal hover:bg-brand-aqua/10'
          }`}
          onClick={() => console.log(`${buttonText} clicked for ${title}`)}
          data-testid={`button-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Pricing() {
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
    <section id="pricing" className="py-16 md:py-24 bg-gradient-to-br from-brand-light/30 via-background to-brand-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-teal mb-6">
            Invest in Your Future
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan to accelerate your career growth and achieve your professional goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
            />
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground mb-4">
            <Badge variant="outline" className="border-brand-aqua/20 text-brand-teal">
              30-day satisfaction guarantee
            </Badge>
            <Badge variant="outline" className="border-brand-aqua/20 text-brand-teal">
              Flexible scheduling
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            All sessions can be conducted online or in-person based on your preference.
          </p>
        </div>
      </div>
    </section>
  );
}