export default function About() {
  // TODO: Fix image import path after build setup
  const profilePath = "/attached_assets/profile_1759131412191.JPG";
  
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Profile Image */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/20 to-brand-aqua/20 rounded-2xl blur-xl transform rotate-6"></div>
              <img
                src={profilePath}
                alt="Roy Johnson - Career Coach"
                className="relative w-80 h-80 md:w-96 md:h-96 object-cover rounded-2xl shadow-2xl"
                data-testid="img-roy-profile"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-teal mb-4">
                Meet Roy Johnson
              </h2>
              <p className="text-2xl text-brand-aqua font-medium">
                Your Strategic Career Partner
              </p>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                With over 15 years of experience in talent development and professional coaching, 
                Roy Johnson founded Career Plans with a single mission: to empower individuals to 
                take control of their professional lives. He believes that a fulfilling career is 
                not found by chance, but built by design.
              </p>
              
              <p>
                Roy's approach combines deep industry insight with personalized, data-driven strategies. 
                He specializes in helping professionals at all levels—from recent graduates to seasoned 
                executives—navigate the complexities of the modern job market, build on their strengths, 
                and create actionable plans for success.
              </p>
              
              <p>
                Whether you're seeking a promotion, changing industries, or just starting your career, 
                Roy is the dedicated partner you need to turn your career ambitions into reality.
              </p>
            </div>

            {/* Credentials/Highlights */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-brand-light/50 rounded-lg p-4 border border-brand-aqua/20">
                <div className="font-semibold text-brand-teal">Specialization</div>
                <div className="text-sm text-muted-foreground">Career Transitions & Leadership Development</div>
              </div>
              <div className="bg-brand-light/50 rounded-lg p-4 border border-brand-aqua/20">
                <div className="font-semibold text-brand-teal">Industries</div>
                <div className="text-sm text-muted-foreground">Tech, Finance, Healthcare, Consulting</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}