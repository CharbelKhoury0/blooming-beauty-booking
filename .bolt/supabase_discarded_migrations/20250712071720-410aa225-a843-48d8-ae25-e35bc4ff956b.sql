-- Create salons table
CREATE TABLE public.salons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  hero_image_url TEXT,
  primary_color TEXT DEFAULT '#e11d48',
  booking_email TEXT,
  about TEXT,
  address TEXT,
  map_embed_url TEXT,
  phone TEXT,
  socials JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  duration TEXT NOT NULL,
  image_url TEXT,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stylists table
CREATE TABLE public.stylists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  availability JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for salons" 
ON public.salons 
FOR SELECT 
USING (true);

CREATE POLICY "Public read access for services" 
ON public.services 
FOR SELECT 
USING (true);

CREATE POLICY "Public read access for stylists" 
ON public.stylists 
FOR SELECT 
USING (true);

CREATE POLICY "Public read access for testimonials" 
ON public.testimonials 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_salons_updated_at
  BEFORE UPDATE ON public.salons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stylists_updated_at
  BEFORE UPDATE ON public.stylists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for Bloom Beauty Salon
INSERT INTO public.salons (slug, name, tagline, hero_image_url, primary_color, booking_email, about, address, phone, socials) VALUES (
  'bloom-beauty',
  'Bloom Beauty Salon',
  'Where Beauty Meets Excellence',
  '/src/assets/hero-salon.jpg',
  '#e11d48',
  'bookings@bloombeauty.com',
  'For over a decade, Bloom Beauty has been the trusted destination for luxury beauty services. We combine cutting-edge techniques with personalized care to help you look and feel your absolute best.',
  '123 Beauty Lane, Salon City, SC 12345',
  '(555) 123-4567',
  '{"instagram": "@bloombeauty", "facebook": "BloomBeautySalon"}'
);

-- Get the salon ID for foreign key references
DO $$
DECLARE
  salon_uuid UUID;
BEGIN
  SELECT id INTO salon_uuid FROM public.salons WHERE slug = 'bloom-beauty';

  -- Insert sample services
  INSERT INTO public.services (salon_id, name, description, price, duration, popular) VALUES
  (salon_uuid, 'Hair Styling & Cut', 'Professional cuts, styling, and blow-dry services tailored to your face shape and lifestyle.', 'From $85', '60-90 min', true),
  (salon_uuid, 'Hair Coloring', 'Full color, highlights, balayage, and color correction by our expert colorists.', 'From $120', '2-4 hours', true),
  (salon_uuid, 'Facial Treatments', 'Rejuvenating facials using premium skincare products for glowing, healthy skin.', 'From $95', '60-75 min', false),
  (salon_uuid, 'Bridal Package', 'Complete bridal beauty package including hair, makeup, and trial sessions.', 'From $350', '4-6 hours', false),
  (salon_uuid, 'Spa Treatments', 'Relaxing massage, body treatments, and wellness services for total rejuvenation.', 'From $110', '60-90 min', false),
  (salon_uuid, 'Express Services', 'Quick touch-ups, eyebrow shaping, and express treatments for busy schedules.', 'From $35', '15-30 min', false);

  -- Insert sample stylists
  INSERT INTO public.stylists (salon_id, name, bio, availability) VALUES
  (salon_uuid, 'Sarah Johnson', 'Master stylist with 10+ years of experience in color and cut.', '{"monday": "9:00-17:00", "tuesday": "9:00-17:00", "wednesday": "9:00-17:00", "thursday": "9:00-17:00", "friday": "9:00-17:00"}'),
  (salon_uuid, 'Maria Rodriguez', 'Specialist in bridal and special occasion styling.', '{"tuesday": "10:00-18:00", "wednesday": "10:00-18:00", "thursday": "10:00-18:00", "friday": "10:00-18:00", "saturday": "9:00-15:00"}'),
  (salon_uuid, 'Jessica Chen', 'Expert in modern cuts and innovative coloring techniques.', '{"monday": "11:00-19:00", "tuesday": "11:00-19:00", "wednesday": "11:00-19:00", "thursday": "11:00-19:00", "saturday": "9:00-17:00"}');

  -- Insert sample testimonials
  INSERT INTO public.testimonials (salon_id, author_name, text, rating) VALUES
  (salon_uuid, 'Emily Parker', 'The best salon experience I''ve ever had! Sarah completely transformed my hair and I couldn''t be happier with the results.', 5),
  (salon_uuid, 'Rachel Thompson', 'Amazing service and such a relaxing atmosphere. The facial treatment left my skin glowing for weeks!', 5),
  (salon_uuid, 'Jessica Davis', 'Professional, friendly staff and incredible attention to detail. I''ve been coming here for 3 years and never disappointed.', 5),
  (salon_uuid, 'Amanda Wilson', 'The bridal package was perfect for my wedding day. Maria made me feel like a princess!', 5),
  (salon_uuid, 'Lisa Chen', 'Great value for money and the express services are perfect for my busy schedule. Highly recommend!', 5);
END $$;