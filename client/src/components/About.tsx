import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, TrendingUp, Star } from 'lucide-react';

export default function About() {
  // TODO: Fix image import path after build setup
  const profilePath = "/attached_assets/profile_1759131412191.JPG";
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const achievements = [
    { icon: <Award className="w-5 h-5" />, label: "Certified Coach", value: "ICF Certified" },
    { icon: <Users className="w-5 h-5" />, label: "Success Stories", value: "500+ Clients" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Avg. Salary Increase", value: "45%" },
    { icon: <Star className="w-5 h-5" />, label: "Client Rating", value: "4.9/5" }
  ];
  
  return (
    <section id="about" className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-brand-aqua/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Profile Image */}
          <motion.div 
            ref={ref}
            className="order-2 lg:order-1 flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative group">
              {/* Animated background glow */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-brand-teal/30 to-brand-aqua/30 rounded-2xl blur-xl"
                animate={{
                  rotate: [0, 6, -6, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Floating particles around image */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-brand-aqua/40 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${15 + (i % 2) * 70}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }}
                />
              ))}
              
              <motion.img
                src={profilePath}
                alt="Roy Johnson - Career Coach"
                className="relative w-80 h-80 md:w-96 md:h-96 object-cover rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500"
                data-testid="img-roy-profile"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Gradient overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-brand-teal/20 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="fluid-text-5xl font-bold text-brand-teal mb-4">
                Meet 
                <motion.span
                  className="bg-gradient-to-r from-brand-teal to-brand-aqua bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Roy Johnson
                </motion.span>
              </h2>
              <motion.p 
                className="fluid-text-xl text-brand-aqua font-medium"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Your Strategic Career Partner
              </motion.p>
            </motion.div>

            <motion.div 
              className="space-y-6 fluid-text-lg text-muted-foreground leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                With over 15 years of experience in talent development and professional coaching, 
                Roy Johnson founded Career Plans with a single mission: to empower individuals to 
                take control of their professional lives. He believes that a fulfilling career is 
                not found by chance, but built by design.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Roy's approach combines deep industry insight with personalized, data-driven strategies. 
                He specializes in helping professionals at all levels—from recent graduates to seasoned 
                executives—navigate the complexities of the modern job market, build on their strengths, 
                and create actionable plans for success.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                Whether you're seeking a promotion, changing industries, or just starting your career, 
                Roy is the dedicated partner you need to turn your career ambitions into reality.
              </motion.p>
            </motion.div>

            {/* Achievement Cards */}
            <motion.div 
              className="grid grid-cols-2 gap-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="glass-card p-4 rounded-xl border border-brand-aqua/20 hover:border-brand-aqua/40 transition-all duration-300 group hover:shadow-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-brand-aqua group-hover:text-brand-teal transition-colors duration-300">
                      {achievement.icon}
                    </div>
                    <div className="font-semibold text-brand-teal fluid-text-sm">
                      {achievement.label}
                    </div>
                  </div>
                  <div className="text-muted-foreground fluid-text-xs font-medium">
                    {achievement.value}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Credentials/Highlights */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              <motion.div 
                className="glass-card rounded-lg p-6 border border-brand-aqua/20 hover:border-brand-aqua/40 transition-all duration-300 hover:shadow-lg group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="font-bold text-brand-teal fluid-text-sm mb-2 group-hover:text-brand-aqua transition-colors duration-300">Specialization</div>
                <div className="fluid-text-xs text-muted-foreground">Career Transitions & Leadership Development</div>
              </motion.div>
              <motion.div 
                className="glass-card rounded-lg p-6 border border-brand-aqua/20 hover:border-brand-aqua/40 transition-all duration-300 hover:shadow-lg group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="font-bold text-brand-teal fluid-text-sm mb-2 group-hover:text-brand-aqua transition-colors duration-300">Industries</div>
                <div className="fluid-text-xs text-muted-foreground">Tech, Finance, Healthcare, Consulting</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}