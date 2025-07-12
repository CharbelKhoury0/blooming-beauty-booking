import { motion } from 'framer-motion';
import { Scissors, Palette, Sparkles, Crown, Heart, Zap } from 'lucide-react';
import { ServiceCard } from '@/components/cards/ServiceCard';

// CMS-ready service data structure
export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  icon: any;
  popular?: boolean;
  image?: string;
}

const services: Service[] = [
  {
    id: '1',
    name: 'Hair Styling & Cut',
    description: 'Professional cuts, styling, and blow-dry services tailored to your face shape and lifestyle.',
    price: 'From $85',
    duration: '60-90 min',
    icon: Scissors,
    popular: true,
  },
  {
    id: '2',
    name: 'Hair Coloring',
    description: 'Full color, highlights, balayage, and color correction by our expert colorists.',
    price: 'From $120',
    duration: '2-4 hours',
    icon: Palette,
    popular: true,
  },
  {
    id: '3',
    name: 'Facial Treatments',
    description: 'Rejuvenating facials using premium skincare products for glowing, healthy skin.',
    price: 'From $95',
    duration: '60-75 min',
    icon: Sparkles,
  },
  {
    id: '4',
    name: 'Bridal Package',
    description: 'Complete bridal beauty package including hair, makeup, and trial sessions.',
    price: 'From $350',
    duration: '4-6 hours',
    icon: Crown,
  },
  {
    id: '5',
    name: 'Spa Treatments',
    description: 'Relaxing massage, body treatments, and wellness services for total rejuvenation.',
    price: 'From $110',
    duration: '60-90 min',
    icon: Heart,
  },
  {
    id: '6',
    name: 'Express Services',
    description: 'Quick touch-ups, eyebrow shaping, and express treatments for busy schedules.',
    price: 'From $35',
    duration: '15-30 min',
    icon: Zap,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Services</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Luxury Beauty Services
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From precision cuts to rejuvenating treatments, discover our full range 
            of premium beauty and wellness services designed to make you look and feel amazing.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              We offer customized beauty solutions. Contact us to discuss your specific needs 
              and create a personalized treatment plan.
            </p>
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};