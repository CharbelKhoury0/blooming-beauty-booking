import { BookingData } from '@/types/booking';
import { AlertCircle, CheckCircle2, Clock, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface ValidationRule {
  id: string;
  label: string;
  isValid: boolean;
  message?: string;
  severity: 'error' | 'warning' | 'success';
}

interface BookingValidationProps {
  bookingData: BookingData;
  currentStep: number;
}

export const BookingValidation = ({ bookingData, currentStep }: BookingValidationProps) => {
  const getValidationRules = (): ValidationRule[] => {
    const rules: ValidationRule[] = [];

    // Step 1: People validation
    if (currentStep >= 1) {
      rules.push({
        id: 'people-count',
        label: 'Number of people selected',
        isValid: bookingData.numberOfPeople > 0,
        message: bookingData.numberOfPeople > 0 ? `${bookingData.numberOfPeople} people` : 'Please select number of people',
        severity: bookingData.numberOfPeople > 0 ? 'success' : 'error'
      });

      if (bookingData.numberOfPeople > 1) {
        const hasAllNames = bookingData.peopleBookings.every(p => p.personName.trim() !== '');
        rules.push({
          id: 'people-names',
          label: 'All people named',
          isValid: hasAllNames,
          message: hasAllNames ? 'All people have names' : 'Please name all people',
          severity: hasAllNames ? 'success' : 'error'
        });
      }
    }

    // Step 2: Services validation
    if (currentStep >= 2) {
      const hasServices = bookingData.peopleBookings.every(p => p.services.length > 0);
      rules.push({
        id: 'services-selected',
        label: 'Services selected',
        isValid: hasServices,
        message: hasServices ? 'All people have services' : 'Please select services for all people',
        severity: hasServices ? 'success' : 'error'
      });

      const hasStylists = bookingData.peopleBookings.every(p => 
        p.services.every(s => s.stylist)
      );
      rules.push({
        id: 'stylists-assigned',
        label: 'Stylists assigned',
        isValid: hasStylists,
        message: hasStylists ? 'All services have stylists' : 'Please assign stylists to all services',
        severity: hasStylists ? 'success' : 'error'
      });
    }

    // Step 3: Date and time validation
    if (currentStep >= 3) {
      rules.push({
        id: 'date-selected',
        label: 'Date selected',
        isValid: !!bookingData.date,
        message: bookingData.date ? new Date(bookingData.date).toLocaleDateString() : 'Please select a date',
        severity: bookingData.date ? 'success' : 'error'
      });

      rules.push({
        id: 'time-selected',
        label: 'Time selected',
        isValid: !!bookingData.time,
        message: bookingData.time ? bookingData.time : 'Please select a time',
        severity: bookingData.time ? 'success' : 'error'
      });
    }

    // Step 4: Contact validation
    if (currentStep >= 4) {
      const hasContact = !!(
        bookingData.primaryContact.name &&
        bookingData.primaryContact.email &&
        bookingData.primaryContact.phone
      );
      rules.push({
        id: 'contact-info',
        label: 'Contact information',
        isValid: hasContact,
        message: hasContact ? 'Contact information complete' : 'Please fill in all contact fields',
        severity: hasContact ? 'success' : 'error'
      });
    }

    return rules;
  };

  const rules = getValidationRules();
  const errorRules = rules.filter(r => r.severity === 'error' && !r.isValid);
  const warningRules = rules.filter(r => r.severity === 'warning' && !r.isValid);

  if (rules.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Error alerts */}
      {errorRules.map(rule => (
        <Alert key={rule.id} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">{rule.label}:</span> {rule.message}
          </AlertDescription>
        </Alert>
      ))}

      {/* Warning alerts */}
      {warningRules.map(rule => (
        <Alert key={rule.id}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">{rule.label}:</span> {rule.message}
          </AlertDescription>
        </Alert>
      ))}

      {/* Progress indicators */}
      <div className="flex flex-wrap gap-2">
        {rules.map(rule => (
          <Badge
            key={rule.id}
            variant={rule.isValid ? "default" : "secondary"}
            className={`text-xs ${
              rule.isValid 
                ? 'bg-success/10 text-success border-success/20' 
                : rule.severity === 'error'
                ? 'bg-destructive/10 text-destructive border-destructive/20'
                : 'bg-warning/10 text-warning border-warning/20'
            }`}
          >
            {rule.isValid ? (
              <CheckCircle2 className="w-3 h-3 mr-1" />
            ) : (
              <AlertCircle className="w-3 h-3 mr-1" />
            )}
            {rule.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};