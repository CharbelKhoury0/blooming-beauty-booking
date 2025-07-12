import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon } from '@/types/salon';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar, Users, CheckCircle, MessageSquare } from 'lucide-react';

const TosSection = ({ icon, title, children }) => (
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

  const salonName = salon.name;
  const lastUpdated = 'May 15, 2023';

  return (
    <div className="min-h-screen bg-background">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => {}} />
      <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6 pt-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These Terms of Service govern your use of {salonName}'s services and website. Please read them carefully.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        <div className="space-y-8">
          <TosSection icon={<Users className="h-5 w-5" />} title="Appointments">
            <ul className="list-disc pl-6 space-y-2">
              <li>Appointments can be booked online, by phone, or in person.</li>
              <li>Please arrive on time for your appointment. Late arrivals may result in reduced service time.</li>
              <li>We reserve the right to reschedule or cancel appointments as needed.</li>
            </ul>
          </TosSection>

          <TosSection icon={<CheckCircle className="h-5 w-5" />} title="Payments">
            <ul className="list-disc pl-6 space-y-2">
              <li>Payment is due at the time of service.</li>
              <li>We accept various forms of payment as indicated at our salon.</li>
              <li>Prices are subject to change without notice.</li>
            </ul>
          </TosSection>

          <TosSection icon={<Calendar className="h-5 w-5" />} title="Cancellations & Changes">
            <ul className="list-disc pl-6 space-y-2">
              <li>Please provide at least 24 hours notice for cancellations or rescheduling.</li>
              <li>Failure to do so may result in a cancellation fee.</li>
              <li>We understand emergencies happen—please contact us as soon as possible if you need to cancel.</li>
            </ul>
          </TosSection>

          <TosSection icon={<FileText className="h-5 w-5" />} title="Liability">
            <p>
              We are not liable for any damages or losses resulting from the use of our services, except as required by law.
            </p>
          </TosSection>

          <TosSection icon={<MessageSquare className="h-5 w-5" />} title="Contact Us">
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-muted rounded-md">
              <p className="font-medium">{salonName}</p>
              <p>Email: {salon.booking_email || 'info@bloombeautysalon.com'}</p>
              <p>Phone: {salon.phone || '(555) 123-4567'}</p>
              <p>Address: {salon.address || '123 Beauty Lane, Styleville, ST 12345'}</p>
            </div>
          </TosSection>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By using our services, you agree to these Terms of Service.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {salonName}. All rights reserved.
          </p>
        </div>
      </div>
      <Footer salon={salon} onBookingClick={() => {}} />
    </div>
  );
};

export default TermsOfService; 