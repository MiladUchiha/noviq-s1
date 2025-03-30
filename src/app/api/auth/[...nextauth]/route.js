import supabase from '@/lib/supabase';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// Check for required environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL || (
  // Default to localhost in development or try to construct in production
  process.env.VERCEL_URL ? 
    `https://${process.env.VERCEL_URL}` : 
    'http://localhost:3000'
);

// Log missing variables but don't throw errors
const missingVars = [];
if (!googleClientId) missingVars.push('GOOGLE_CLIENT_ID');
if (!googleClientSecret) missingVars.push('GOOGLE_CLIENT_SECRET');
if (!nextAuthSecret) missingVars.push('NEXTAUTH_SECRET');
if (!process.env.NEXTAUTH_URL) missingVars.push('NEXTAUTH_URL (using fallback)');

if (missingVars.length > 0) {
  console.warn(`NextAuth: Missing environment variables: ${missingVars.join(', ')}`);
  console.log(`Using NextAuth URL: ${nextAuthUrl}`);
}

// Only add GoogleProvider if both client ID and secret are available
const providers = [];

if (googleClientId && googleClientSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
} else {
  console.warn('GoogleProvider not configured due to missing environment variables');
}

// Always add CredentialsProvider as fallback
providers.push(
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      try {
        // Check if user exists in Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error || !data) {
          console.log('User not found or database error:', error?.message);
          return null;
        }

        // Verify password
        const isPasswordValid = await compare(credentials.password, data.password);
        
        if (!isPasswordValid) {
          console.log('Invalid password for user:', credentials.email);
          return null;
        }

        return {
          id: data.id,
          name: data.name,
          email: data.email,
        };
      } catch (error) {
        console.error('Error in authorize callback:', error);
        return null;
      }
    }
  })
);

export const authOptions = {
  providers,
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      try {
        // Initial sign in
        if (account && user) {
          // If it's a Google sign-in, check if user exists in Supabase
          if (account.provider === 'google') {
            console.log("Processing Google authentication with ID:", user.id);
            
            // First try to find user by email
            const { data: existingUser, error: findError } = await supabase
              .from('users')
              .select('*')
              .eq('email', user.email)
              .single();

            if (findError && findError.code !== 'PGRST116') {
              console.error("Error finding user by email:", findError);
            }

            // If user doesn't exist in Supabase, create one
            if (!existingUser) {
              console.log("User not found, creating new user with Google auth");
              
              // Create userData object for new user
              const userData = {
                name: user.name,
                email: user.email,
                auth_provider: 'google',
                // No need to specify ID - let Supabase generate a UUID
              };
              
              // Insert the new user
              const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert([userData])
                .select()
                .single();

              if (insertError) {
                console.error("Error creating new user:", insertError);
              } else if (newUser) {
                console.log("Created new user with Supabase ID:", newUser.id);
                // Store the Supabase-generated UUID in the token
                token.id = newUser.id;
              }
            } else {
              console.log("Found existing user with ID:", existingUser.id);
              // Store the existing Supabase UUID in the token
              token.id = existingUser.id;
              
              // Check if the user already has an idea stored
              if (existingUser.idea) {
                token.hasIdea = true;
              }
            }
            
            return {
              ...token,
              id: token.id, // Make sure we use the Supabase UUID, not the Google ID
            };
          }

          // For non-Google authentication
          return {
            ...token,
            id: user.id,
          };
        }
      } catch (error) {
        console.error('Error in jwt callback:', error);
      }
      
      return token;
    },
    async session({ session, token }) {
      try {
        if (token.id) {
          session.user.id = token.id;
        }
        if (token.hasIdea) {
          session.user.hasIdea = true;
        }
        
        // This signals to client-side code that this is a new session
        // useful for Google auth flow to know when to redirect
        session.isNewSession = true;
      } catch (error) {
        console.error('Error in session callback:', error);
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Return the URL as is - we'll handle redirects client-side
      // This makes sure all OAuth parameters are preserved
      return url.startsWith('/') ? `${baseUrl}${url}` : url;
    }
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  session: {
    strategy: 'jwt',
  },
  secret: nextAuthSecret || 'fallback-secret-do-not-use-in-production',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

