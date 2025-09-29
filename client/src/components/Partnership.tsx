import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, GraduationCap, Play, ExternalLink } from 'lucide-react';

export default function Partnership() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const statistics = [
    {
      icon: <Users className="w-8 h-8" />,
      number: '3,50,000+',
      description: 'Students and Professionals Mentored',
      color: 'bg-blue-500'
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      number: '240+',
      description: 'Corporate Partners',
      color: 'bg-purple-500'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      number: '350+',
      description: 'Schools and College Partners',
      color: 'bg-green-500'
    },
    {
      icon: <Play className="w-8 h-8" />,
      number: '1000+',
      description: 'Hours of Career Webinars',
      color: 'bg-red-500'
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-brand-light/20 via-background to-brand-light/10">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 left-0 w-96 h-96 bg-gradient-to-br from-brand-teal/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-tr from-brand-aqua/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, -40, 0]
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
            className="fluid-text-4xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-brand-teal via-brand-aqua to-brand-teal bg-clip-text text-transparent">
              Powered by Mentoria's
            </span>
            <br />
            <span className="text-brand-teal">
              Career Discovery Platform
            </span>
          </motion.h2>
          <motion.p 
            className="fluid-text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Every Leadcrest Consulting plan includes lifetime access to Mentoria: India's most trusted platform for career discovery, mentorship, and lifelong upskilling.
          </motion.p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.6 + index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <Card className="glass-card border-brand-aqua/20 hover:border-brand-aqua/40 transition-all duration-500 hover:shadow-xl h-full">
                <CardContent className="p-8">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl ${stat.color} flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.h3 
                    className="fluid-text-3xl font-bold text-brand-teal mb-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    {stat.number}
                  </motion.h3>
                  <motion.p 
                    className="fluid-text-sm text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  >
                    {stat.description}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mentoria Platform CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Card className="glass-card border-brand-aqua/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-teal to-brand-aqua rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-brand-teal fluid-text-lg">MENTORIA</div>
                    <div className="text-muted-foreground fluid-text-sm">Career Discovery Platform</div>
                  </div>
                </motion.div>
                <ExternalLink className="w-5 h-5 text-brand-aqua" />
              </div>
              
              <motion.p 
                className="fluid-text-sm text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                Click to explore Mentoria's comprehensive career platform
              </motion.p>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="bg-gradient-to-r from-brand-teal to-brand-aqua hover:from-brand-teal/90 hover:to-brand-aqua/90 text-white px-8 py-3 fluid-text-base relative overflow-hidden"
                  onClick={() => window.open('https://mentoria.com', '_blank')}
                  data-testid="button-explore-mentoria"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Platform
                    <ExternalLink className="w-4 h-4" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}