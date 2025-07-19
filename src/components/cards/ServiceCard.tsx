import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star } from 'lucide-react';
import type { Service } from '@/components/sections/ServicesSection';

interface ServiceCardProps {
  service: any;
  onBookingClick?: (serviceId?: string) => void;
}

export const ServiceCard = ({ service, onBookingClick }: ServiceCardProps) => {
  // Fallback icons for services without specific icons
  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('hair') && serviceName.toLowerCase().includes('cut')) return '✂️';
    if (serviceName.toLowerCase().includes('color')) return '🎨';
    if (serviceName.toLowerCase().includes('facial')) return '✨';
    if (serviceName.toLowerCase().includes('bridal')) return '👰';
    if (serviceName.toLowerCase().includes('spa')) return '💆';
    if (serviceName.toLowerCase().includes('express')) return '⚡';
    return '💅';
  };

  return (
    <motion.div
      className="card-luxury p-6 group cursor-pointer h-full"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={() => onBookingClick?.(service.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center overflow-hidden">
            {service.image_url ? (
              <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">{getServiceIcon(service.name)}</span>
            )}
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            {service.popular && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                Popular
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        {service.description}
      </p>

      {/* Service Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Price</span>
          <span className="text-primary font-semibold">{service.price}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Duration</span>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="text-sm">{service.duration}</span>
          </div>
        </div>
      </div>

      {/* Rating (placeholder for CMS integration) */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-primary text-primary" />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">5.0 (24 reviews)</span>
      </div>

      {/* CTA Button */}
      <Button
        variant="outline-luxury"
        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
        onClick={(e) => {
          e.stopPropagation();
          onBookingClick?.(service.id);
        }}
      >
        Book Service
      </Button>
    </motion.div>
  );
};