import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon, Testimonial } from '@/types/salon';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookingModal } from '@/components/booking/BookingModal';
import { X } from 'lucide-react';
import { validateTestimonial, sanitizeHtml } from '@/lib/security';

const serviceOptions = [
  'Hair Styling & Color',
  'Bridal Package',
  'Facial Treatment',
  'Hair Color Correction',
  'Full Service Package',
  'Other',
];

const Testimonials = () => {
  const { slug } = useParams<{ slug: string }>();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state for testimonial form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    service: serviceOptions[0],
    rating: 5,
    text: '',
    location: '',
  });
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string>();
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setForm(prev => ({ ...prev, rating }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!salon) return;
    
    // Validate form data
    const validation = validateTestimonial({
      authorName: form.name.trim(),
      text: form.text.trim(),
      rating: form.rating
    });
    
    if (!validation.isValid) {
      toast.error(`Please fix the following errors: ${validation.errors.join(', ')}`);
      return;
    }
    
    try {
      // Sanitize form data
      const sanitizedData = {
        salon_id: salon.id,
        author_name: sanitizeHtml(form.name.trim()),
        serviceName: sanitizeHtml(form.service.trim()), // Note: using serviceName to match schema
        rating: form.rating,
        text: sanitizeHtml(form.text.trim()),
      };
      
      const { error } = await supabase.from('testimonials').insert([sanitizedData]);
      
      if (error) {
        console.error('Testimonial submission error:', error);
        toast.error('Failed to submit testimonial. Please try again.');
        return;
      }
      
      setIsFormOpen(false);
      setForm({ name: '', service: serviceOptions[0], rating: 5, text: '', location: '' });
      toast.success('Thank you for your testimonial!');
      
      // Refresh testimonials
      const { data: updatedTestimonials } = await supabase
        .from('testimonials')
        .select('*')
        .eq('salon_id', salon.id)
        .order('created_at', { ascending: false });
      
      if (updatedTestimonials) {
        setTestimonials(updatedTestimonials);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch testimonials, services, and stylists
        let [testimonialsResult, servicesResult, stylistsResult] = await Promise.all([
          supabase.from('testimonials').select('*').eq('salon_id', salonData.id).order('created_at', { ascending: false }),
          supabase.from('services').select('*').eq('salon_id', salonData.id),
          supabase.from('stylists').select('*').eq('salon_id', salonData.id)
        ]);

        // Fallback to default salon if no data
        if (!testimonialsResult.data || testimonialsResult.data.length === 0) {
          testimonialsResult = await supabase.from('testimonials').select('*').eq('salon_id', '92fa42ea-d94b-4fe1-97b8-23b9afa71328').order('created_at', { ascending: false });
        }
        if (!servicesResult.data || servicesResult.data.length === 0) {
          servicesResult = await supabase.from('services').select('*').eq('salon_id', '92fa42ea-d94b-4fe1-97b8-23b9afa71328');
        }
        if (!stylistsResult.data || stylistsResult.data.length === 0) {
          stylistsResult = await supabase.from('stylists').select('*').eq('salon_id', '92fa42ea-d94b-4fe1-97b8-23b9afa71328');
        }

        setSalon(salonData);
        setTestimonials(testimonialsResult.data || []);
        setServices(servicesResult.data || []);
        setStylists(stylistsResult.data || []);
      } catch (error) {
        // Handle error silently for now
        // In production, you might want to log this to an error tracking service
      } finally {
        setLoading(false);
      }
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
                <Star className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-3">What Our Clients Say</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
                Hear directly from our happy customers about their experiences at {salon.name}. We pride ourselves on delivering exceptional service and results.
              </p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsFormOpen(true)}>
                Write a Testimonial
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonial Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="w-full max-w-xl py-8 relative">
            <DialogClose asChild>
              <button
                type="button"
                className="absolute top-4 right-4 text-muted-foreground hover:text-primary focus:outline-none"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </DialogClose>
            <DialogHeader>
              <DialogTitle>Write a Testimonial</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4 w-full px-2 sm:px-4">
              <Input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Your Name"
                required
                className="border border-primary/40 focus-visible:border-primary"
              />
              <select
                name="service"
                value={form.service}
                onChange={handleFormChange}
                className="w-full border border-primary/40 rounded-md p-2 focus-visible:border-primary"
                required
              >
                {serviceOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Rating:</span>
                {[1,2,3,4,5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <Star className={`w-6 h-6 transition-colors duration-150 ${
                      star <= form.rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-muted-foreground fill-none stroke-2'
                    }`} />
                  </button>
                ))}
              </div>
              <Textarea
                name="text"
                value={form.text}
                onChange={handleFormChange}
                placeholder="Your testimonial..."
                required
                rows={4}
                className="border border-primary/40 focus-visible:border-primary"
              />
              <Button type="submit" variant="luxury" className="rounded-lg w-full" disabled={!salon} onClick={() => setIsFormOpen(true)}>
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>

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
                    <p className="text-sm text-muted-foreground">Service: {testimonial.serviceName || 'Beauty Service'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default Testimonials;