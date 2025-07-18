import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Clock, User, Mail, Phone, MessageSquare, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { useCreateBooking } from '@/hooks/useBookings';
import { toast } from 'sonner';
import type { BookingData } from '../BookingModal';

interface BookingSummaryProps {
  bookingData: BookingData;
  onComplete: (data: Partial<BookingData>) => void;
  onBookingComplete: () => void;
}

export const BookingSummary = ({ 
  bookingData, 
  onComplete, 
  onBookingComplete 
}: BookingSummaryProps) => {
  const [contactInfo, setContactInfo] = useState({
    name: bookingData.contactInfo?.name || '',
    email: bookingData.contactInfo?.email || '',
    phone: bookingData.contactInfo?.phone || '',
    notes: bookingData.contactInfo?.notes || '',
  });

  const createBookingMutation = useCreateBooking();

  const handleInputChange = (field: string, value: string) => {
    const updatedInfo = { ...contactInfo, [field]: value };
    setContactInfo(updatedInfo);
    
    // Update booking data in real-time
    onComplete({
      contactInfo: updatedInfo,
    });
  };

  const calculateTotal = () => {
    return bookingData.services.reduce((total, service) => {
      // Extract only the numeric part of the price string
      const price = parseFloat(String(service.price).replace(/[^0-9.]/g, ''));
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!bookingData.salon || !bookingData.date || !bookingData.time) {
      toast.error('Missing booking information. Please go back and complete all steps.');
      return;
    }

    // Always use the first stylist if available, otherwise leave stylist fields blank
    let selectedStylist = null;
    if (bookingData.salon.stylists && bookingData.salon.stylists.length > 0) {
      selectedStylist = bookingData.salon.stylists.find(s => s.name === bookingData.stylist) || bookingData.salon.stylists[0];
    }
    // Always provide a non-null stylist name
    const stylistName = selectedStylist?.name || 'Unknown';
    const stylistId = selectedStylist?.id || undefined;

    const bookingRequest = {
      salon_id: bookingData.salon.id,
      customer_name: contactInfo.name,
      customer_email: contactInfo.email,
      customer_phone: contactInfo.phone,
      customer_notes: contactInfo.notes || undefined,
      booking_date: format(bookingData.date, 'yyyy-MM-dd'),
      booking_time: bookingData.time,
      stylist_id: stylistId,
      stylist_name: stylistName,
      services: bookingData.services,
      total_price: calculateTotal(),
      status: 'pending' as const
    };

    try {
      const result = await createBookingMutation.mutateAsync(bookingRequest);
      toast.success(`Booking confirmed! Your confirmation number is ${result.confirmation_number}. Please save this number for your records.`);
      onBookingComplete();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create booking. Please try again.');
    }
  };

  const isValid = contactInfo.name && contactInfo.email && contactInfo.phone;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          Confirm Your Booking
        </h3>
        <p className="text-muted-foreground">
          Review your appointment details and provide your contact information to complete the booking.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div>
          <h4 className="font-semibold text-foreground mb-4">Appointment Summary</h4>
          
          <Card className="p-6 space-y-6">
            {/* Date & Time */}
            <div className="flex items-start space-x-3">
              <CalendarIcon className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium text-foreground">
                  {bookingData.date && format(bookingData.date, 'EEEE, MMMM d, yyyy')}
                </div>
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {bookingData.time}
                </div>
              </div>
            </div>

            <Separator />

            {/* Services */}
            <h5 className="font-medium text-foreground mb-3">Services</h5>
            <div className="space-y-3">
              {bookingData.services.map((service) => (
                <div key={service.id} className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-foreground">{service.name}</div>
                    <div className="text-sm text-muted-foreground">{service.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-primary">{service.price}</div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Stylist */}
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium text-foreground">Stylist</div>
                <div className="text-sm text-muted-foreground">
                  {bookingData.stylist === 'any' 
                    ? 'Best Available Match' 
                    : bookingData.stylist
                  }
                </div>
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">${calculateTotal().toFixed(2)}</span>
            </div>
          </Card>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="font-semibold text-foreground mb-4">Contact Information</h4>
          
          <Card className="p-6">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="flex items-center text-sm font-medium mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={contactInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="flex items-center text-sm font-medium mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="flex items-center text-sm font-medium mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="flex items-center text-sm font-medium mb-2">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Special Requests (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={contactInfo.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any special requests or notes for your stylist..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Payment Info */}
          <Card className="p-6 mt-6 bg-muted/30">
            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h5 className="font-medium text-foreground">Payment</h5>
                <p className="text-sm text-muted-foreground mt-1">
                  Payment will be processed at the salon. We accept cash, credit cards, and digital payments.
                  A 50% deposit may be required for appointments over $200.
                </p>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* Main Confirm Booking Button at the bottom */}
      <Button
        onClick={handleSubmit}
        disabled={!isValid || createBookingMutation.isPending}
        className="w-full mt-6"
        variant="luxury"
        size="lg"
      >
        {createBookingMutation.isPending ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          'Confirm Booking'
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center mt-2">
        By confirming, you agree to our terms of service and cancellation policy.
      </p>
    </div>
  );
};