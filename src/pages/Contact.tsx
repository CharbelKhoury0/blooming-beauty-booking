import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Salon } from '@/types/salon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Phone, Globe, Clock, Send, CheckCircle2, ChevronDown, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { BookingModal } from '@/components/booking/BookingModal';

// Helper to extract lat/lng from Google Maps embed URL
function extractLatLngFromUrl(url: string): { lat: string; lng: string } | null {
  // Try @lat,lng
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    return { lat: atMatch[1], lng: atMatch[2] };
  }
  // Try !3dLAT!4dLNG
  const dMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (dMatch) {
    return { lat: dMatch[1], lng: dMatch[2] };
  }
  return null;
}

export default function Contact() {
  const { slug } = useParams<{ slug: string }>();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoursOpen, setHoursOpen] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon) return;
    
    // Show success message
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    toast.success('Your message has been sent! We\'ll get back to you soon.');
    setTimeout(() => setSubmitted(false), 3000);
  };

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

  // Parse working_hours from the salon object
  const businessHours = salon.working_hours
    ? salon.working_hours.split('|').map(item => {
        const [day, ...hoursArr] = item.split(':');
        return {
          day: day.trim(),
          time: hoursArr.join(':').trim(),
        };
      })
    : [];

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="min-h-screen bg-background">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => handleBookingClick()} />
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
        <div className="mt-24"></div>
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto bg-card shadow-2xl rounded-2xl p-10 mb-12 border border-border text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Contact Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-foreground">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Contact Form Card */}
            <Card className="p-10 shadow-2xl border-border rounded-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2"><Send className="w-5 h-5 text-primary" /> Send Us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you soon.
                </p>
              </div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-muted rounded-xl shadow-inner">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Thank You!</h3>
                  <p className="text-muted-foreground">
                    Your message has been sent successfully. We'll respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="(555) 123-4567"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help you?"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              )}
            </Card>
            {/* Salon Information Card */}
            <Card className="p-10 shadow-2xl border-border rounded-2xl flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> {salon.name}</h2>
                <p className="text-muted-foreground">
                  Visit our salon or reach out through any of these channels.
                </p>
              </div>
              <div className="space-y-6 flex-grow">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      {salon.address ? (
                        <span>{salon.address}</span>
                      ) : (
                        <span className="text-muted-foreground/60 italic">Address not available</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-muted-foreground">
                      {salon.phone ? (
                        <a href={`tel:${salon.phone}`} className="hover:text-primary transition-colors">
                          {salon.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground/60 italic">Phone not available</span>
                      )}
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div className="w-full">
                    <h3 className="font-medium mb-2">Business Hours</h3>
                    {businessHours.length > 0 && (
                      <div>
                        <button
                          type="button"
                          className="w-full flex justify-between items-center px-3 py-2 bg-muted rounded-lg border border-border hover:bg-primary/10 transition-all duration-200 group"
                          onClick={() => setHoursOpen(o => !o)}
                        >
                          <span className="text-foreground text-sm font-body font-medium">View Hours</span>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${hoursOpen ? 'rotate-180' : ''} group-hover:text-foreground`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${hoursOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                          <div className="bg-muted/50 rounded-lg border border-border p-3">
                            <div className="space-y-2">
                              {businessHours.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-1">
                                  <span className="text-muted-foreground text-sm font-body">{item.day}</span>
                                  <span className={`text-sm font-body font-medium ${item.time === 'Closed' ? 'text-red-500' : 'text-foreground'}`}>
                                    {item.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-medium mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Find Us On The Map</h3>
                {(() => {
                  let mapCenter = '';
                  let marker = '';
                  let mapsUrl = '';
                  if (salon.map_embed_url) {
                    const coords = extractLatLngFromUrl(salon.map_embed_url);
                    if (coords) {
                      mapCenter = `${coords.lat},${coords.lng}`;
                      marker = `color:pink|${coords.lat},${coords.lng}`;
                      mapsUrl = salon.map_embed_url;
                    }
                  }
                  if (!mapCenter && salon.address) {
                    mapCenter = encodeURIComponent(salon.address);
                    marker = `color:pink|${encodeURIComponent(salon.address)}`;
                    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.address)}`;
                  }
                  if (!mapCenter) return null; // No valid location
                  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter}&zoom=15&size=600x200&markers=${marker}&key=${GOOGLE_MAPS_API_KEY}`;
                  return (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-muted rounded-md h-[200px] flex items-center justify-center border border-border shadow-inner hover:ring-2 hover:ring-primary transition overflow-hidden"
                      title="Open in Google Maps"
                    >
                      <img
                        src={staticMapUrl}
                        alt="Salon Location Map"
                        className="w-full h-full object-cover rounded-md"
                        style={{ minHeight: 200 }}
                      />
                    </a>
                  );
                })()}
              </div>
            </Card>
          </div>
        </div>
      </section>
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