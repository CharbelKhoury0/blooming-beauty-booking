import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock } from 'lucide-react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import type { BookingData } from '@/types/booking';
import { supabase } from '@/integrations/supabase/client';

// CMS-ready time slot data structure
interface TimeSlot {
  time: string;
  available: boolean;
  popular?: boolean;
}

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const startHour = 9;
  const endHour = isWeekend ? 17 : 19; // Weekends close earlier
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Mock availability logic (in real app, this would come from backend)
      const isPopularTime = (hour >= 10 && hour <= 14) || (hour >= 16 && hour <= 18);
      const randomAvailability = Math.random() > 0.3; // 70% chance of being available
      
      slots.push({
        time: timeString,
        available: randomAvailability,
        popular: isPopularTime && randomAvailability,
      });
    }
  }
  
  return slots;
};

interface DateTimeSelectionProps {
  bookingData: BookingData;
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedTime: string | undefined;
  setSelectedTime: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const DateTimeSelection = ({ bookingData, selectedDate, setSelectedDate, selectedTime, setSelectedTime }: DateTimeSelectionProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch bookings and filter time slots when stylist or date changes
  useEffect(() => {
    const fetchAndFilterTimeSlots = async () => {
      if (!selectedDate || !bookingData.stylist) {
        setTimeSlots([]);
        return;
      }
      setLoading(true);
      // Format date as YYYY-MM-DD
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      // Find stylist ID (assume stylist is ID or name)
      let stylistId = bookingData.stylist;
      if (bookingData.salon?.stylists) {
        const stylistObj = bookingData.salon.stylists.find(
          s => s.id === bookingData.stylist || s.name === bookingData.stylist
        );
        if (stylistObj) stylistId = stylistObj.id;
      }
      // Fetch bookings for this stylist and date
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('stylist_id', stylistId)
        .eq('booking_date', formattedDate);
      const bookedTimes = bookings ? bookings.map(b => b.booking_time) : [];
      // Generate all possible time slots
      const allSlots = generateTimeSlots(selectedDate).map(slot => ({
        ...slot,
        available: !bookedTimes.includes(slot.time),
      }));
      setTimeSlots(allSlots);
      setLoading(false);
    };
    fetchAndFilterTimeSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, bookingData.stylist]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
  };

  // Disable dates before today and more than 3 months ahead
  const disabledDays = (date: Date) => {
    const today = new Date();
    const maxDate = addDays(today, 90);
    return date < today || date > maxDate;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          Select Date & Time
        </h3>
        <p className="text-muted-foreground">
          Choose your preferred appointment date and time. Available slots are shown below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="w-[320px] flex flex-col items-center justify-center">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Choose Date
          </h4>
          <Card className="p-4 flex items-center justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              className="rounded-md border-0 min-w-[260px] min-h-[320px]"
            />
          </Card>
        </div>

        {/* Time Slots */}
        <div className="min-w-[220px]">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Available Times
            {selectedDate && (
              <Badge variant="secondary" className="ml-2">
                {getDateLabel(selectedDate)}
              </Badge>
            )}
          </h4>

          {loading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">Loading...</div>
          ) : !selectedDate ? (
            <Card className="p-8 text-center">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Please select a date to view available time slots
              </p>
            </Card>
          ) : (
            <Card className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto min-w-0">
                {timeSlots.map((slot) => (
                  <motion.button
                    style={{ minWidth: 0 }}
                    key={slot.time}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 w-full ${
                      !slot.available
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : selectedTime === slot.time
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-background border border-border hover:bg-accent hover:text-accent-foreground'
                    } ${
                      slot.popular ? 'ring-1 ring-primary/20' : ''
                    }`}
                    disabled={!slot.available}
                    onClick={() => handleTimeSelect(slot.time)}
                  >
                    <div className="flex flex-col items-center">
                      <span>{slot.time}</span>
                      {slot.popular && slot.available && (
                        <span className="text-xs opacity-75 mt-1">Popular</span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {timeSlots.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No available time slots for this date
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card-luxury p-4 mt-8 bg-primary/5"
        >
          <h4 className="font-semibold text-foreground mb-3">Appointment Details</h4>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Date:</span>
              <div className="font-medium text-foreground">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Time:</span>
              <div className="font-medium text-foreground">{selectedTime}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Services:</span>
              <div className="font-medium text-foreground">
                {bookingData.services.map(s => s.name).join(', ')}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Estimated Duration:</span>
              <div className="font-medium text-foreground">
                {/* Calculate total duration */}
                2-3 hours
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};