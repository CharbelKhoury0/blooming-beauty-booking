
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Clock, User, AlertCircle } from 'lucide-react';
import { Scissors, Palette, Sparkles, Crown, Heart, Zap } from 'lucide-react';
import type { BookingData, PersonBookingData, Service, Stylist } from '@/types/booking';

const serviceIcons: { [key: string]: any } = {
  'hair': Scissors,
  'color': Palette,
  'facial': Sparkles,
  'bridal': Crown,
  'spa': Heart,
  'express': Zap,
};

interface EnhancedServiceSelectionProps {
  bookingData: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  preselectedServiceId?: string;
  services?: Service[];
  stylists?: Stylist[];
}

export const EnhancedServiceSelection = ({ 
  bookingData, 
  onUpdate, 
  preselectedServiceId,
  services = [],
  stylists = []
}: EnhancedServiceSelectionProps) => {
  const [activePersonIndex, setActivePersonIndex] = useState(0);
  const peopleBookings = bookingData.peopleBookings || [];

  // Add "Any Available Stylist" option to stylists
  const availableStylists = [
    {
      id: 'any',
      name: 'Any Available Stylist',
      title: 'Best Match',
      experience: 'Varies',
      specialties: ['All Services'],
      rating: 4.9,
      reviewCount: 500,
      availability: 'available' as const,
      bio: 'We\'ll match you with the best available stylist for your services.',
    },
    ...stylists
  ];

  useEffect(() => {
    if (preselectedServiceId && peopleBookings.length > 0) {
      const preselectedService = services.find(s => s.id === preselectedServiceId);
      if (preselectedService) {
        const updated = [...peopleBookings];
        const existingService = updated[0]?.services.find(s => s.service.id === preselectedServiceId);
        if (!existingService) {
          if (!updated[0]) updated[0] = { personName: '', services: [] };
          updated[0].services.push({ 
            service: preselectedService,
            stylist: availableStylists[0] // Default to "Any Available"
          });
          updateTotalPrice(updated);
        }
      }
    }
  }, [preselectedServiceId, peopleBookings.length, services.length]);

  const toggleService = (service: Service, personIndex: number) => {
    const updated = [...peopleBookings];
    const person = updated[personIndex];
    
    const existingIndex = person.services.findIndex(s => s.service.id === service.id);
    if (existingIndex >= 0) {
      person.services.splice(existingIndex, 1);
    } else {
      person.services.push({ 
        service,
        stylist: availableStylists[0] // Default to "Any Available"
      });
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
        const price = parseFloat(service.price.replace(/[^0-9.]/g, '')) || 0;
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
  
  const getServiceIcon = (service: Service) => {
    const serviceName = service.name.toLowerCase();
    if (serviceName.includes('hair') || serviceName.includes('cut') || serviceName.includes('styling')) return Scissors;
    if (serviceName.includes('color') || serviceName.includes('highlight') || serviceName.includes('balayage')) return Palette;
    if (serviceName.includes('facial') || serviceName.includes('skin')) return Sparkles;
    if (serviceName.includes('bridal') || serviceName.includes('wedding')) return Crown;
    if (serviceName.includes('spa') || serviceName.includes('massage')) return Heart;
    if (serviceName.includes('express') || serviceName.includes('quick')) return Zap;
    return Scissors; // Default icon
  };

  const hasUnassignedStylists = () => {
    return peopleBookings.some(person => 
      person.services.some(serviceData => !serviceData.stylist)
    );
  };

  if (services.length === 0) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Services Available</h3>
        <p className="text-muted-foreground">
          Please contact the salon directly to make a booking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          Choose Services
        </h3>
        <p className="text-muted-foreground">
          Select services and assign stylists for each person.
        </p>
        <p className="text-sm text-red-500 mt-2">
          * Every person must select at least one service and assign a stylist to proceed
        </p>
      </div>

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
              {person.services.length > 0 ? (
                <Badge className="ml-2 h-5 min-w-5 text-xs">
                  {person.services.length}
                </Badge>
              ) : (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 text-xs">
                  No services
                </Badge>
              )}
            </Button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-semibold text-foreground text-center">
          Services for {getCurrentPerson().personName || `Person ${activePersonIndex + 1}`}
        </h4>
        
        <div className="grid gap-3">
          {services.map((service) => {
            const Icon = getServiceIcon(service);
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
                  <Checkbox checked={isSelected} className="mt-1" />
                  
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
                    {service.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold text-sm">{service.price}</span>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-border"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex flex-col gap-3">
                      <Label className="text-sm font-medium text-foreground">
                        Choose Stylist: <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selectedService?.stylist?.id || ''}
                        onValueChange={(value) => {
                          const serviceIndex = getCurrentPerson().services.findIndex(s => s.service.id === service.id);
                          updateStylist(serviceIndex, activePersonIndex, value);
                        }}
                      >
                        <SelectTrigger className="w-full h-12 text-sm">
                          <SelectValue placeholder="Select stylist..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {availableStylists.map((stylist) => (
                            <SelectItem key={stylist.id} value={stylist.id} className="text-sm py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">{stylist.name}</span>
                                {stylist.title && (
                                  <span className="text-xs text-muted-foreground">{stylist.title}</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {hasUnassignedStylists() && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Action Required</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Please assign a stylist to all selected services before proceeding.
          </p>
        </div>
      )}

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

      {bookingData.numberOfPeople > 1 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground text-sm">Service Selection Status:</h4>
          {peopleBookings.map((person, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              {person.services.length > 0 && person.services.every(s => s.stylist) ? (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              )}
              <span className={person.services.length > 0 && person.services.every(s => s.stylist) ? 'text-green-600' : 'text-red-600'}>
                {person.personName || `Person ${index + 1}`}: {
                  person.services.length > 0 && person.services.every(s => s.stylist) 
                    ? 'Ready to proceed' 
                    : person.services.length === 0 
                      ? 'No services selected'
                      : 'Missing stylist assignment'
                }
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
