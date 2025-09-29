import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInView } from 'react-intersection-observer';

// Animated SVG components
const TrajectoryLine = () => (
  <svg 
    className="absolute inset-0 w-full h-full opacity-20" 
    viewBox="0 0 800 600" 
    fill="none"
  >
    <motion.path
      d="M50,300 Q200,100 400,200 T750,150"
      stroke="url(#trajectoryGradient)"
      strokeWidth="3"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 3, ease: "easeInOut", delay: 1 }}
    />
    <defs>
      <linearGradient id="trajectoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#003752" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#408FA4" stopOpacity="0.8" />
      </linearGradient>
    </defs>
  </svg>
);

const FloatingOrbs = () => (
  <>
    <motion.div
      className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-brand-aqua/30 to-brand-teal/20 rounded-full blur-xl"
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute bottom-1/3 left-1/5 w-24 h-24 bg-gradient-to-tr from-brand-teal/20 to-brand-aqua/30 rounded-full blur-2xl"
      animate={{
        y: [0, 15, 0],
        x: [0, 10, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
    />
  </>
);

const ParticleField = () => {
  const particles = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-brand-aqua/40 rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 5,
      }}
    />
  ));
  
  return <div className="absolute inset-0 overflow-hidden">{particles}</div>;
};

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    console.log(`Scrolling to ${sectionId}`);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `
          var(--gradient-mesh),
          radial-gradient(ellipse at center, rgba(248, 249, 250, 0.9) 0%, rgba(248, 249, 250, 1) 100%)
        `
      }}
    >
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: y1, opacity }}
      >
        <FloatingOrbs />
        <ParticleField />
        <TrajectoryLine />
      </motion.div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 backdrop-blur-[0.5px]" />

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
        style={{ y: y2 }}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <div className="text-center">
          {/* Animated Badge */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <Badge 
              variant="outline" 
              className="glass-card border-brand-aqua/30 text-brand-teal font-medium px-6 py-3 text-sm hover:shadow-lg transition-all duration-300"
              data-testid="badge-future-proofing"
            >
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block w-2 h-2 bg-brand-aqua rounded-full mr-2"
              />
              Future-proofing careers in the age of digital transformation
            </Badge>
          </motion.div>

          {/* Main Headlines with Animated Text */}
          <motion.div variants={itemVariants}>
            <h1 className="font-bold fluid-text-6xl mb-6 leading-tight">
              <motion.div 
                className="mb-2 bg-gradient-to-r from-brand-teal via-brand-teal to-brand-aqua bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -50 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Chart Your
              </motion.div>
              <motion.div 
                className="mb-2 bg-gradient-to-r from-brand-teal via-brand-aqua to-brand-teal bg-clip-text text-transparent"
                initial={{ opacity: 0, x: 50 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Career
              </motion.div>
              <motion.div 
                className="mb-2 bg-gradient-to-r from-brand-aqua via-brand-teal to-brand-aqua bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Trajectory
              </motion.div>
              <motion.div 
                className="fluid-text-4xl text-brand-teal/80 font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                with Clarity
              </motion.div>
            </h1>
          </motion.div>

          {/* Sub-headline */}
          <motion.p 
            className="fluid-text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
            variants={itemVariants}
          >
            Expert career planning and guidance to help you navigate your professional journey with clarity and confidence.
          </motion.p>

          {/* CTA Buttons with Shimmer Effect */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => scrollToSection('services')}
                className="relative overflow-hidden bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white font-semibold px-8 py-4 fluid-text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                data-testid="button-explore-services"
              >
                <span className="relative z-10">Explore Services</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    ease: "easeInOut" 
                  }}
                />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => console.log('Free consultation clicked')}
                className="glass-card border-brand-aqua text-brand-teal hover:bg-brand-aqua/10 font-semibold px-8 py-4 fluid-text-lg transition-all duration-300 hover:shadow-lg"
                data-testid="button-free-consultation"
              >
                Book a Free Consultation
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated Trust Statistics */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={statsVariants}
          >
            {[
              { number: "15+", label: "Years of Industry Experience", testId: "stat-experience" },
              { number: "500+", label: "Professionals Guided", testId: "stat-professionals" },
              { number: "98%", label: "Success Rate", testId: "stat-success" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-xl p-6 border border-brand-aqua/20 hover:border-brand-aqua/40 transition-all duration-300 hover:shadow-xl group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="fluid-text-4xl font-bold text-brand-teal mb-2"
                  data-testid={stat.testId}
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1.2 + index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-muted-foreground font-medium fluid-text-sm group-hover:text-brand-teal transition-colors duration-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}