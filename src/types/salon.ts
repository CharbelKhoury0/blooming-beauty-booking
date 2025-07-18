import { Json } from '@/integrations/supabase/types';

// Database types for salon data
export interface Salon {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  hero_image_url?: string;
  primary_color?: string;
  booking_email?: string;
  about?: string;
  address?: string;
  map_embed_url?: string;
  phone?: string;
  socials?: Json;
  created_at: string;
  updated_at: string;
  working_hours?: string;
}

export interface Service {
  id: string;
  salon_id: string;
  name: string;
  description?: string;
  price: string;
  duration: string;
  image_url?: string;
  popular?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stylist {
  id: string;
  salon_id: string;
  name: string;
  bio?: string;
  image_url?: string;
  availability?: Json;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  salon_id: string;
  author_name: string;
  text: string;
  rating: number;
  serviceName?: string; // Added serviceName property
  created_at: string;
  updated_at: string;
}

export interface SalonData {
  salon: Salon;
  services: Service[];
  stylists: Stylist[];
  testimonials: Testimonial[];
}