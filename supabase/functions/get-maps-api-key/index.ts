import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Rate limiting store (in-memory for this demo)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10

// Allowed origins for security
const ALLOWED_ORIGINS = [
  'https://unyyraykfzmlxrolyjpg.supabase.co',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://lovable.dev'
]

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Origin validation
    const origin = req.headers.get('origin') || req.headers.get('referer')
    if (origin && !ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed))) {
      console.log(`Blocked request from unauthorized origin: ${origin}`)
      return new Response(
        JSON.stringify({ error: 'Unauthorized origin' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    const clientData = rateLimitStore.get(clientIP) || { count: 0, lastReset: now }
    
    // Reset counter if window has passed
    if (now - clientData.lastReset > RATE_LIMIT_WINDOW) {
      clientData.count = 0
      clientData.lastReset = now
    }
    
    // Check rate limit
    if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`)
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Increment counter
    clientData.count++
    rateLimitStore.set(clientIP, clientData)

    // Request validation
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Only GET requests allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    
    if (!apiKey) {
      console.error('Google Maps API key not configured')
      return new Response(
        JSON.stringify({ error: 'Google Maps API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`API key request from ${clientIP}, origin: ${origin}`)
    return new Response(
      JSON.stringify({ apiKey }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in get-maps-api-key function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})