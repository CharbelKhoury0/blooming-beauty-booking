import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Plus, Minus } from 'lucide-react';
import type { BookingData } from '@/types/booking';
import type { Service } from '@/components/sections/ServicesSection';
import { Scissors, Palette, Sparkles, Crown, Heart, Zap } from 'lucide-react';

// Mock services data (CMS-ready structure)
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

interface ServiceSelectionProps {
  bookingData: BookingData;
  setSelectedServices: React.Dispatch<React.SetStateAction<Service[]>>;
  preselectedServiceId?: string;
}

export const ServiceSelection = ({ 
  bookingData, 
  setSelectedServices, 
  preselectedServiceId 
}: ServiceSelectionProps) => {
  const selectedServices = bookingData.services;

  useEffect(() => {
    if (preselectedServiceId && selectedServices.length === 0) {
      const preselectedService = availableServices.find(s => s.id === preselectedServiceId);
      if (preselectedService) {
        setSelectedServices([preselectedService]);
      }
    }
  }, [preselectedServiceId, selectedServices.length, setSelectedServices]);

  const toggleService = (service: Service) => {
    setSelectedServices(prev => {
      const isSelected = prev.find(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => {
      // Extract numeric value from price string
      const price = parseFloat(service.price.replace(/[^0-9.]/g, ''));
      return total + price;
    }, 0);
  };

  // Remove the effect that calls onComplete on every selection change

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          Choose Your Services
        </h3>
        <p className="text-muted-foreground">
          Select one or more services for your appointment. You can combine multiple services.
        </p>
      </div>

      <div className="grid gap-4 mb-8">
        {availableServices.map((service, index) => {
          const Icon = service.icon;
          const isSelected = selectedServices.find(s => s.id === service.id);

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={`card-luxury p-4 cursor-pointer transition-all duration-300 ${
                isSelected ? 'ring-2 ring-primary shadow-luxury' : 'hover:shadow-soft'
              }`}
              onClick={() => toggleService(service)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex items-center pt-1">
                  <Checkbox
                    checked={!!isSelected}
                    onChange={() => toggleService(service)}
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-primary' : 'bg-primary/10'
                  }`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-primary'}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-foreground">{service.name}</h4>
                      {service.popular && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-primary font-semibold">{service.price}</span>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className="text-sm">{service.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card-luxury p-4 mb-6 bg-primary/5"
        >
          <h4 className="font-semibold text-foreground mb-3">Selected Services</h4>
          <div className="space-y-2">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{service.name}</span>
                <span className="text-primary font-medium">{service.price}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-foreground">Estimated Total</span>
                <span className="text-primary">${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};