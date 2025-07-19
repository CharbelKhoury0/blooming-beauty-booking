import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Clock, Plus, Minus, User, Users } from 'lucide-react';
import { Scissors, Palette, Sparkles, Crown, Heart, Zap } from 'lucide-react';
import type { BookingData, PersonBookingData, Service, Stylist } from '@/types/booking';

// Mock services data
const availableServices: Service[] = [
  {
    id: '1',
    name: 'Hair Styling & Cut',
    description: 'Professional cuts, styling, and blow-dry services tailored to your face shape.',
    price: 'From $85',
    duration: '60-90 min',
    icon: Scissors,
    popular: true,
  },
  {
    id: '2',
    name: 'Hair Coloring',
    description: 'Full color, highlights, balayage, and color correction.',
    price: 'From $120',
    duration: '2-4 hours',
    icon: Palette,
    popular: true,
  },
  {
    id: '3',
    name: 'Facial Treatments',
    description: 'Rejuvenating facials using premium skincare products.',
    price: 'From $95',
    duration: '60-75 min',
    icon: Sparkles,
  },
  {
    id: '4',
    name: 'Bridal Package',
    description: 'Complete bridal beauty package including hair and makeup.',
    price: 'From $350',
    duration: '4-6 hours',
    icon: Crown,
  },
  {
    id: '5',
    name: 'Spa Treatments',
    description: 'Relaxing massage, body treatments, and wellness services.',
    price: 'From $110',
    duration: '60-90 min',
    icon: Heart,
  },
  {
    id: '6',
    name: 'Express Services',
    description: 'Quick touch-ups, eyebrow shaping, and express treatments.',
    price: 'From $35',
    duration: '15-30 min',
    icon: Zap,
  },
];

// Mock stylists data
const availableStylists: Stylist[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Hair Stylist',
    experience: '8 years',
    specialties: ['Color Correction', 'Balayage', 'Precision Cuts'],
    rating: 4.9,
    reviewCount: 127,
    availability: 'available',
    bio: 'Specializes in modern color techniques and precision cuts.',
  },
  {
    id: '2',
    name: 'Emily Rodriguez',
    title: 'Master Colorist',
    experience: '12 years',
    specialties: ['Hair Color', 'Highlights', 'Bridal Hair'],
    rating: 5.0,
    reviewCount: 203,
    availability: 'available',
    bio: 'Award-winning colorist with expertise in all color services.',
  },
  {
    id: '3',
    name: 'Jessica Chen',
    title: 'Beauty Specialist',
    experience: '6 years',
    specialties: ['Facials', 'Skincare', 'Spa Treatments'],
    rating: 4.8,
    reviewCount: 89,
    availability: 'available',
    bio: 'Licensed esthetician specializing in anti-aging treatments.',
  },
  {
    id: '4',
    name: 'Maria Santos',
    title: 'Hair & Makeup Artist',
    experience: '10 years',
    specialties: ['Bridal Makeup', 'Special Events', 'Hair Styling'],
    rating: 4.9,
    reviewCount: 156,
    availability: 'available',
    bio: 'Professional makeup artist and hair stylist for all occasions.',
  },
  {
    id: 'any',
    name: 'Any Available Stylist',
    title: 'Best Match',
    experience: 'Varies',
    specialties: ['All Services'],
    rating: 4.9,
    reviewCount: 500,
    availability: 'available',
    bio: 'We\'ll match you with the best available stylist for your services.',
  },
];

interface EnhancedServiceSelectionProps {
  bookingData: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  preselectedServiceId?: string;
}

