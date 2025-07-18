import { useState, useRef, useEffect } from 'react';
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
  salon?: any;
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
  services?: any[];
  stylists?: any[];
  salon?: any;
}

const steps = [
  { id: 1, title: 'Choose Services', component: ServiceSelection },
  { id: 2, title: 'Select Stylist', component: StylistSelection },
  { id: 3, title: 'Pick Date & Time', component: DateTimeSelection },
  { id: 4, title: 'Confirm Booking', component: BookingSummary },
];

export const BookingModal = ({ isOpen, onClose, preselectedServiceId, services, stylists, salon }: BookingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    services: [],
    totalPrice: 0,
  });
  const [isComplete, setIsComplete] = useState(false);
  // Step 1: Service selection state
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  // Step 2: Stylist selection state
  const [selectedStylist, setSelectedStylist] = useState<string | undefined>(undefined);
  // Step 3: Date & Time selection state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

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
      setCurrentStep(currentStep + 1);
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
  // Ref for ServiceSelection
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when currentStep changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] p-0 flex flex-col
          sm:max-w-full sm:w-full sm:h-screen sm:rounded-none sm:max-h-none"
        style={{ height: '90vh' }}
      >
        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 text-center sm:p-4"
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
              <div className="card-luxury p-4 text-left max-w-md mx-auto sm:p-2 sm:max-w-full">
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
              className="flex flex-col flex-1 min-h-0"
            >
              {/* Header */}
              <DialogHeader className="px-6 py-4 border-b border-border shrink-0 sm:px-3 sm:py-2">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-heading font-semibold sm:text-lg">
                    Book Your Appointment
                  </DialogTitle>
                  <Button variant="ghost" size="icon" onClick={onClose} className="sm:w-8 sm:h-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-2 sm:flex-wrap sm:gap-y-2 sm:gap-x-1 sm:mb-1">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          step.id <= currentStep
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        } sm:w-7 sm:h-7`}
                      >
                        {step.id}
                      </div>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                        } sm:ml-1 sm:text-xs`}
                      >
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-4 transition-colors ${
                            step.id < currentStep ? 'bg-primary' : 'bg-muted'
                          } sm:mx-1`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </DialogHeader>

              {/* Scrollable Content */}
              <div
                ref={contentRef}
                className="flex-1 min-h-0 overflow-y-auto px-6 py-4 sm:px-2 sm:py-2"
                style={{ maxHeight: 'calc(90vh - 72px - 64px)' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentStep === 1 ? (
                      <ServiceSelection
                        bookingData={{ ...bookingData, services: selectedServices }}
                        setSelectedServices={setSelectedServices}
                        preselectedServiceId={preselectedServiceId}
                      />
                    ) : currentStep === 2 ? (
                      <StylistSelection
                        bookingData={bookingData}
                        selectedStylist={selectedStylist}
                        setSelectedStylist={setSelectedStylist}
                      />
                    ) : currentStep === 3 ? (
                      <DateTimeSelection
                        bookingData={bookingData}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                      />
                    ) : (
                      <BookingSummary
                        bookingData={{ ...bookingData, salon }}
                        onComplete={handleStepComplete}
                        onBookingComplete={handleBookingComplete}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Sticky Footer */}
              <div className="flex items-center justify-between px-6 pb-6 pt-2 bg-background shrink-0 sm:px-2 sm:pb-3 sm:pt-1 sm:flex-col sm:gap-2">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    className="flex items-center space-x-2 w-auto sm:w-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>
                )}
                <div className="text-sm text-muted-foreground sm:text-xs">
                  Step {currentStep} of {steps.length}
                </div>
                {currentStep < steps.length && (
                  <Button
                    variant="luxury"
                    onClick={() => {
                      if (currentStep === 1) {
                        const totalPrice = selectedServices.reduce((total, service) => {
                          const price = parseFloat(service.price.replace(/[^0-9.]/g, ''));
                          return total + price;
                        }, 0);
                        handleStepComplete({ services: selectedServices, totalPrice });
                      } else if (currentStep === 2) {
                        handleStepComplete({ stylist: selectedStylist });
                      } else if (currentStep === 3) {
                        handleStepComplete({ date: selectedDate, time: selectedTime });
                      } else {
                        handleNext();
                      }
                    }}
                    disabled={currentStep === 1 ? selectedServices.length === 0 : currentStep === 2 ? !selectedStylist : currentStep === 3 ? !(selectedDate && selectedTime) : !canProceed()}
                   className="flex items-center space-x-2 w-auto sm:w-full"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};