import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onBookingClick: () => void;
  salonName?: string;
  slug?: string;
  alwaysTransparent?: boolean;
}

export const Navbar = ({ onBookingClick, salonName = "Bloom Beauty", slug, alwaysTransparent = false }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling and position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isHomePage = location.pathname === `/${slug}`;

  const navItems = [
    { label: 'Home', href: slug ? `/${slug}` : '/' },
    { label: 'Services', href: slug ? `/${slug}/services` : '/services' },
    { label: 'About', href: slug ? `/${slug}/about` : '/about' },
    { label: 'Testimonials', href: slug ? `/${slug}/testimonials` : '/testimonials' },
    { label: 'Contact', href: slug ? `/${slug}/contact` : '/contact' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        alwaysTransparent
          ? 'bg-transparent'
          : isScrolled 
            ? 'bg-white shadow-soft' 
            : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to={slug ? `/${slug}` : '/'}>
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
              <span className="font-heading text-xl md:text-2xl font-semibold text-foreground">
                {salonName}
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              variant="luxury"
              size="lg"
              onClick={onBookingClick}
              className="font-medium"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop with blur effect */}
              <motion.div
                className="fixed inset-0 bg-black/30 z-40 md:hidden touch-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ touchAction: 'none' }}
              />
              {/* Mobile Menu Content */}
              <motion.div
                className="md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-soft z-50 p-6 overflow-y-auto"
                initial={{ x: 320 }}
                animate={{ x: 0 }}
                exit={{ x: 320 }}
                transition={{ 
                  type: "tween",
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                <div className="space-y-6">
                  {/* Close button */}
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-foreground hover:text-primary"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                  
                  {/* Navigation items */}
                  <div className="space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="block text-foreground hover:text-primary transition-colors duration-300 font-medium py-3 text-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  </div>
                  
                  {/* CTA Button */}
                  <div className="pt-4">
                  <Button
                    variant="luxury"
                    size="lg"
                    onClick={() => {
                      onBookingClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full font-medium"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Now
                  </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};