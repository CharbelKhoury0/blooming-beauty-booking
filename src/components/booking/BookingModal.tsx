import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ServiceSelection } from './steps/ServiceSelection';
import { StylistSelection } from './steps/StylistSelection';
import { DateTimeSelection } from './steps/DateTimeSelection';
import { BookingSummary } from './steps/BookingSummary';
import type { Service } from '@/components/sections/ServicesSection';

export interface BookingData {
  services: Service[];
  stylist?: string;
  date?: Date;
  time?: string;
  totalPrice: number;
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
}

const steps = [
  { id: 1, title: 'Choose Services', component: ServiceSelection },
  { id: 2, title: 'Select Stylist', component: StylistSelection },
  { id: 3, title: 'Pick Date & Time', component: DateTimeSelection },
  { id: 4, title: 'Confirm Booking', component: BookingSummary },
];

export const BookingModal = ({ isOpen, onClose, preselectedServiceId }: BookingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    services: [],
    totalPrice: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
    if (currentStep < steps.length) {
      handleNext();
    }
  };

  const handleBookingComplete = () => {
    setIsComplete(true);
    // Here you would integrate with your booking system/API
    console.log('Booking completed:', bookingData);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsComplete(false);
      setCurrentStep(1);
      setBookingData({ services: [], totalPrice: 0 });
      onClose();
    }, 3000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.services.length > 0;
      case 2:
        return !!bookingData.stylist;
      case 3:
        return !!bookingData.date && !!bookingData.time;
      case 4:
        return !!bookingData.contactInfo?.name && !!bookingData.contactInfo?.email;
      default:
        return false;
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 text-center"
            >
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Booking Confirmed!
              </h2>
              <p className="text-muted-foreground mb-6">
                Thank you for choosing Bloom Beauty. We've sent a confirmation email 
                with all the details. We can't wait to see you!
              </p>
              <div className="card-luxury p-4 text-left max-w-md mx-auto">
                <div className="text-sm space-y-2">
                  <div><strong>Services:</strong> {bookingData.services.map(s => s.name).join(', ')}</div>
                  <div><strong>Stylist:</strong> {bookingData.stylist}</div>
                  <div><strong>Date:</strong> {bookingData.date?.toLocaleDateString()}</div>
                  <div><strong>Time:</strong> {bookingData.time}</div>
                  <div><strong>Total:</strong> ${bookingData.totalPrice}</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <DialogHeader className="px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-heading font-semibold">
                    Book Your Appointment
                  </DialogTitle>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`flex items-center ${
                          index < steps.length - 1 ? 'flex-1' : ''
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                            step.id <= currentStep
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {step.id}
                        </div>
                        <span
                          className={`ml-2 text-sm font-medium ${
                            step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          {step.title}
                        </span>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-4 transition-colors ${
                              step.id < currentStep ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DialogHeader>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CurrentStepComponent
                      bookingData={bookingData}
                      onComplete={handleStepComplete}
                      {...(currentStep === 4 && { onBookingComplete: handleBookingComplete })}
                      {...(currentStep === 1 && { preselectedServiceId })}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Step {currentStep} of {steps.length}
                  </div>

                  {currentStep < steps.length ? (
                    <Button
                      variant="luxury"
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="luxury"
                      onClick={handleBookingComplete}
                      disabled={!canProceed()}
                    >
                      Confirm Booking
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};