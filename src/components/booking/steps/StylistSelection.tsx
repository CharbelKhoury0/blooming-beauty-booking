import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Star, Clock, Award, Users } from 'lucide-react';
import type { BookingData } from '@/types/booking';

// CMS-ready stylist data structure
export interface Stylist {
  id: string;
  name: string;
  title: string;
  experience: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  availability: 'available' | 'busy' | 'unavailable';
  image?: string;
  bio?: string;
}

const stylists: Stylist[] = [
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
    availability: 'busy',
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

interface StylistSelectionProps {
  bookingData: BookingData;
  selectedStylist: string | undefined;
  setSelectedStylist: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const StylistSelection = ({ bookingData, selectedStylist, setSelectedStylist }: StylistSelectionProps) => {

  const handleStylistSelect = (stylistId: string) => {
    setSelectedStylist(stylistId);
  };

  const getAvailabilityBadge = (availability: Stylist['availability']) => {
    switch (availability) {
      case 'available':
        return <Badge className="bg-success/10 text-success border-success/20">Available</Badge>;
      case 'busy':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Limited</Badge>;
      case 'unavailable':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Unavailable</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          Choose Your Stylist
        </h3>
        <p className="text-muted-foreground">
          Select a preferred stylist for your appointment, or let us choose the best match for you.
        </p>
      </div>

      <div className="grid gap-4 mb-8">
        {stylists.map((stylist, index) => (
          <motion.div
            key={stylist.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              role="button"
              tabIndex={0}
              style={{ touchAction: 'manipulation' }}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                selectedStylist === stylist.id
                  ? 'ring-2 ring-primary shadow-luxury'
                  : 'hover:shadow-soft'
              } ${
                stylist.availability === 'unavailable' 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              onClick={e => {
                e.stopPropagation();
                if (stylist.availability !== 'unavailable') {
                  handleStylistSelect(stylist.id);
                }
              }}
              onKeyDown={e => {
                if ((e.key === 'Enter' || e.key === ' ') && stylist.availability !== 'unavailable') {
                  e.stopPropagation();
                  handleStylistSelect(stylist.id);
                }
              }}
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">
                        {stylist.name}
                      </h4>
                      <p className="text-primary font-medium">{stylist.title}</p>
                    </div>
                    {getAvailabilityBadge(stylist.availability)}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {stylist.bio}
                  </p>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {stylist.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({stylist.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-sm">{stylist.experience} experience</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {stylist.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="secondary"
                        className="text-xs"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedStylist === stylist.id && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Stylist Info */}
      {selectedStylist && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card-luxury p-4 bg-primary/5"
        >
          <h4 className="font-semibold text-foreground mb-2">Selected Stylist</h4>
          <div className="text-sm text-muted-foreground">
            {selectedStylist === 'any' 
              ? 'We\'ll match you with the best available stylist for your selected services.'
              : `You've selected ${stylists.find(s => s.id === selectedStylist)?.name}. They will provide your selected services.`
            }
          </div>
        </motion.div>
      )}
    </div>
  );
};