import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon, Testimonial } from '@/types/salon';

const Testimonials = () => {
  const { slug } = useParams<{ slug: string }>();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      const { data: salonData } = await supabase.from('salons').select('*').eq('slug', slug).single();
      setSalon(salonData);
      if (salonData) {
        const { data: testimonialsData } = await supabase.from('testimonials').select('*').eq('salon_id', salonData.id).order('created_at', { ascending: false });
        setTestimonials(testimonialsData || []);
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
        <h1 className="text-3xl font-bold mb-8">Testimonials</h1>
        <div className="space-y-8">
          {testimonials.length === 0 ? (
            <p className="text-muted-foreground">No testimonials available.</p>
          ) : testimonials.map(testimonial => (
            <div key={testimonial.id} className="border rounded-lg p-6 shadow-sm bg-white">
              <div className="flex items-center mb-2">
                <span className="font-semibold text-lg mr-2">{testimonial.author_name}</span>
                <span className="text-yellow-500">{'★'.repeat(testimonial.rating)}</span>
              </div>
              <p className="text-muted-foreground">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer salon={salon} onBookingClick={() => {}} />
    </div>
  );
};

export default Testimonials; 