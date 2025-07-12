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
    <div className="min-h-screen bg-background">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => {}} />
      <main className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">About Us</h1>
        <div className="prose prose-lg max-w-none">
          <p>{salon.about || 'No about information available.'}</p>
        </div>
      </main>
      <Footer salon={salon} onBookingClick={() => {}} />
    </div>
  );
};

export default About; 