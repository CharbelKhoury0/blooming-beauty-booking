import { motion } from 'framer-motion';
import { Award, Users, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Award-Winning Excellence',
    description: 'Recognized as the city\'s premier beauty destination with multiple industry awards.',
  },
  {
    icon: Users,
    title: 'Expert Stylists',
    description: 'Our team of certified professionals brings years of experience and ongoing education.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Online booking system with same-day appointments and extended evening hours.',
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description: 'Every service is tailored to your unique style, preferences, and lifestyle needs.',
  },
];

interface AboutSectionProps {
  salon?: any;
}

export const AboutSection = ({ salon }: AboutSectionProps) => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">About Us</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Why Choose {salon?.name || "Bloom Beauty"}?
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {salon?.about || "For over a decade, Bloom Beauty has been the trusted destination for luxury beauty services. We combine cutting-edge techniques with personalized care to help you look and feel your absolute best."}
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { number: '500+', label: 'Happy Clients' },
              { number: '10+', label: 'Years Experience' },
              { number: '50+', label: 'Services Offered' },
              { number: '5.0', label: 'Average Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-luxury p-6 text-center group hover:shadow-luxury transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};