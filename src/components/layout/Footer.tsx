import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface FooterProps {
  onBookingClick: () => void;
  salon?: any;
}

export const Footer = ({ salon, onBookingClick }: FooterProps) => {
  const [hoursOpen, setHoursOpen] = useState(false);

  // Use salon data or fallback
  const contactInfo = {
    phone: salon?.phone || '(555) 123-4567',
    address: salon?.address || '123 Beauty Lane, City, State 12345'
  };

  // Parse working_hours from the salon object
  const businessHours = salon?.working_hours
    ? salon.working_hours.split('|').map(item => {
        const [day, ...hoursArr] = item.split(':');
        return {
          day: day.trim(),
          time: hoursArr.join(':').trim(),
        };
      })
    : [];

  const services = [
    'Hair Styling & Cuts',
    'Hair Coloring',
    'Facial Treatments',
    'Bridal Packages',
    'Spa Treatments',
    'Express Services',
  ];

  const quickLinks = [
    { label: 'About Us', href: salon?.slug ? `/${salon.slug}/about` : '/about' },
    { label: 'Services', href: salon?.slug ? `/${salon.slug}/services` : '/services' },
    { label: 'Testimonials', href: salon?.slug ? `/${salon.slug}/testimonials` : '/testimonials' },
    { label: 'Contact', href: salon?.slug ? `/${salon.slug}/contact` : '/contact' },
    { label: 'Privacy Policy', href: salon?.slug ? `/${salon.slug}/privacy-policy` : '/privacy-policy' },
    { label: 'Terms of Service', href: salon?.slug ? `/${salon.slug}/terms-of-service` : '/terms-of-service' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <footer id="contact" className="bg-foreground text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
                <span className="font-heading text-xl font-semibold">{salon?.name || "Bloom Beauty"}</span>
              </div>
              <p className="text-white/80 leading-relaxed mb-6">
                Transform your look at our luxury beauty salon. Professional services 
                in an elegant, relaxing environment with expert stylists who care about you.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-heading text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-white/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-heading text-lg font-semibold mb-6">Our Services</h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service}>
                    <Link
                      to={salon?.slug ? `/${salon.slug}/services` : '/services'}
                      className="text-white/80 hover:text-primary transition-colors"
                    >
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-heading text-lg font-semibold mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{contactInfo.address}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a 
                    href={`tel:${contactInfo.phone}`}
                    className="text-white/80 hover:text-primary transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="w-full">
                    {businessHours.length > 0 && (
                      <div>
                        <button
                          type="button"
                          className="w-full flex justify-between items-center px-3 py-2 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200 group"
                          onClick={() => setHoursOpen(o => !o)}
                        >
                          <span className="text-white/90 text-sm font-body font-medium">Business Hours</span>
                          <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${hoursOpen ? 'rotate-180' : ''} group-hover:text-white/90`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${hoursOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                          <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                            <div className="space-y-2">
                              {businessHours.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-1">
                                  <span className="text-white/70 text-sm font-body">{item.day}</span>
                                  <span className={`text-sm font-body font-medium ${item.time === 'Closed' ? 'text-red-400' : 'text-white/90'}`}>
                                    {item.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Book Now CTA */}
              <Button
                onClick={onBookingClick}
                variant="luxury"
                size="lg"
                className="w-full mt-6"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </Button>
            </motion.div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-white/60 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Bloom Beauty Salon. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-white/60">
              <Link to={`/${salon?.slug || ''}/privacy-policy`} className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to={`/${salon?.slug || ''}/terms-of-service`} className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to={`/${salon?.slug || ''}/cancellation-policy`} className="hover:text-primary transition-colors">
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};