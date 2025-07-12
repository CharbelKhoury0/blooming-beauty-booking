import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon } from '@/types/salon';

const About = () => {
  const { slug } = useParams<{ slug: string }>();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalon = async () => {
      if (!slug) return;
      const { data } = await supabase.from('salons').select('*').eq('slug', slug).single();
      setSalon(data);
      setLoading(false);
    };
    fetchSalon();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!salon) return <div className="min-h-screen flex items-center justify-center">Salon not found.</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => {}} />
      <main className="flex-grow">
        <section className="relative bg-primary-foreground py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">About Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Learn more about {salon.name} and our commitment to providing exceptional beauty services.
            </p>
          </div>
        </section>

        <section className="container mx-auto py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
              {salon.about ? (
                <p>{salon.about}</p>
              ) : (
                <p>No detailed information about our salon is available at the moment. We are dedicated to offering a wide range of high-quality beauty services in a relaxing and welcoming environment. Our team of experienced professionals is passionate about helping you look and feel your best. We believe in personalized care and strive to exceed your expectations with every visit.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer salon={salon} onBookingClick={() => {}} />
    </div>
  );
};

export default About;