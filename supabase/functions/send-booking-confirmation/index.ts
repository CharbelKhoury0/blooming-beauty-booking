import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  booking: {
    id: string;
    confirmation_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    booking_date: string;
    booking_time: string;
    stylist_name: string;
    total_price: number;
    customer_notes?: string;
  };
  services: Array<{
    id: string;
    name: string;
    price: string;
    duration: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking, services }: BookingConfirmationRequest = await req.json();

    // Format the booking date and time
    const bookingDate = new Date(booking.booking_date);
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const [hours, minutes] = booking.booking_time.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    const formattedTime = time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Generate services list HTML
    const servicesHtml = services.map(service => 
      `<li style="margin-bottom: 8px;">
        <strong>${service.name}</strong> - ${service.price} (${service.duration})
      </li>`
    ).join('');

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Bloom Beauty Salon <onboarding@resend.dev>",
      to: [booking.customer_email],
      subject: `Booking Confirmation - ${booking.confirmation_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e11d48; margin: 0;">Bloom Beauty Salon</h1>
            <p style="color: #666; margin: 5px 0;">Your Beauty, Our Passion</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Booking Confirmed!</h2>
            <p>Hi ${booking.customer_name},</p>
            <p>Your appointment has been successfully scheduled. Here are your booking details:</p>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #e11d48; margin-top: 0;">Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Confirmation Number:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${booking.confirmation_number}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Date:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Time:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${formattedTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Stylist:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${booking.stylist_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Total:</strong></td>
                <td style="padding: 8px 0; font-weight: bold; color: #e11d48;">$${booking.total_price.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #e11d48; margin-top: 0;">Services Booked</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${servicesHtml}
            </ul>
          </div>
          
          ${booking.customer_notes ? `
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <h4 style="color: #92400e; margin-top: 0;">Special Notes:</h4>
            <p style="margin: 0; color: #92400e;">${booking.customer_notes}</p>
          </div>
          ` : ''}
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Important Information</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>Please arrive 10 minutes before your appointment time</li>
              <li>If you need to reschedule, please call us at least 24 hours in advance</li>
              <li>Bring your confirmation number: <strong>${booking.confirmation_number}</strong></li>
            </ul>
          </div>
          
          <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #666; margin: 0;">Thank you for choosing Bloom Beauty Salon!</p>
            <p style="color: #666; margin: 5px 0;">We look forward to seeing you soon.</p>
          </div>
        </div>
      `,
    });

    console.log("Customer confirmation email sent:", customerEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      customerEmailId: customerEmailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);