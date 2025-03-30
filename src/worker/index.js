/**
 * Simple Cloudflare Worker for Noviq S1
 */
export default {
  async fetch(request, env, ctx) {
    // Create a response with environment variables available to the client
    const environmentVariables = {
      NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXTAUTH_URL: env.NEXTAUTH_URL || "https://noviq.ahmadpourmilad8.workers.dev",
      NEXTAUTH_SECRET: env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET
    };

    // Log available environment variables for debugging
    console.log("Environment variables available:", Object.keys(env));
    
    // You can add routing logic here based on the request path
    const url = new URL(request.url);
    
    if (url.pathname === "/api/env") {
      // Only expose public variables to the client
      return new Response(JSON.stringify({
        NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Default response
    return new Response(`Noviq S1 Worker is running! Environment variables are configured.`, {
      headers: { "Content-Type": "text/plain" }
    });
  }
}; 