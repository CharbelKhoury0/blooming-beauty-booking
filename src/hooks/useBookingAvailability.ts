import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AvailabilitySlot {
  time: string;
  available: boolean;
  stylistId?: string;
  reason?: string;
}

export const useBookingAvailability = (
  salonId: string,
  selectedDate?: Date,
  serviceDuration: number = 60
) => {
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate || !salonId) {
      setAvailableSlots([]);
      return;
    }

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        
        // Generate time slots (9 AM to 6 PM, 30-minute intervals)
        const slots: AvailabilitySlot[] = [];
        for (let hour = 9; hour < 18; hour++) {
          for (let minute of [0, 30]) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push({
              time,
              available: true,
            });
          }
        }

        // Check existing bookings
        const { data: bookings } = await supabase
          .from('bookings')
          .select('booking_time, stylist_id, services')
          .eq('salon_id', salonId)
          .eq('booking_date', dateStr)
          .not('status', 'in', ['cancelled', 'no_show']);

        // Mark unavailable slots based on existing bookings
        const updatedSlots = slots.map(slot => {
          const slotTime = slot.time;
          const isBooked = bookings?.some(booking => {
            const bookingTime = booking.booking_time;
            // Simple time overlap check (can be enhanced)
            return bookingTime === slotTime;
          });

          return {
            ...slot,
            available: !isBooked,
            reason: isBooked ? 'Already booked' : undefined
          };
        });

        setAvailableSlots(updatedSlots);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [salonId, selectedDate, serviceDuration]);

  return { availableSlots, loading };
};