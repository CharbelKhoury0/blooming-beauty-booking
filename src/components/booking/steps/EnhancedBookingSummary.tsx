
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CreditCard, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { BookingData, BookingRequest } from '@/types/booking';
import { useCreateBooking } from '@/hooks/useBookings';
import { useBookingSubmission } from '@/hooks/useBookingSubmission';

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
  const { submitBooking, isSubmitting } = useBookingSubmission();
  const { toast } = useToast();

  const updateContactInfo = (field: string, value: string) => {
    const updated = { ...contactInfo, [field]: value };
    setContactInfo(updated);
    onComplete({ primaryContact: updated });
  };

  const handleSubmit = async () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone || !bookingData.salon?.id) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required contact information and select a salon.",
        variant: "destructive",
      });
      return;
    }

    // Validation for multi-person bookings
    const hasInvalidBookings = bookingData.peopleBookings.some(person => 
      person.services.length === 0 || person.services.some(s => !s.stylist)
    );

    if (hasInvalidBookings) {
      toast({
        title: "Incomplete Booking",
        description: "Please ensure all people have selected services and assigned stylists.",
        variant: "destructive",
      });
      return;
    }

    // Update booking data with contact info
    const updatedBookingData = {
      ...bookingData,
      primaryContact: contactInfo
    };

    const success = await submitBooking(updatedBookingData);
    if (success) {
      onBookingComplete();
    }
  };

  const getTotalDuration = () => {
    const allServices = bookingData.peopleBookings.flatMap(person => person.services);
    return allServices.reduce((total, { service }) => {
      const duration = parseInt(service.duration.match(/\d+/)?.[0] || '60');
      return total + duration;
    }, 0);
  };

  // Validation checks
  const hasAllRequiredInfo = contactInfo.name && contactInfo.email && contactInfo.phone;
  const hasValidBookings = bookingData.peopleBookings.every(person => 
    person.services.length > 0 && person.services.every(s => s.stylist)
  );

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

      {!hasValidBookings && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Incomplete Booking</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Please go back and ensure all people have selected services and assigned stylists.
          </p>
        </div>
      )}

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

      <div className="text-xs text-muted-foreground space-y-2 bg-muted/30 p-4 rounded-lg">
        <p className="font-medium">Booking Policies:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li>A 24-hour cancellation notice is required for all appointments.</li>
          <li>Late arrivals may result in shortened service time or rescheduling.</li>
          <li>Payment is due at the time of service.</li>
          <li>Please arrive 10 minutes early for your appointment.</li>
        </ul>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !hasAllRequiredInfo || !hasValidBookings}
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
