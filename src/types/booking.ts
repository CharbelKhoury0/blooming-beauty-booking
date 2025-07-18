export interface BookingData {
  salon?: {
    id: string;
    name: string;
  };
  services: Array<{
    id: string;
    name: string;
    price: string;
    duration: string;
  }>;
  stylist?: {
    id: string;
    name: string;
  };
  date?: string;
  time?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNotes?: string;
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