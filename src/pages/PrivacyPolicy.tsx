import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon } from '@/types/salon';

const PrivacyPolicy = () => {
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
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">This Privacy Policy describes how {salon.name} ("we", "us", or "our") collects, uses, and protects your personal information when you use our services and website.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Personal identification information (Name, email address, phone number, etc.)</li>
          <li>Appointment and booking details</li>
          <li>Payment information (if applicable)</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>To provide and manage our services</li>
          <li>To communicate with you about your appointments</li>
          <li>To improve our services and customer experience</li>
          <li>To comply with legal obligations</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">How We Protect Your Information</h2>
        <p className="mb-4">We implement a variety of security measures to maintain the safety of your personal information. Your data is only accessible to authorized personnel.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at <a href={`mailto:${salon.booking_email}`} className="text-primary underline">{salon.booking_email || 'our email'}</a> or visit us at {salon.address || 'our address'}.</p>
      </main>
      <Footer salon={salon} onBookingClick={() => {}} />
    </div>
  );
};

export default PrivacyPolicy; 