import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onBookingClick: () => void;
  salon?: any;
}

export const Footer = ({ onBookingClick, salon }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  // Use salon data or fallback
  const contactInfo = {
    address: salon?.address || '123 Beauty Street, Downtown, City 12345',
    phone: salon?.phone || '(555) 123-4567',
    email: salon?.booking_email || 'hello@bloombeauty.com',
    hours: {
      weekdays: 'Mon-Fri: 9:00 AM - 7:00 PM',
      saturday: 'Saturday: 9:00 AM - 6:00 PM',
      sunday: 'Sunday: 10:00 AM - 5:00 PM',
    },
  };

  const services = [
    'Hair Styling & Cuts',
    'Hair Coloring',
    'Facial Treatments',
    'Bridal Packages',
    'Spa Treatments',
    'Express Services',
  ];

  const quickLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
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
                    {link.label === 'Contact' ? (
                      <Link
                        to={link.href}
                        className="text-white/80 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-white/80 hover:text-primary transition-colors"
                        onClick={(e) => {
                          if (link.href.startsWith('#')) {
                            e.preventDefault();
                            const element = document.querySelector(link.href);
                            element?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        {link.label}
                      </a>
                    )}
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
                  <li key={service} className="text-white/80">
                    {service}
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
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="text-white/80 hover:text-primary transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-white/80 text-sm">
                    <div>{contactInfo.hours.weekdays}</div>
                    <div>{contactInfo.hours.saturday}</div>
                    <div>{contactInfo.hours.sunday}</div>
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
              © {currentYear} Bloom Beauty Salon. All rights reserved.
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