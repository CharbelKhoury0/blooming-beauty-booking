import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { BookingData } from '@/types/booking';
import { useCreateBooking } from '@/hooks/useBookings';

interface EnhancedBookingSummaryProps {
  bookingData: BookingData;
  onComplete: (data: Partial<BookingData>) => void;
  onBookingComplete: () => void;
}

export const EnhancedBookingSummary = ({ 
  bookingData, 
  onComplete, 
  onBookingComplete 
}: EnhancedBookingSummaryProps) => {
  const [contactInfo, setContactInfo] = useState(bookingData.primaryContact || {
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const createBooking = useCreateBooking();

  const updateContactInfo = (field: string, value: string) => {
    const updated = { ...contactInfo, [field]: value };
    setContactInfo(updated);
    onComplete({ primaryContact: updated });
  };

  const handleSubmit = async () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required contact information.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare booking data
      const bookingRequest = {
        salon_id: bookingData.salon?.id || '',
        customer_name: contactInfo.name,
        customer_email: contactInfo.email,
        customer_phone: contactInfo.phone,
        customer_notes: contactInfo.notes || '',
        booking_date: bookingData.date || '',
        booking_time: bookingData.time || '',
        stylist_id: undefined, // You can enhance this to pick a main stylist if needed
        stylist_name: '',
        services: bookingData.peopleBookings.flatMap(person => person.services.map(s => ({
          id: s.service.id,
          name: s.service.name,
          price: s.service.price,
          duration: s.service.duration,
        }))),
        total_price: bookingData.totalPrice,
        status: 'pending',
        number_of_people: bookingData.numberOfPeople,
        people_data: bookingData.peopleBookings.map(person => ({
          person_name: person.personName,
          services: person.services.map(s => ({
            service_id: s.service.id,
            service_name: s.service.name,
            stylist_id: s.stylist?.id,
            stylist_name: s.stylist?.name || '',
          })),
        })),
      };
      // Insert booking
      await createBooking.mutateAsync(bookingRequest);
      toast({
        title: "Booking Confirmed!",
        description: "Your appointment has been successfully booked. You'll receive a confirmation email shortly.",
      });
      onBookingComplete();
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalDuration = () => {
    const allServices = bookingData.peopleBookings.flatMap(person => person.services);
    // This is a simplified calculation - in reality, parallel services might reduce total time
    return allServices.reduce((total, { service }) => {
      const duration = parseInt(service.duration.match(/\d+/)?.[0] || '60');
      return total + duration;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          Confirm Your Booking
        </h3>
        <p className="text-muted-foreground">
          Review your appointment details and provide contact information.
        </p>
      </div>

      {/* Appointment Summary */}
      <div className="card-luxury p-4 space-y-4">
        <h4 className="font-semibold text-foreground flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Appointment Details</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Date:</span>
            <p className="font-medium text-foreground">
              {bookingData.date ? new Date(bookingData.date).toLocaleDateString() : 'Not selected'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Time:</span>
            <p className="font-medium text-foreground">{bookingData.time || 'Not selected'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Duration:</span>
            <p className="font-medium text-foreground">~{Math.ceil(getTotalDuration() / 60)} hours</p>
          </div>
          <div>
            <span className="text-muted-foreground">People:</span>
            <p className="font-medium text-foreground">
              {bookingData.numberOfPeople} {bookingData.numberOfPeople === 1 ? 'person' : 'people'}
            </p>
          </div>
        </div>
      </div>

      {/* Services Summary */}
      <div className="card-luxury p-4 space-y-4">
        <h4 className="font-semibold text-foreground">Selected Services</h4>
        <div className="space-y-4">
          {bookingData.peopleBookings.map((person, personIndex) => (
            person.services.length > 0 && (
              <div key={personIndex} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {person.personName || `Person ${personIndex + 1}`}
                  </span>
                </div>
                <div className="ml-6 space-y-2">
                  {person.services.map((serviceData, serviceIndex) => (
                    <div key={serviceIndex} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground text-sm">
                          {serviceData.service.name}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>with {serviceData.stylist?.name || 'Any Available Stylist'}</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{serviceData.service.duration}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-primary font-semibold">
                        {serviceData.service.price}
                      </span>
                    </div>
                  ))}
                </div>
                {personIndex < bookingData.peopleBookings.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            )
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between font-semibold text-lg">
            <span className="text-foreground">Total</span>
            <span className="text-primary">${bookingData.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card-luxury p-4 space-y-4">
        <h4 className="font-semibold text-foreground">Contact Information</h4>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center space-x-2">
              <User className="w-4 h-4 text-primary" />
              <span>Full Name *</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={contactInfo.name}
              onChange={(e) => updateContactInfo('name', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>Email Address *</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={contactInfo.email}
                onChange={(e) => updateContactInfo('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>Phone Number *</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={contactInfo.phone}
                onChange={(e) => updateContactInfo('phone', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>Special Requests (Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special requests, allergies, or preferences..."
              value={contactInfo.notes}
              onChange={(e) => updateContactInfo('notes', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Booking Policies */}
      <div className="text-xs text-muted-foreground space-y-2 bg-muted/30 p-4 rounded-lg">
        <p className="font-medium">Booking Policies:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li>A 24-hour cancellation notice is required for all appointments.</li>
          <li>Late arrivals may result in shortened service time or rescheduling.</li>
          <li>Payment is due at the time of service.</li>
          <li>Please arrive 10 minutes early for your appointment.</li>
        </ul>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !contactInfo.name || !contactInfo.email || !contactInfo.phone}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Confirming Booking...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Confirm Booking</span>
          </div>
        )}
      </Button>
    </div>
  );
};