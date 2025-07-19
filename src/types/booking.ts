export interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  description?: string;
  popular?: boolean;
  icon?: any;
}

export interface Stylist {
  id: string;
  name: string;
  title?: string;
  experience?: string;
  specialties?: string[];
  rating?: number;
  reviewCount?: number;
  availability?: 'available' | 'busy' | 'unavailable';
  image?: string;
  bio?: string;
}

export interface PersonBookingData {
  personName: string;
  services: Array<{
    service: Service;
    stylist?: Stylist;
  }>;
}

export interface BookingData {
  salon?: {
    id: string;
    name: string;
  };
  numberOfPeople: number;
  peopleBookings: PersonBookingData[];
  date?: string;
  time?: string;
  totalPrice: number;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
}

export interface BookingRequest {
  salon_id: string;
  confirmation_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_notes?: string;
  booking_date: string;
  booking_time: string;
  stylist_id?: string;
  stylist_name: string;
  services: Array<{
    id: string;
    name: string;
    price: string;
    duration: string;
  }>;
  total_price: number;
  status: 'pending';
  number_of_people: number;
  people_data: Array<{
    person_name: string;
    services: Array<{
      service_id: string;
      service_name: string;
      stylist_id?: string;
      stylist_name: string;
    }>;
  }>;
}

export interface BookingResponse {
  id: string;
  confirmation_number: string;
  customer_name: string;
  customer_email: string;
  booking_date: string;
  booking_time: string;
  stylist_name: string;
  total_price: number;
  status: string;
  created_at: string;
}