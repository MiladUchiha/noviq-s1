# Authentication Setup with NextAuth.js and Supabase

This project uses NextAuth.js for authentication with Supabase as the database. The implementation provides:

- Email/password authentication
- Google OAuth authentication
- Protected routes
- User session management

## Setup Steps

1. **Environment Variables**

   The following environment variables are already set up in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXTAUTH_URL=https://localhost:3000
   NEXTAUTH_SECRET=...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

2. **Supabase Database Setup**

   Execute the SQL in `supabase-schema.sql` in your Supabase SQL editor to create the necessary tables.

3. **Google OAuth Setup**

   Ensure your Google OAuth credentials are set up correctly in the Google Cloud Console with the correct redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - Your production URL callback for production

## File Structure

- `src/app/api/auth/[...nextauth]/route.js` - NextAuth API route
- `src/lib/supabase.js` - Supabase client initialization
- `src/lib/auth.js` - Authentication utilities
- `src/lib/session.js` - Server-side session utilities
- `src/app/providers.jsx` - NextAuth provider for client components
- `src/middleware.js` - Authentication middleware for protected routes

## Authentication Flow

1. **Registration**:
   - User registers with email/password or Google
   - For email/password, password is hashed and stored in Supabase
   - For Google, we check if user exists and create if not

2. **Login**:
   - User logs in with email/password or Google
   - NextAuth validates credentials or handles OAuth
   - Creates a JWT session

3. **Protected Routes**:
   - Middleware checks authentication status
   - Redirects to login page if not authenticated
   - Redirects to dashboard if authenticated and trying to access login/register pages

## Using Authentication in Components

### Client Components
```jsx
'use client';
import { useSession, signOut } from 'next-auth/react';

export default function ProfileComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Access Denied</p>;
  
  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

### Server Components
```jsx
import { getSession } from '@/lib/session';

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    // Handle not authenticated case
    return <p>Please log in</p>;
  }
  
  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      {/* Rest of your component */}
    </div>
  );
}
``` 