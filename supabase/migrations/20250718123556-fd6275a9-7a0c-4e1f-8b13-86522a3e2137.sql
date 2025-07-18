
-- Create bookings table to store appointment data
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  confirmation_number TEXT NOT NULL UNIQUE,
  
  -- Customer information
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_notes TEXT,
  
  -- Booking details
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  stylist_id UUID REFERENCES public.stylists(id),
  stylist_name TEXT NOT NULL, -- Store name for history even if stylist is deleted
  
  -- Services and pricing
  services JSONB NOT NULL, -- Array of selected services with details
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Status and metadata
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_salon_id ON public.bookings(salon_id);
CREATE INDEX idx_bookings_stylist_id ON public.bookings(stylist_id);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_confirmation ON public.bookings(confirmation_number);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Public can view bookings for availability checking" 
ON public.bookings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique confirmation numbers
CREATE OR REPLACE FUNCTION generate_confirmation_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  
  -- Check if confirmation number already exists
  IF EXISTS (SELECT 1 FROM public.bookings WHERE confirmation_number = result) THEN
    RETURN generate_confirmation_number(); -- Recursive call if duplicate
  END IF;
  
  RETURN result;
END;
$$;

-- Function to check stylist availability
CREATE OR REPLACE FUNCTION check_stylist_availability(
  p_stylist_id UUID,
  p_date DATE,
  p_time TIME,
  p_duration_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  end_time TIME;
  conflict_count INTEGER;
BEGIN
  -- Calculate end time
  end_time := p_time + (p_duration_minutes || ' minutes')::INTERVAL;
  
  -- Check for overlapping bookings
  SELECT COUNT(*)
  INTO conflict_count
  FROM public.bookings
  WHERE stylist_id = p_stylist_id
    AND booking_date = p_date
    AND status NOT IN ('cancelled', 'no_show')
    AND (
      -- New booking starts during existing booking
      (p_time >= booking_time AND p_time < (booking_time + INTERVAL '60 minutes'))
      OR
      -- New booking ends during existing booking
      (end_time > booking_time AND end_time <= (booking_time + INTERVAL '60 minutes'))
      OR
      -- New booking completely contains existing booking
      (p_time <= booking_time AND end_time >= (booking_time + INTERVAL '60 minutes'))
    );
  
  RETURN conflict_count = 0;
END;
$$;
