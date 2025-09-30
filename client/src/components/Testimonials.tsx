import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote, Star } from 'lucide-react';

export default function Testimonials() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Senior Product Manager",
      company: "Tech Innovators Inc.",
      content: "Roy's guidance was transformative. Within 6 months of our sessions, I secured a leadership role with a 40% salary increase. His strategic approach to career planning is unmatched.",
      rating: 5,
      image: null
    },
    {
      name: "James Patterson",
      role: "Marketing Director",
      company: "Global Brands Ltd.",
      content: "After feeling stuck in my career for years, Roy helped me identify my strengths and pivot to a role that truly aligns with my passions. The personalized roadmap he created was a game-changer.",
      rating: 5,
      image: null
    },
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      company: "CloudTech Solutions",
      content: "As a fresher, I was overwhelmed by career choices. Roy's structured approach and industry insights helped me land my dream job at a top tech company. Highly recommend!",
      rating: 5,
      image: null
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-l from-brand-teal/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          ref={ref}
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 bg-brand-teal/10 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-brand-teal fill-current" />
              <span className="text-brand-teal font-semibold">Client Success Stories</span>
            </div>
          </motion.div>
          
          <h2 className="fluid-text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-brand-teal to-brand-aqua bg-clip-text text-transparent">
              What Our Clients Say
            </span>
          </h2>
          
          <p className="fluid-text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from professionals who transformed their careers with strategic guidance
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3 + index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              data-testid={`testimonial-card-${index}`}
            >
              {/* Animated gradient background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-brand-teal/20 via-brand-aqua/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              <div className="relative glass-card p-6 md:p-8 rounded-2xl border border-brand-aqua/20 hover:border-brand-aqua/40 transition-all duration-300 h-full flex flex-col">
                {/* Quote icon */}
                <motion.div
                  className="mb-4"
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Quote className="w-10 h-10 text-brand-aqua/30" />
                </motion.div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.5 + index * 0.1 + i * 0.05 
                      }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground fluid-text-base leading-relaxed mb-6 flex-grow" data-testid={`text-testimonial-content-${index}`}>
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-brand-aqua/20">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-teal to-brand-aqua flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground" data-testid={`text-testimonial-name-${index}`}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-brand-aqua" data-testid={`text-testimonial-company-${index}`}>
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-muted-foreground fluid-text-lg">
            Join hundreds of professionals who've transformed their careers
          </p>
        </motion.div>
      </div>
    </section>
  );
}
