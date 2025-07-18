import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon, Service, Stylist } from '@/types/salon';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { BookingModal } from '@/components/booking/BookingModal';
import { Scissors, Palette, Sparkles, Crown, Heart, Zap } from 'lucide-react';

const Services = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      const { data: salonData } = await supabase.from('salons').select('*').eq('slug', slug).single();
      setSalon(salonData);
      if (salonData) {
        const [servicesResult, stylistsResult] = await Promise.all([
          supabase.from('services').select('*').eq('salon_id', salonData.id),
          supabase.from('stylists').select('*').eq('salon_id', salonData.id)
        ]);
        
        // Map icons based on service name
        const iconMap = [
          { keyword: 'hair', icon: Scissors },
          { keyword: 'color', icon: Palette },
          { keyword: 'facial', icon: Sparkles },
          { keyword: 'bridal', icon: Crown },
          { keyword: 'spa', icon: Heart },
          { keyword: 'express', icon: Zap },
        ];
        const mapped = (servicesResult.data || []).map(service => {
          const found = iconMap.find(({ keyword }) => service.name.toLowerCase().includes(keyword));
          return { ...service, icon: found ? found.icon : Sparkles };
        });
        setServices(mapped);
        setStylists(stylistsResult.data || []);
        
        // Check for serviceId in URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const serviceId = searchParams.get('serviceId');
        if (serviceId) {
          setPreselectedServiceId(serviceId);
          setIsBookingModalOpen(true);
        }
      }
      setLoading(false);
    };
    fetchData();
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => handleBookingClick()} />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="mt-24"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-card shadow-2xl rounded-2xl p-10 mb-12 border border-border flex flex-col items-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-3">Our Services</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
                Discover a wide range of beauty services tailored to your needs. From hair care to relaxing spa treatments, we offer everything to make you feel beautiful and refreshed.
              </p>
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleBookingClick()}
              >
                Book an Appointment
              </Button>
            </div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Offerings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => {
              const Icon = (service as any).icon;
              return (
                <div key={service.id} className="bg-card rounded-2xl shadow-xl border border-border p-8 flex flex-col items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
                  <div className="mb-4">
                    {Icon && <Icon className="w-10 h-10 text-primary" />}
                  </div>
                  <ServiceCard 
                    service={service} 
                    onBookingClick={handleBookingClick}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </main>
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

export default Services;