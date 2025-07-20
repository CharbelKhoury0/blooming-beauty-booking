export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      booking_people: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          person_name: string
          person_order: number
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          person_name: string
          person_order?: number
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          person_name?: string
          person_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_people_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_services: {
        Row: {
          booking_people_id: string
          created_at: string
          id: string
          service_duration: string
          service_id: string
          service_name: string
          service_price: string
          stylist_id: string | null
          stylist_name: string
          updated_at: string
        }
        Insert: {
          booking_people_id: string
          created_at?: string
          id?: string
          service_duration: string
          service_id: string
          service_name: string
          service_price: string
          stylist_id?: string | null
          stylist_name: string
          updated_at?: string
        }
        Update: {
          booking_people_id?: string
          created_at?: string
          id?: string
          service_duration?: string
          service_id?: string
          service_name?: string
          service_price?: string
          stylist_id?: string | null
          stylist_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_services_booking_people_id_fkey"
            columns: ["booking_people_id"]
            isOneToOne: false
            referencedRelation: "booking_people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_services_stylist_id_fkey"
            columns: ["stylist_id"]
            isOneToOne: false
            referencedRelation: "stylists"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          confirmation_number: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_notes: string | null
          customer_phone: string
          id: string
          number_of_people: number | null
          salon_id: string
          services: Json
          status: string
          stylist_id: string | null
          stylist_name: string
          total_price: number
          updated_at: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          confirmation_number: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_notes?: string | null
          customer_phone: string
          id?: string
          number_of_people?: number | null
          salon_id: string
          services: Json
          status?: string
          stylist_id?: string | null
          stylist_name: string
          total_price: number
          updated_at?: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          confirmation_number?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_notes?: string | null
          customer_phone?: string
          id?: string
          number_of_people?: number | null
          salon_id?: string
          services?: Json
          status?: string
          stylist_id?: string | null
          stylist_name?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_stylist_id_fkey"
            columns: ["stylist_id"]
            isOneToOne: false
            referencedRelation: "stylists"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          salon_id: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          salon_id: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          salon_id?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salons: {
        Row: {
          about: string | null
          address: string | null
          created_at: string
          hero_image_url: string | null
          id: string
          map_embed_url: string | null
          name: string
          phone: string | null
          primary_color: string | null
          slug: string
          socials: Json | null
          tagline: string | null
          updated_at: string
          working_hours: string | null
        }
        Insert: {
          about?: string | null
          address?: string | null
          created_at?: string
          hero_image_url?: string | null
          id?: string
          map_embed_url?: string | null
          name: string
          phone?: string | null
          primary_color?: string | null
          slug: string
          socials?: Json | null
          tagline?: string | null
          updated_at?: string
          working_hours?: string | null
        }
        Update: {
          about?: string | null
          address?: string | null
          created_at?: string
          hero_image_url?: string | null
          id?: string
          map_embed_url?: string | null
          name?: string
          phone?: string | null
          primary_color?: string | null
          slug?: string
          socials?: Json | null
          tagline?: string | null
          updated_at?: string
          working_hours?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration: string
          id: string
          image_url: string | null
          name: string
          popular: boolean | null
          price: string
          salon_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: string
          id?: string
          image_url?: string | null
          name: string
          popular?: boolean | null
          price: string
          salon_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string
          id?: string
          image_url?: string | null
          name?: string
          popular?: boolean | null
          price?: string
          salon_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      stylists: {
        Row: {
          availability: Json | null
          bio: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          salon_id: string
          updated_at: string
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          salon_id: string
          updated_at?: string
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          salon_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stylists_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_name: string
          created_at: string
          id: string
          rating: number | null
          salon_id: string
          serviceName: string
          text: string
          updated_at: string
        }
        Insert: {
          author_name: string
          created_at?: string
          id?: string
          rating?: number | null
          salon_id: string
          serviceName?: string
          text: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          created_at?: string
          id?: string
          rating?: number | null
          salon_id?: string
          serviceName?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_stylist_availability: {
        Args: {
          p_stylist_id: string
          p_date: string
          p_time: string
          p_duration_minutes?: number
        }
        Returns: boolean
      }
      generate_confirmation_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
