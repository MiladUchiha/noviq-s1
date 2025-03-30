import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check for missing environment variables and provide clear error messages
const missingVars = [];
if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (missingVars.length > 0) {
  const errorMessage = `Missing Supabase environment variables: ${missingVars.join(', ')}. Make sure these are defined in your deployment environment.`;
  console.error(errorMessage);
  
  // In production, we'll provide a clearer error but not throw
  // which would prevent the app from starting at all
  if (process.env.NODE_ENV === 'development') {
    throw new Error(errorMessage);
  }
}

// Create a fallback or mock client for production if variables are missing
// This allows the app to at least start in production rather than crash
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: { message: 'Supabase client not properly configured' } })
          }),
          insert: () => ({
            select: () => ({
              single: async () => ({ data: null, error: { message: 'Supabase client not properly configured' } })
            })
          }),
          update: () => ({
            eq: () => ({
              select: () => ({
                single: async () => ({ data: null, error: { message: 'Supabase client not properly configured' } })
              })
            })
          })
        })
      }),
      auth: {
        getSession: async () => ({ data: { session: null }, error: { message: 'Supabase client not properly configured' } })
      }
    };

export default supabase; 