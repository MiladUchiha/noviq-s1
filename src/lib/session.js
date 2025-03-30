import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

/**
 * Get the current session server-side
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if the user is authenticated server-side
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Get the current user ID from the session
 */
export async function getCurrentUserId() {
  const session = await getSession();
  return session?.user?.id;
} 