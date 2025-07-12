import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon, Testimonial } from '@/types/salon';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => {}} />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="mt-24"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-card shadow-2xl rounded-2xl p-10 mb-12 border border-border flex flex-col items-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Star className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-3">What Our Clients Say</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
                Hear directly from our happy customers about their experiences at {salon.name}. We pride ourselves on delivering exceptional service and results.
              </p>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to={`/${salon.slug}/submit-testimonial`}>Write a Testimonial</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Grid Section */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Client Testimonials</h2>
          {testimonials.length === 0 ? (
            <p className="text-muted-foreground text-center">No testimonials available yet. Be the first to share your experience!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="bg-card text-card-foreground rounded-2xl shadow-xl p-8 flex flex-col justify-between border border-border relative hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
                  <Star className="w-8 h-8 text-primary absolute -top-4 left-4 bg-background rounded-full p-1 shadow" />
                  <div>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="text-yellow-500 fill-yellow-500 w-5 h-5" />
                      ))}
                      {[...Array(5 - testimonial.rating)].map((_, i) => (
                        <Star key={i} className="text-gray-300 w-5 h-5" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-base mb-4 italic">"{testimonial.text}"</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">- {testimonial.author_name}</p>
                    {testimonial.serviceName && <p className="text-sm text-muted-foreground">Service: {testimonial.serviceName}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer salon={salon} onBookingClick={() => {}} />
    </div>
  );
};

export default Testimonials;