export const EnhancedServiceSelection = ({ 
  bookingData, 
  onUpdate, 
  preselectedServiceId 
}: EnhancedServiceSelectionProps) => {
  const [activePersonIndex, setActivePersonIndex] = useState(0);
  const peopleBookings = bookingData.peopleBookings || [];

  useEffect(() => {
    if (preselectedServiceId && peopleBookings.length > 0) {
      const preselectedService = availableServices.find(s => s.id === preselectedServiceId);
      if (preselectedService) {
        const updated = [...peopleBookings];
        const existingService = updated[0]?.services.find(s => s.service.id === preselectedServiceId);
        if (!existingService) {
          if (!updated[0]) updated[0] = { personName: '', services: [] };
          updated[0].services.push({ service: preselectedService });
          updateTotalPrice(updated);
        }
      }
    }
  }, [preselectedServiceId, peopleBookings.length]);

  const toggleService = (service: Service, personIndex: number) => {
    const updated = [...peopleBookings];
    const person = updated[personIndex];
    
    const existingIndex = person.services.findIndex(s => s.service.id === service.id);
    if (existingIndex >= 0) {
      person.services.splice(existingIndex, 1);
    } else {
      person.services.push({ service });
    }
    
    updateTotalPrice(updated);
  };

  const updateStylist = (serviceIndex: number, personIndex: number, stylistId: string) => {
    const updated = [...peopleBookings];
    const stylist = availableStylists.find(s => s.id === stylistId);
    if (stylist) {
      updated[personIndex].services[serviceIndex].stylist = stylist;
      onUpdate({ peopleBookings: updated });
    }
  };

  const updateTotalPrice = (updatedPeopleBookings: PersonBookingData[]) => {
    const total = updatedPeopleBookings.reduce((sum, person) => {
      return sum + person.services.reduce((personSum, { service }) => {
        const price = parseFloat(service.price.replace(/[^0-9.]/g, ''));
        return personSum + price;
      }, 0);
    }, 0);
    
    onUpdate({ 
      peopleBookings: updatedPeopleBookings, 
      totalPrice: total 
    });
  };

  const getCurrentPerson = () => peopleBookings[activePersonIndex] || { personName: '', services: [] };
  const getTotalServices = () => peopleBookings.reduce((sum, person) => sum + person.services.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          Choose Services
        </h3>
        <p className="text-muted-foreground">
          Select services and assign stylists for each person.
        </p>
        <p className="text-sm text-red-500 mt-2">
          * Every person must select at least one service to proceed
        </p>
      </div>

      {/* Person Tabs (if multiple people) */}
      {bookingData.numberOfPeople > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {peopleBookings.map((person, index) => (
            <Button
              key={index}
              variant={activePersonIndex === index ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActivePersonIndex(index)}
              className={`relative ${person.services.length === 0 ? 'ring-2 ring-red-500' : ''}`}
            >
              <User className="w-4 h-4 mr-1" />
              {person.personName || `Person ${index + 1}`}
              {person.services.length > 0 && (
                <Badge className="ml-2 h-5 min-w-5 text-xs">
                  {person.services.length}
                </Badge>
              )}
              {person.services.length === 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 text-xs">
                  No services
                </Badge>
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Service Selection */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground text-center">
          Services for {getCurrentPerson().personName || `Person ${activePersonIndex + 1}`}
        </h4>
        
        <div className="grid gap-3">
          {availableServices.map((service, index) => {
            const Icon = service.icon;
            const isSelected = getCurrentPerson().services.some(s => s.service.id === service.id);
            const selectedService = getCurrentPerson().services.find(s => s.service.id === service.id);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`card-luxury p-4 cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-primary shadow-luxury' : 'hover:shadow-soft'
                }`}
                onClick={() => toggleService(service, activePersonIndex)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={isSelected}
                    className="mt-1"
                  />
                  
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-primary' : 'bg-primary/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-primary'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-foreground text-sm">{service.name}</h5>
                      {service.popular && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold text-sm">{service.price}</span>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stylist Selection for Selected Service */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <div className="flex flex-col gap-3">
                      <Label className="text-sm font-medium text-foreground">
                        Choose Stylist: <span className="text-red-500">*</span>
                      </Label>
                      
                     <div className="relative">
                      <Select
                        value={selectedService?.stylist?.id || ''}
                        onValueChange={(value) => {
                          const serviceIndex = getCurrentPerson().services.findIndex(s => s.service.id === service.id);
                          updateStylist(serviceIndex, activePersonIndex, value);
                        }}
                      >
                        <SelectTrigger className="w-full h-12 text-sm border-2 border-primary/20 hover:border-primary/40 focus:border-primary transition-colors">
                          <SelectValue placeholder="Select stylist..." />
                        </SelectTrigger>
                        <SelectContent 
                          className="max-h-60"
                        >
                          {availableStylists.map((stylist) => (
                            <SelectItem key={stylist.id} value={stylist.id} className="text-sm py-3 cursor-pointer">
                              {stylist.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                     </div>
                      
                      <p className="text-xs text-muted-foreground">
                        Select your preferred stylist or choose "Any Available Stylist" for the best match.
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {getTotalServices() > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card-luxury p-4 bg-primary/5"
        >
          <h4 className="font-semibold text-foreground mb-3">Booking Summary</h4>
          <div className="space-y-3">
            {peopleBookings.map((person, personIndex) => (
              person.services.length > 0 && (
                <div key={personIndex} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">
                      {person.personName || `Person ${personIndex + 1}`}
                    </span>
                  </div>
                  {person.services.map((serviceData, serviceIndex) => (
                    <div key={serviceIndex} className="flex items-center justify-between text-sm ml-6">
                      <div>
                        <span className="text-foreground">{serviceData.service.name}</span>
                        {serviceData.stylist && (
                          <span className="text-muted-foreground ml-2">
                            with {serviceData.stylist.name}
                          </span>
                        )}
                      </div>
                      <span className="text-primary font-medium">{serviceData.service.price}</span>
                    </div>
                  ))}
                </div>
              )
            ))}
            <div className="border-t border-border pt-2 mt-3">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-foreground">Estimated Total</span>
                <span className="text-primary">${bookingData.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Validation Status */}
      {bookingData.numberOfPeople > 1 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground text-sm">Service Selection Status:</h4>
          {peopleBookings.map((person, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              {person.services.length > 0 ? (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              )}
              <span className={person.services.length > 0 ? 'text-green-600' : 'text-red-600'}>
                {person.personName || `Person ${index + 1}`}: {person.services.length > 0 ? 'Services selected' : 'No services selected'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};