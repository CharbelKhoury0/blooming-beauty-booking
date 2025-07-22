import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookingData, BookingRequest } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';
import { validateBookingData, sanitizeHtml } from '@/lib/security';

export const useBookingSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitBooking = async (bookingData: BookingData): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!bookingData.salon?.id || !bookingData.date || !bookingData.time) {
        throw new Error('Missing required booking information');
      }

      if (!bookingData.primaryContact.name || !bookingData.primaryContact.email || !bookingData.primaryContact.phone) {
        throw new Error('Please fill in all contact information');
      }

      if (bookingData.peopleBookings.length === 0 || bookingData.peopleBookings.some(p => p.services.length === 0)) {
        throw new Error('Please select at least one service for each person');
      }

      // Enhanced validation using security functions
      const validationResult = validateBookingData({
        customerName: bookingData.primaryContact.name,
        customerEmail: bookingData.primaryContact.email,
        customerPhone: bookingData.primaryContact.phone,
        bookingDate: bookingData.date,
        totalPrice: bookingData.totalPrice
      });

      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Generate confirmation number
      const confirmationNumber = `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

      // Prepare main booking data with sanitization
      const mainBookingData = {
        salon_id: bookingData.salon.id,
        confirmation_number: confirmationNumber,
        customer_name: sanitizeHtml(bookingData.primaryContact.name.trim()),
        customer_email: bookingData.primaryContact.email.trim().toLowerCase(),
        customer_phone: bookingData.primaryContact.phone.trim(),
        customer_notes: bookingData.primaryContact.notes ? sanitizeHtml(bookingData.primaryContact.notes.trim()) : null,
        booking_date: bookingData.date.split('T')[0],
        booking_time: bookingData.time,
        stylist_id: bookingData.peopleBookings[0]?.services[0]?.stylist?.id && bookingData.peopleBookings[0]?.services[0]?.stylist?.id !== 'any' ? bookingData.peopleBookings[0].services[0].stylist.id : null,
        stylist_name: bookingData.peopleBookings[0]?.services[0]?.stylist?.name || 'Any Available',
        services: bookingData.peopleBookings.flatMap(p => 
          p.services.map(s => ({
            id: s.service.id,
            name: s.service.name,
            price: s.service.price,
            duration: s.service.duration
          }))
        ),
        total_price: bookingData.totalPrice,
        status: 'pending' as const,
        number_of_people: bookingData.numberOfPeople
      };

      // Insert main booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(mainBookingData)
        .select()
        .single();

      if (bookingError || !booking) {
        throw new Error(bookingError?.message || 'Failed to create booking');
      }

      // Insert booking people and their services
      for (let i = 0; i < bookingData.peopleBookings.length; i++) {
        const person = bookingData.peopleBookings[i];
        
        // Insert person with sanitization
        const { data: bookingPerson, error: personError } = await supabase
          .from('booking_people')
          .insert({
            booking_id: booking.id,
            person_name: sanitizeHtml((person.personName || `Person ${i + 1}`).trim()),
            person_order: i + 1
          })
          .select()
          .single();

        if (personError || !bookingPerson) {
          throw new Error(`Failed to create booking for ${person.personName || `Person ${i + 1}`}`);
        }

        // Insert person's services
        for (const serviceData of person.services) {
          const { error: serviceError } = await supabase
            .from('booking_services')
            .insert({
              booking_people_id: bookingPerson.id,
              service_id: serviceData.service.id,
              service_name: serviceData.service.name,
              service_price: serviceData.service.price,
              service_duration: serviceData.service.duration,
              stylist_id: serviceData.stylist?.id && serviceData.stylist.id !== 'any' ? serviceData.stylist.id : null,
              stylist_name: serviceData.stylist?.name || 'Any Available'
            });

          if (serviceError) {
            throw new Error(`Failed to add service ${serviceData.service.name}`);
          }
        }
      }

      toast({
        title: "Booking Confirmed!",
        description: `Your booking has been confirmed with confirmation number: ${confirmationNumber}`,
      });

      return true;

    } catch (error) {
      console.error('Booking submission error:', error);
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitBooking, isSubmitting };
};