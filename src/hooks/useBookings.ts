import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BookingRequest, BookingResponse } from '@/types/booking';

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (bookingData: Omit<BookingRequest, 'confirmation_number'>): Promise<BookingResponse> => {
      // Generate confirmation number
      const { data: confirmationNumber, error: confirmationError } = await supabase
        .rpc('generate_confirmation_number');
      
      if (confirmationError) {
        throw new Error('Failed to generate confirmation number: ' + confirmationError.message);
      }

      // Check stylist availability if stylist is selected
      if (bookingData.stylist_id) {
        const { data: isAvailable, error: availabilityError } = await supabase
          .rpc('check_stylist_availability', {
            p_stylist_id: bookingData.stylist_id,
            p_date: bookingData.booking_date,
            p_time: bookingData.booking_time,
            p_duration_minutes: 60
          });

        if (availabilityError) {
          throw new Error('Failed to check availability: ' + availabilityError.message);
        }

        if (!isAvailable) {
          throw new Error('Selected time slot is no longer available. Please choose a different time.');
        }
      }

      // Create the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          confirmation_number: confirmationNumber
        })
        .select()
        .single();

      if (error) {
        throw new Error('Failed to create booking: ' + error.message);
      }

      // Send confirmation email
      try {
        await supabase.functions.invoke('send-booking-confirmation', {
          body: {
            booking: data,
            services: bookingData.services
          }
        });
      } catch (emailError) {
        console.warn('Failed to send confirmation email:', emailError);
        // Don't throw error for email failure - booking is still created
      }

      return data;
    }
  });
};

export const useBookingsByDate = (salonId: string, date: string) => {
  return useQuery({
    queryKey: ['bookings', salonId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('salon_id', salonId)
        .eq('booking_date', date)
        .not('status', 'in', '(cancelled,no_show)');

      if (error) throw error;
      return data;
    },
    enabled: !!salonId && !!date
  });
};

export const useStylistAvailability = (stylistId?: string, date?: string, time?: string) => {
  return useQuery({
    queryKey: ['stylist-availability', stylistId, date, time],
    queryFn: async () => {
      if (!stylistId || !date || !time) return true;

      const { data, error } = await supabase
        .rpc('check_stylist_availability', {
          p_stylist_id: stylistId,
          p_date: date,
          p_time: time,
          p_duration_minutes: 60
        });

      if (error) throw error;
      return data;
    },
    enabled: !!stylistId && !!date && !!time
  });
};