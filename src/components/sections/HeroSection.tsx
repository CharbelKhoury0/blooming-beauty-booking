import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Star, Award } from 'lucide-react';
import heroImage from '@/assets/hero-salon.jpg';

interface HeroSectionProps {
  onBookingClick: () => void;
  salon?: any;
}

export const HeroSection = ({ onBookingClick, salon }: HeroSectionProps) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury beauty salon interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-white/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20"
            >
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Award-Winning Salon</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight"
            >
              Transform Your Look at{' '}
              <span className="gradient-text">{salon?.name || "Bloom Beauty"}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              {salon?.tagline || "Experience luxury hair styling, beauty treatments, and spa services in our elegant salon. Where artistry meets relaxation."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                variant="luxury"
                size="xl"
                onClick={onBookingClick}
                className="font-semibold"
              >
                <Calendar className="w-5 h-5" />
                Book Your Appointment
              </Button>
              <Button
                variant="outline-luxury"
                size="xl"
                onClick={() => {
                  const element = document.querySelector('#services');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-semibold"
              >
                View Services
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-wrap items-center gap-6 pt-8"
            >
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">5.0 Google Reviews</span>
              </div>
              <div className="text-sm text-muted-foreground border-l border-border pl-6">
                500+ Happy Clients
              </div>
              <div className="text-sm text-muted-foreground border-l border-border pl-6">
                10+ Years Experience
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
};