import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon } from '@/types/salon';
import { motion } from 'framer-motion';
import { Heart, Award, Users, Star, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookingModal } from '@/components/booking/BookingModal';
import heroSalon from '@/assets/hero-salon.jpg';

const ValueCard = ({ icon, title, description }) => (
  <Card className="border-none shadow-sm">
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className="bg-primary/10 p-3 rounded-full mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </CardContent>
  </Card>
);

const About = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string>();
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);

  useEffect(() => {
    const fetchSalon = async () => {
      if (!slug) return;
      try {
        // Fetch salon by slug
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('*')
          .eq('slug', slug)
          .single();

        if (salonError || !salonData) {
          setLoading(false);
          return;
        }

        // Fetch services and stylists for booking modal
        const [servicesResult, stylistsResult] = await Promise.all([
          supabase.from('services').select('*').eq('salon_id', salonData.id),
          supabase.from('stylists').select('*').eq('salon_id', salonData.id)
        ]);

        setSalon(salonData);
        setServices(servicesResult.data || []);
        setStylists(stylistsResult.data || []);
      } catch (error) {
        // Handle error silently for now
        // In production, you might want to log this to an error tracking service
      } finally {
        setLoading(false);
      }
    };
    fetchSalon();
  }, [slug]);

  const handleBookingClick = (serviceId?: string) => {
    setPreselectedServiceId(serviceId);
    setIsBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
    setPreselectedServiceId(undefined);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!salon) return <div className="min-h-screen flex items-center justify-center">Salon not found.</div>;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => handleBookingClick()} />
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="mt-24"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Our Story
            </h1>
            <p className="text-xl mb-8 text-muted-foreground leading-relaxed">
              {salon.about || 'Welcome to our salon, where beauty meets tranquility. Our journey began with a simple vision: to create a sanctuary where clients can escape the hustle of everyday life and indulge in premium beauty treatments.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground">
                We are dedicated to enhancing your natural beauty through personalized services delivered by skilled professionals. Everyone deserves to feel confident and beautiful in their own skin.
              </p>
              <h2 className="text-3xl font-bold pt-4">Our Vision</h2>
              <p className="text-muted-foreground">
                To be recognized as the premier beauty destination where innovation meets tradition, creating transformative experiences that inspire confidence and well-being in every client.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={heroSalon}
                  alt="Salon Interior" 
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background p-4 rounded-xl shadow-lg border border-border">
                <p className="text-sm italic">
                  "Beauty begins the moment you decide to be yourself."
                </p>
                <p className="text-right text-xs mt-2 text-muted-foreground">— Coco Chanel</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              These principles guide everything we do, from how we treat our clients to how we approach our craft.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Heart className="h-6 w-6 text-primary" />} 
              title="Passion" 
              description="We are passionate about beauty and dedicated to helping our clients look and feel their best." 
            />
            <ValueCard 
              icon={<Award className="h-6 w-6 text-primary" />} 
              title="Excellence" 
              description="We strive for excellence in every service we provide, using premium products and techniques." 
            />
            <ValueCard 
              icon={<Users className="h-6 w-6 text-primary" />} 
              title="Community" 
              description="We believe in building lasting relationships with our clients and the community we serve." 
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="text-primary mb-2"><Calendar className="h-6 w-6" /></div>
              <div className="text-3xl font-bold mb-1">14</div>
              <div className="text-muted-foreground text-sm">Years of Experience</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-primary mb-2"><Users className="h-6 w-6" /></div>
              <div className="text-3xl font-bold mb-1">10k+</div>
              <div className="text-muted-foreground text-sm">Happy Clients</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-primary mb-2"><Heart className="h-6 w-6" /></div>
              <div className="text-3xl font-bold mb-1">15</div>
              <div className="text-muted-foreground text-sm">Expert Stylists</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-primary mb-2"><Star className="h-6 w-6" /></div>
              <div className="text-3xl font-bold mb-1">4.9</div>
              <div className="text-muted-foreground text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to Experience Our Salon?</h2>
                <p className="text-muted-foreground mb-6">
                  Book your appointment today and discover why our clients keep coming back.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
                    onClick={() => handleBookingClick()}
                  >
                    Book Appointment
                  </button>
                  <button 
                    className="border border-input bg-background px-6 py-3 rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => salon && navigate(`/${salon.slug}/services`)}
                  >
                    View Services
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src={salon.hero_image_url || 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1740&q=80'} 
                  alt="Salon Services" 
                  className="rounded-xl w-full h-[300px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer salon={salon} onBookingClick={() => handleBookingClick()} />
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={handleCloseBooking}
        preselectedServiceId={preselectedServiceId}
        services={services}
        stylists={stylists}
        salon={salon}
      />
    </div>
  );
};

export default About;