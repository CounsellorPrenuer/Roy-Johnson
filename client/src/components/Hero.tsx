import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    console.log(`Scrolling to ${sectionId}`);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-light via-background to-brand-light">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-brand-aqua/20 to-brand-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-brand-teal/20 to-brand-aqua/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-brand-aqua/10 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8">
            <Badge 
              variant="outline" 
              className="inline-flex items-center px-4 py-2 bg-background/80 backdrop-blur-sm border-brand-aqua/20 text-brand-teal font-medium"
              data-testid="badge-future-proofing"
            >
              Future-proofing careers in the age of digital transformation
            </Badge>
          </div>

          {/* Main Headlines */}
          <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl mb-6 bg-gradient-to-r from-brand-teal via-brand-teal to-brand-aqua bg-clip-text text-transparent leading-tight">
            <div className="mb-2">Chart Your</div>
            <div className="mb-2">Career</div>
            <div className="mb-2">Trajectory</div>
            <div className="text-4xl md:text-5xl lg:text-6xl text-brand-teal/80">with Clarity</div>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Expert career planning and guidance to help you navigate your professional journey with clarity and confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => scrollToSection('services')}
              className="bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white font-semibold px-8 py-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              data-testid="button-explore-services"
            >
              Explore Services
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => console.log('Free consultation clicked')}
              className="border-brand-aqua text-brand-teal hover:bg-brand-aqua/10 font-semibold px-8 py-3 text-lg backdrop-blur-sm bg-background/80 hover:scale-105 transition-all duration-300"
              data-testid="button-free-consultation"
            >
              Book a Free Consultation
            </Button>
          </div>

          {/* Trust Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-brand-aqua/20 hover:border-brand-aqua/40 transition-all duration-300 hover:shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-brand-teal mb-2" data-testid="stat-experience">
                15+
              </div>
              <div className="text-muted-foreground font-medium">
                Years of Industry Experience
              </div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-brand-aqua/20 hover:border-brand-aqua/40 transition-all duration-300 hover:shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-brand-teal mb-2" data-testid="stat-professionals">
                500+
              </div>
              <div className="text-muted-foreground font-medium">
                Professionals Guided
              </div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-brand-aqua/20 hover:border-brand-aqua/40 transition-all duration-300 hover:shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-brand-teal mb-2" data-testid="stat-success">
                98%
              </div>
              <div className="text-muted-foreground font-medium">
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}