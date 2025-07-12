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
import { MapPin, Phone, Mail, Globe, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const { slug } = useParams<{ slug: string }>();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!salon) return <div className="min-h-screen flex items-center justify-center">Salon not found.</div>;

  const businessHours = [
    { day: 'Monday - Friday', time: '9:00 AM - 8:00 PM' },
    { day: 'Saturday', time: '10:00 AM - 6:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar salonName={salon.name} slug={salon.slug} onBookingClick={() => {}} />
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
        <div className="mt-24"></div>
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto bg-card shadow-2xl rounded-2xl p-10 mb-12 border border-border text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Mail className="w-5 h-5 text-primary" />
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
                    <p className="text-muted-foreground">{salon.address || '123 Beauty Lane'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-muted-foreground">
                      <a href={`tel:${salon.phone || ''}`} className="hover:text-primary transition-colors">
                        {salon.phone || '(123) 456-7890'}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground">
                      <a href={`mailto:${salon.booking_email || ''}`} className="hover:text-primary transition-colors">
                        {salon.booking_email || 'info@bloombeauty.com'}
                      </a>
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Business Hours</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-[250px] w-full text-left">
                        <tbody>
                          {businessHours.map((item, index) => (
                            <tr key={index}>
                              <td className="py-1 pr-4 text-muted-foreground whitespace-nowrap">{item.day}</td>
                              <td className={`py-1 font-medium text-right ${item.time === 'Closed' ? 'text-red-500 font-semibold' : ''}`}>{item.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-medium mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Find Us On The Map</h3>
                <div className="bg-muted rounded-md h-[200px] flex items-center justify-center border border-border shadow-inner">
                  <p className="text-muted-foreground text-sm">
                    Map placeholder - Google Maps or other map service would be integrated here
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
      <Footer salon={salon} onBookingClick={() => {}} />
    </div>
  );
} 