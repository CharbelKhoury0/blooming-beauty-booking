import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Users } from 'lucide-react';
import type { BookingData, PersonBookingData } from '@/types/booking';

interface PeopleSelectionProps {
  bookingData: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
}

export const PeopleSelection = ({ bookingData, onUpdate }: PeopleSelectionProps) => {
  const [numberOfPeople, setNumberOfPeople] = useState(bookingData.numberOfPeople || 1);
  const [peopleBookings, setPeopleBookings] = useState<PersonBookingData[]>(
    bookingData.peopleBookings.length > 0 
      ? bookingData.peopleBookings 
      : [{ personName: '', services: [] }]
  );

  const updateNumberOfPeople = (count: number) => {
    const newCount = Math.max(1, Math.min(6, count)); // Limit between 1-6 people
    setNumberOfPeople(newCount);
    
    const newPeopleBookings = [...peopleBookings];
    
    if (newCount > peopleBookings.length) {
      // Add more people
      for (let i = peopleBookings.length; i < newCount; i++) {
        newPeopleBookings.push({ personName: '', services: [] });
      }
    } else if (newCount < peopleBookings.length) {
      // Remove people
      newPeopleBookings.splice(newCount);
    }
    
    setPeopleBookings(newPeopleBookings);
    onUpdate({ 
      numberOfPeople: newCount, 
      peopleBookings: newPeopleBookings 
    });
  };

  const updatePersonName = (index: number, name: string) => {
    const updated = [...peopleBookings];
    updated[index] = { ...updated[index], personName: name };
    setPeopleBookings(updated);
    onUpdate({ peopleBookings: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          How many people are booking?
        </h3>
        <p className="text-muted-foreground">
          You can book for up to 6 people in a single appointment.
        </p>
      </div>

      {/* Number Selector */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateNumberOfPeople(numberOfPeople - 1)}
          disabled={numberOfPeople <= 1}
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center space-x-2 bg-muted/50 px-6 py-3 rounded-xl">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-2xl font-semibold text-foreground min-w-[2ch] text-center">
            {numberOfPeople}
          </span>
          <span className="text-muted-foreground">
            {numberOfPeople === 1 ? 'person' : 'people'}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateNumberOfPeople(numberOfPeople + 1)}
          disabled={numberOfPeople >= 6}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Names Input */}
      {numberOfPeople > 1 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <h4 className="font-semibold text-foreground text-center">
            Who's coming? (Optional)
          </h4>
          <div className="grid gap-3 max-w-md mx-auto">
            {peopleBookings.map((person, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-sm font-medium">
                  {index === 0 ? 'Main Contact' : `Person ${index + 1}`}
                </Label>
                <Input
                  placeholder={index === 0 ? 'Your name' : `Person ${index + 1}'s name`}
                  value={person.personName}
                  onChange={(e) => updatePersonName(index, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            You can assign services to specific people in the next steps.
          </p>
        </motion.div>
      )}

      {numberOfPeople === 1 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Perfect! You'll proceed to select services for yourself.
          </p>
        </div>
      )}
    </div>
  );
};