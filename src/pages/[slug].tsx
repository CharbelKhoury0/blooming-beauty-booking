import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { Footer } from '@/components/layout/Footer';
import { BookingModal } from '@/components/booking/BookingModal';
import { SalonData } from '@/types/salon';
import { FAQSection } from '@/components/sections/FAQSection';
import { BookingErrorBoundary } from '@/components/booking/BookingErrorBoundary';
import { Sparkles } from 'lucide-react';

const SalonPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [salonData, setSalonData] = useState<SalonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string>();

  useEffect(() => {
    const fetchSalonData = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Fetch salon by slug
        const { data: salon, error: salonError } = await supabase
          .from('salons')
          .select('*')
          .eq('slug', slug)
          .single();

        if (salonError || !salon) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Fetch all related data
        let [servicesResult, stylistsResult, testimonialsResult] = await Promise.all([
          supabase.from('services').select('*').eq('salon_id', salon.id),
          supabase.from('stylists').select('*').eq('salon_id', salon.id),
          supabase.from('testimonials').select('*').eq('salon_id', salon.id).order('created_at', { ascending: false })
        ]);

        // Fallback to default salon if no data
        if (!servicesResult.data || servicesResult.data.length === 0) {
          servicesResult = await supabase.from('services').select('*').eq('salon_id', '92fa42ea-d94b-4fe1-97b8-23b9afa71328');
        }
        if (!stylistsResult.data || stylistsResult.data.length === 0) {
          stylistsResult = await supabase.from('stylists').select('*').eq('salon_id', '92fa42ea-d94b-4fe1-97b8-23b9afa71328');
        }
        if (!testimonialsResult.data || testimonialsResult.data.length === 0) {
          testimonialsResult = await supabase.from('testimonials').select('*').eq('salon_id', '92fa42ea-d94b-4fe1-97b8-23b9afa71328').order('created_at', { ascending: false });
        }

        setSalonData({
          salon,
          services: servicesResult.data || [],
          stylists: stylistsResult.data || [],
          testimonials: testimonialsResult.data || []
        });
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonData();
  }, [slug]);

  const handleBookingClick = (serviceId?: string) => {
    setPreselectedServiceId(serviceId);
    setIsBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
    setPreselectedServiceId(undefined);
  };

  const handleBookingReset = () => {
    setIsBookingModalOpen(false);
    setPreselectedServiceId(undefined);
    // Small delay before reopening to ensure clean state
    setTimeout(() => {
      setIsBookingModalOpen(true);
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading salon...</p>
        </div>
      </div>
    );
  }

  if (notFound || !salonData) {
    return <Navigate to="/404" replace />;
  }

  const { salon, services, stylists, testimonials } = salonData;

  // Map testimonials to expected structure
  const mappedTestimonials = (testimonials || []).map(t => ({
    id: t.id,
    name: t.author_name,
    service: t.serviceName,
    rating: t.rating,
    text: t.text,
    location: ''
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        salonName={salon.name}
        slug={salon.slug}
        onBookingClick={() => handleBookingClick()}
      />
      
      <main>
        <HeroSection 
          salon={salon}
          onBookingClick={() => handleBookingClick()} 
        />
        <ServicesSection 
          services={services.map(s => ({ 
            ...s, 
            icon: Sparkles,
            description: s.description || 'Professional service'
          }))}
          onBookingClick={handleBookingClick}
          slug={salon.slug}
        />
        <AboutSection salon={salon} />
        <TestimonialsSection testimonials={mappedTestimonials} services={services} salon={salon} />
        <FAQSection />
      </main>
      
      <Footer 
        salon={salon}
        onBookingClick={() => handleBookingClick()} 
      />
      
      <BookingErrorBoundary onReset={handleBookingReset}>
        <BookingModal 
          isOpen={isBookingModalOpen}
          onClose={handleCloseBooking}
          preselectedServiceId={preselectedServiceId}
          services={services.map(s => ({ 
            ...s, 
            icon: Sparkles,
            description: s.description || 'Professional service'
          }))}
          stylists={stylists.map(s => ({ ...s, availability: 'available' as const }))}
          salon={salon}
        />
      </BookingErrorBoundary>
    </div>
  );
};

export default SalonPage;
