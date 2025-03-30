import supabase from '@/lib/supabase';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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

        // Check if user exists in Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error || !data) {
          return null;
        }

        // Verify password
        const isPasswordValid = await compare(credentials.password, data.password);
        
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: data.id,
          name: data.name,
          email: data.email,
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
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
      
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      if (token.hasIdea) {
        session.user.hasIdea = true;
      }
      
      // This signals to client-side code that this is a new session
      // useful for Google auth flow to know when to redirect
      session.isNewSession = true;
      
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
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

