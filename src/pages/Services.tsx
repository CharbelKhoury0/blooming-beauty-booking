import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon, Service } from '@/types/salon';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/cards/ServiceCard';

const Services = () => {
  const { slug } = useParams<{ slug: string }>();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      const { data: salonData } = await supabase.from('salons').select('*').eq('slug', slug).single();
      setSalon(salonData);
      if (salonData) {
        const { data: servicesData } = await supabase.from('services').select('*').eq('salon_id', salonData.id);
        setServices(servicesData || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!salon) return <div className="min-h-screen flex items-center justify-center">Salon not found.</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => {}} />
      <main className="flex-grow">
        <section className="relative bg-primary-foreground py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Our Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover a wide range of beauty services tailored to your needs. From hair care to relaxing spa treatments, we offer everything to make you feel beautiful and refreshed.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to={`/${salon.slug}/booking`}>Book an Appointment</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Offerings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onBookingClick={(serviceId) => {
                  window.location.href = `/${salon.slug}/booking?serviceId=${serviceId}`;
                }}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer salon={salon} onBookingClick={() => {}} />
    </div>
  );
};

export default Services;