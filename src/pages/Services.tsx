import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon, Service } from '@/types/salon';

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
    <div className="min-h-screen bg-background">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => {}} />
      <main className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">All Services</h1>
        <div className="space-y-8">
          {services.map(service => (
            <div key={service.id} className="border rounded-lg p-6 shadow-sm bg-white">
              <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>
              <p className="mb-2 text-muted-foreground">{service.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>Price: <span className="font-medium text-foreground">{service.price}</span></span>
                <span>Duration: <span className="font-medium text-foreground">{service.duration}</span></span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer salon={salon} onBookingClick={() => {}} />
    </div>
  );
};

export default Services; 