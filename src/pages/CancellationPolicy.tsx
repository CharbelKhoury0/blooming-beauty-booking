import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon } from '@/types/salon';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Ban, Clock, Phone, Mail, AlertTriangle, FileText, MapPin } from 'lucide-react';
import { BookingModal } from '@/components/booking/BookingModal';

const PolicySection = ({ icon, title, children }) => (
  <Card className="mb-8 border-primary/20">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </div>
      <div className="text-muted-foreground space-y-3">{children}</div>
    </CardContent>
  </Card>
);

export default function CancellationPolicy() {
  const { slug } = useParams<{ slug: string }>();
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
        console.error('Error fetching salon data:', error);
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
    <div className="min-h-screen bg-background">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => handleBookingClick()} />
      <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6 pt-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Ban className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Cancellation Policy
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            At {salon.name}, we value your time and ask that you respect ours. Our cancellation policy is designed to ensure fairness to all clients and our staff.
          </p>
        </div>

        <div className="space-y-8">
          <PolicySection icon={<Clock className="h-5 w-5" />} title="Cancellations & Rescheduling">
            <ul className="list-disc pl-6 space-y-2">
              <li>Please provide at least 24 hours notice if you need to cancel or reschedule your appointment.</li>
              <li>Late cancellations or no-shows may result in a cancellation fee.</li>
            </ul>
          </PolicySection>

          <PolicySection icon={<Phone className="h-5 w-5" />} title="How to Cancel">
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact us by phone or email as soon as possible to cancel or reschedule.</li>
              <li>Our contact: call {salon.phone || 'our phone number'} or visit us at {salon.address || 'our address'}.</li>
            </ul>
          </PolicySection>

          <PolicySection icon={<AlertTriangle className="h-5 w-5" />} title="Exceptions">
            <p>We understand that emergencies happen. Please contact us as soon as possible if you are unable to attend your appointment due to unforeseen circumstances.</p>
          </PolicySection>

          <PolicySection icon={<Mail className="h-5 w-5" />} title="Contact Us">
            <p>If you have any questions about this Cancellation Policy, please contact us by calling {salon.phone || 'our phone number'} or visit us at {salon.address || 'our address'}.</p>
          </PolicySection>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By booking an appointment, you acknowledge that you have read and understood this Cancellation Policy.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {salon.name}. All rights reserved.
          </p>
        </div>
      </div>
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
} 