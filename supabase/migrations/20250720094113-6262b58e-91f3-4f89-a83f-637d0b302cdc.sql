-- Create booking_people table to support multi-person bookings
CREATE TABLE public.booking_people (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  person_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking_services table to link people to their specific services and stylists
CREATE TABLE public.booking_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_people_id UUID NOT NULL REFERENCES public.booking_people(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id),
  service_name TEXT NOT NULL,
  service_price TEXT NOT NULL,
  service_duration TEXT NOT NULL,
  stylist_id UUID REFERENCES public.stylists(id),
  stylist_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.booking_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;

-- Create policies for booking_people
CREATE POLICY "Public can view booking people for availability checking" 
ON public.booking_people 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create booking people" 
ON public.booking_people 
FOR INSERT 
WITH CHECK (true);

-- Create policies for booking_services
CREATE POLICY "Public can view booking services for availability checking" 
ON public.booking_services 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create booking services" 
ON public.booking_services 
FOR INSERT 
WITH CHECK (true);

-- Add triggers for updated_at columns
CREATE TRIGGER update_booking_people_updated_at
BEFORE UPDATE ON public.booking_people
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_services_updated_at
BEFORE UPDATE ON public.booking_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_booking_people_booking_id ON public.booking_people(booking_id);
CREATE INDEX idx_booking_services_booking_people_id ON public.booking_services(booking_people_id);
CREATE INDEX idx_booking_services_service_id ON public.booking_services(service_id);
CREATE INDEX idx_booking_services_stylist_id ON public.booking_services(stylist_id);