
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { PeopleSelection } from './steps/PeopleSelection';
import { EnhancedServiceSelection } from './steps/EnhancedServiceSelection';
import { DateTimeSelection } from './steps/DateTimeSelection';
import { EnhancedBookingSummary } from './steps/EnhancedBookingSummary';
import type { BookingData, Service, Stylist } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  salon?: {
    id: string;
    name: string;
  };
  services?: Service[];
  stylists?: Stylist[];
  preselectedServiceId?: string;
}

const steps = [
  { id: 1, title: 'People', description: 'Select number of people' },
  { id: 2, title: 'Services', description: 'Choose services and stylists' },
  { id: 3, title: 'Date & Time', description: 'Pick your appointment time' },
  { id: 4, title: 'Confirm', description: 'Review and confirm booking' },
];

export const BookingModal = ({ isOpen, onClose, preselectedServiceId, services, stylists, salon }: BookingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    salon: salon || { id: '92fa42ea-d94b-4fe1-97b8-23b9afa71328', name: 'Default Salon' },
    numberOfPeople: 1,
    peopleBookings: [{ personName: '', services: [] }],
    totalPrice: 0,
    primaryContact: {
      name: '',
      email: '',
      phone: '',
      notes: ''
    }
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  // Ensure salon data is always available
  useEffect(() => {
    if (salon && salon.id !== bookingData.salon?.id) {
      setBookingData(prev => ({ 
        ...prev, 
        salon: salon 
      }));
    }
  }, [salon, bookingData.salon?.id]);

  const handleStepComplete = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setBookingData(prev => ({ ...prev, date: date.toISOString() }));
    }
  };

  const handleTimeChange = (time: string | undefined) => {
    setSelectedTime(time);
    if (time) {
      setBookingData(prev => ({ ...prev, time }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBookingComplete = () => {
    setIsComplete(true);
    setTimeout(() => {
      setIsComplete(false);
      setCurrentStep(1);
      setBookingData({
        salon: salon || { id: '92fa42ea-d94b-4fe1-97b8-23b9afa71328', name: 'Default Salon' },
        numberOfPeople: 1,
        peopleBookings: [{ personName: '', services: [] }],
        totalPrice: 0,
        primaryContact: {
          name: '',
          email: '',
          phone: '',
          notes: ''
        }
      });
      onClose();
    }, 3000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.numberOfPeople > 0 && 
          (bookingData.numberOfPeople === 1 || 
           bookingData.peopleBookings.every(person => 
             person.personName && person.personName.trim() !== ''
           ));
      case 2:
        return bookingData.peopleBookings.every(person => person.services.length > 0) &&
          bookingData.peopleBookings.every(person => 
            person.services.every(serviceData => serviceData.stylist)
          );
      case 3:
        return !!bookingData.date && !!bookingData.time;
      case 4:
        return !!bookingData.primaryContact?.name && 
               !!bookingData.primaryContact?.email && 
               !!bookingData.primaryContact?.phone;
      default:
        return false;
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepComponents = [PeopleSelection, EnhancedServiceSelection, DateTimeSelection, EnhancedBookingSummary];
  const CurrentStepComponent = stepComponents[currentStep - 1];
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Error boundary for booking issues
  if (!bookingData.salon?.id) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Error</DialogTitle>
          </DialogHeader>
          <div className="text-center p-4">
            <p className="text-muted-foreground mb-4">
              Unable to load salon information. Please try again later.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl max-h-[90vh] p-0 flex flex-col overflow-hidden
          sm:max-w-full sm:w-full sm:h-screen sm:rounded-none sm:max-h-none
          md:max-w-5xl md:w-[80vw] md:h-[85vh]"
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
                Thank you for choosing {bookingData.salon.name}. We've sent a confirmation email 
                with all the details. We can't wait to see you!
              </p>
              <div className="card-luxury p-4 text-left max-w-md mx-auto sm:p-2 sm:max-w-full">
                <div className="space-y-3">
                  <div><strong>People:</strong> {bookingData.numberOfPeople}</div>
                  <div><strong>Services:</strong> {bookingData.peopleBookings.flatMap(p => p.services.map(s => s.service.name)).join(', ')}</div>
                  <div><strong>Date:</strong> {bookingData.date ? new Date(bookingData.date).toLocaleDateString() : 'Not set'}</div>
                  <div><strong>Time:</strong> {bookingData.time || 'Not set'}</div>
                  <div><strong>Total:</strong> ${bookingData.totalPrice.toFixed(2)}</div>
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
              <DialogHeader className="px-4 py-3 border-b border-border shrink-0 sm:px-3 sm:py-2 md:px-10 md:py-6">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-heading font-semibold sm:text-base md:text-2xl">
                    Book Your Appointment - {bookingData.salon.name}
                  </DialogTitle>
                  <Button variant="ghost" size="icon" onClick={onClose} className="sm:w-8 sm:h-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="h-4 sm:h-2 md:h-6"></div>
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex items-center justify-between min-w-max sm:min-w-[400px] px-2 md:px-4">
                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''} whitespace-nowrap`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors shrink-0 md:w-8 md:h-8 md:text-sm ${
                            step.id <= currentStep
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          } sm:w-6 sm:h-6`}
                        >
                          {step.id}
                        </div>
                        <span
                          className={`ml-1.5 text-xs font-medium md:text-sm md:ml-2 ${
                            step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                          } sm:text-[10px]`}
                        >
                          {step.title}
                        </span>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 transition-colors md:h-1 md:mx-3 ${
                              step.id < currentStep ? 'bg-primary' : 'bg-muted'
                            } min-w-[16px]`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DialogHeader>

              <div
                ref={contentRef}
                className="flex-1 overflow-y-auto px-4 py-3 sm:px-3 sm:py-2 md:px-10 md:py-8"
              >
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
                      onUpdate={handleStepComplete}
                      {...(services && { services })}
                      {...(stylists && { stylists })}
                      {...(currentStep === 2 && { preselectedServiceId })}
                      {...(currentStep === 4 && { 
                        onComplete: handleStepComplete,
                        onBookingComplete: handleBookingComplete 
                      })}
                      {...(currentStep === 3 && {
                        selectedDate,
                        setSelectedDate: handleDateChange,
                        selectedTime,
                        setSelectedTime: handleTimeChange,
                      })}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="flex items-center justify-between px-4 py-3 bg-background border-t border-border shrink-0 sm:px-3 sm:py-2 sm:flex-col sm:gap-2 md:px-10 md:py-6">
                {currentStep > 1 ? (
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    className="flex items-center space-x-2 sm:w-full sm:order-2 md:px-8 md:py-3"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>
                ) : <div></div>}
                
                <div className="text-xs text-muted-foreground sm:order-1 md:text-sm">
                  Step {currentStep} of {steps.length}
                </div>
                
                {currentStep < steps.length && (
                  <Button
                    variant="luxury"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center space-x-2 sm:w-full sm:order-3 md:px-8 md:py-3"
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
