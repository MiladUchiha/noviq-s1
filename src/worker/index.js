/**
 * Simple Cloudflare Worker for Noviq S1
 */
const worker = {
  async fetch(request, env, ctx) {
    // Log available environment variables for debugging
    console.log("Environment variables available:", Object.keys(env));
    
    const url = new URL(request.url);
    
    // Handle API route for environment variables
    if (url.pathname === "/api/env") {
      // Only expose public variables to the client
      return new Response(JSON.stringify({
        NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    // Add CORS headers for preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }
    
    // Default response
    return new Response(`Noviq S1 Worker is running! Environment variables are configured.`, {
      headers: { "Content-Type": "text/plain" }
    });
  }
};

export default worker; 