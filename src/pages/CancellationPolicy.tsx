import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon } from '@/types/salon';

const CancellationPolicy = () => {
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
        <h1 className="text-3xl font-bold mb-6">Cancellation Policy</h1>
        <p className="mb-4">At {salon.name}, we value your time and ask that you respect ours. Our cancellation policy is designed to ensure fairness to all clients and our staff.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Cancellations & Rescheduling</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Please provide at least 24 hours notice if you need to cancel or reschedule your appointment.</li>
          <li>Late cancellations or no-shows may result in a cancellation fee.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">How to Cancel</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Contact us by phone or email as soon as possible to cancel or reschedule.</li>
          <li>Our contact: <a href={`mailto:${salon.booking_email}`} className="text-primary underline">{salon.booking_email || 'our email'}</a> or call {salon.phone || 'our phone number'}.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Exceptions</h2>
        <p className="mb-4">We understand that emergencies happen. Please contact us as soon as possible if you are unable to attend your appointment due to unforeseen circumstances.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p>If you have any questions about this Cancellation Policy, please contact us at <a href={`mailto:${salon.booking_email}`} className="text-primary underline">{salon.booking_email || 'our email'}</a> or visit us at {salon.address || 'our address'}.</p>
      </main>
      <Footer salon={salon} onBookingClick={() => {}} />
    </div>
  );
};

export default CancellationPolicy; 