import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon } from '@/types/salon';

const TermsOfService = () => {
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
      <Navbar salonName={salon.name} onBookingClick={() => {}} />
      <main className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4">These Terms of Service ("Terms") govern your use of the services provided by {salon.name} ("we", "us", or "our"). By booking an appointment or using our website, you agree to these Terms.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Appointments</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Appointments can be booked online, by phone, or in person.</li>
          <li>Please arrive on time for your appointment. Late arrivals may result in reduced service time.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Payments</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Payment is due at the time of service.</li>
          <li>We accept various forms of payment as indicated at our salon.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Changes & Cancellations</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Please provide at least 24 hours notice for cancellations or rescheduling.</li>
          <li>Failure to do so may result in a cancellation fee.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Liability</h2>
        <p className="mb-4">We are not liable for any damages or losses resulting from the use of our services, except as required by law.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at <a href={`mailto:${salon.booking_email}`} className="text-primary underline">{salon.booking_email || 'our email'}</a> or visit us at {salon.address || 'our address'}.</p>
      </main>
      <Footer salon={salon} onBookingClick={() => {}} />
    </div>
  );
};

export default TermsOfService; 