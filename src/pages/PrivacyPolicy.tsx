import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon } from '@/types/salon';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Clock, Eye, Lock, Users, Flower, FileText, MessageSquare } from 'lucide-react';
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

const PrivacyPolicy = () => {
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
        // Handle error silently for now
        // In production, you might want to log this to an error tracking service
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

  const salonName = salon.name;
  const lastUpdated = 'May 15, 2023';

  return (
    <div className="min-h-screen bg-background">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => handleBookingClick()} />
      <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6 pt-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            At {salonName}, we value your privacy and are committed to protecting your personal information.
            This policy explains how we collect, use, and safeguard your data.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        <Card className="mb-8 border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  We clearly explain what data we collect and why
                </p>
              </div>
              <div className="p-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Your information is protected with industry standards
                </p>
              </div>
              <div className="p-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Control</h3>
                <p className="text-sm text-muted-foreground">
                  You maintain rights over your personal data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <PolicySection icon={<FileText className="h-5 w-5" />} title="Information We Collect">
            <p>
              We collect personal information that you provide directly to us, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact information (name, email address, phone number)</li>
              <li>Appointment details and service preferences</li>
              <li>Payment information</li>
              <li>Health information relevant to our services</li>
              <li>Feedback and communication history</li>
            </ul>
            <p className="mt-3">
              We may also automatically collect certain information when you visit our website, including your IP address, browser type, and pages visited.
            </p>
          </PolicySection>

          <PolicySection icon={<Flower className="h-5 w-5" />} title="How We Use Your Information">
            <p>
              We use your personal information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our beauty services</li>
              <li>To process appointments and payments</li>
              <li>To send appointment reminders and service updates</li>
              <li>To personalize your experience and recommend suitable treatments</li>
              <li>To communicate with you about promotions and events</li>
              <li>To comply with legal obligations</li>
            </ul>
          </PolicySection>

          <PolicySection icon={<Users className="h-5 w-5" />} title="Information Sharing">
            <p>
              We respect your privacy and do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers who assist in our business operations</li>
              <li>Professional advisors such as lawyers and accountants</li>
              <li>Regulatory authorities when required by law</li>
              <li>Business partners with your consent</li>
            </ul>
            <p className="mt-3">
              Any third parties with whom we share your data are contractually obligated to protect your information.
            </p>
          </PolicySection>

          <PolicySection icon={<Eye className="h-5 w-5" />} title="Cookies and Tracking Technologies">
            <p>
              Our website uses cookies and similar technologies to enhance your browsing experience and analyze website traffic.
            </p>
            <p className="mt-3">
              You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
            </p>
          </PolicySection>

          <PolicySection icon={<Lock className="h-5 w-5" />} title="Data Security">
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, or alteration.
            </p>
            <p className="mt-3">
              While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </PolicySection>

          <PolicySection icon={<Shield className="h-5 w-5" />} title="Your Rights">
            <p>
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete data</li>
              <li>Deletion of your personal information</li>
              <li>Restriction or objection to processing</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </PolicySection>

          <PolicySection icon={<MessageSquare className="h-5 w-5" />} title="Contact Us">
            <p>
              If you have any questions or concerns about our Privacy Policy or data practices, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-muted rounded-md">
              <p className="font-medium">{salonName}</p>
              <div className="space-y-2">
                <p>Address: {salon.address || '123 Beauty Lane, City, State 12345'}</p>
                <p>Phone: {salon.phone || '(555) 123-4567'}</p>
              </div>
            </div>
          </PolicySection>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By using our services, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {salonName}. All rights reserved.
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
};

export default PrivacyPolicy; 