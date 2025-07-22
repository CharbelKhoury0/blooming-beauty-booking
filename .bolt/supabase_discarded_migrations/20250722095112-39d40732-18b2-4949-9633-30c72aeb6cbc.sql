-- Security Fix 1: Update RLS policies for better security

-- Update testimonials policies to require proper validation
DROP POLICY IF EXISTS "Allow insert for all" ON public.testimonials;
CREATE POLICY "Allow authenticated users to insert testimonials with validation" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (
  salon_id IS NOT NULL 
  AND author_name IS NOT NULL 
  AND text IS NOT NULL 
  AND length(author_name) <= 100 
  AND length(text) <= 1000 
  AND rating BETWEEN 1 AND 5
);

-- Update contact messages policies to require proper validation
DROP POLICY IF EXISTS "Allow all users to insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated users to insert contact messages" ON public.contact_messages;
CREATE POLICY "Allow validated contact message insertion" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (
  salon_id IS NOT NULL 
  AND name IS NOT NULL 
  AND email IS NOT NULL 
  AND subject IS NOT NULL 
  AND message IS NOT NULL 
  AND length(name) <= 100 
  AND length(email) <= 255 
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(subject) <= 200 
  AND length(message) <= 2000
);

-- Update booking policies to require proper validation
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
CREATE POLICY "Allow validated booking creation" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  salon_id IS NOT NULL 
  AND customer_name IS NOT NULL 
  AND customer_email IS NOT NULL 
  AND customer_phone IS NOT NULL 
  AND booking_date IS NOT NULL 
  AND booking_time IS NOT NULL 
  AND total_price > 0 
  AND length(customer_name) <= 100 
  AND length(customer_email) <= 255 
  AND customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(customer_phone) <= 20 
  AND booking_date >= CURRENT_DATE 
  AND status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')
);

-- Update booking_people policies
DROP POLICY IF EXISTS "Anyone can create booking people" ON public.booking_people;
CREATE POLICY "Allow validated booking people creation" 
ON public.booking_people 
FOR INSERT 
WITH CHECK (
  booking_id IS NOT NULL 
  AND person_name IS NOT NULL 
  AND length(person_name) <= 100 
  AND person_order > 0
);

-- Update booking_services policies
DROP POLICY IF EXISTS "Anyone can create booking services" ON public.booking_services;
CREATE POLICY "Allow validated booking services creation" 
ON public.booking_services 
FOR INSERT 
WITH CHECK (
  booking_people_id IS NOT NULL 
  AND service_id IS NOT NULL 
  AND service_name IS NOT NULL 
  AND service_price IS NOT NULL 
  AND service_duration IS NOT NULL 
  AND stylist_name IS NOT NULL 
  AND length(service_name) <= 200 
  AND length(stylist_name) <= 100
);

-- Fix database functions security: Add proper search_path
CREATE OR REPLACE FUNCTION public.generate_confirmation_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.check_stylist_availability(p_stylist_id uuid, p_date date, p_time time without time zone, p_duration_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  end_time TIME;
  conflict_count INTEGER;
BEGIN
  -- Input validation
  IF p_stylist_id IS NULL OR p_date IS NULL OR p_time IS NULL OR p_duration_minutes <= 0 THEN
    RETURN false;
  END IF;
  
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
$function$;