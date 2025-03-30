'use client';

import { updateUserIdea } from '@/lib/auth';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import styles from '../../components/Home/Hero/Hero.module.css';

// Wrapper component that uses searchParams
const OAuthCallbackContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState({});
  const [pendingIdea, setPendingIdea] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Check for client-side rendering and set mounted state
  useEffect(() => {
    setIsMounted(true);
    // Now that we're mounted, we can safely access localStorage
    const storedIdea = localStorage.getItem('pending_idea');
    setPendingIdea(storedIdea);
  }, []);

  useEffect(() => {
    // Handle the OAuth redirect and pending idea
    const handleOAuthRedirect = async () => {
      // Wait for authentication to complete and component to be mounted
      if (status === 'loading' || !isMounted) return;

      try {
        // If user is not authenticated, redirect to login
        if (status !== 'authenticated') {
          console.log('User not authenticated, redirecting to login');
          router.push('/login');
          return;
        }

        const userId = session?.user?.id;
        if (!userId) {
          throw new Error('No user ID found in session');
        }

        // Check if we need to redirect to idea page
        const shouldRedirect = searchParams.get('redirect_idea') === 'true' || 
                               localStorage.getItem('redirect_to_idea') === 'true';
        
        // Check for pending idea in localStorage
        const pendingIdea = localStorage.getItem('pending_idea');
        
        setDebug({
          userId,
          shouldRedirect,
          pendingIdeaExists: !!pendingIdea,
          pendingIdeaPreview: pendingIdea ? pendingIdea.substring(0, 30) + '...' : null,
          authMethod: localStorage.getItem('auth_method')
        });

        if (pendingIdea && shouldRedirect) {
          console.log('Found pending idea, saving to user profile:', pendingIdea.substring(0, 30) + '...');
          
          // Save the idea to the user's profile
          const result = await updateUserIdea(userId, pendingIdea);
          
          if (!result.success) {
            throw new Error(`Failed to save idea: ${result.error}`);
          }
          
          // Clear localStorage
          localStorage.removeItem('pending_idea');
          localStorage.removeItem('redirect_to_idea');
          localStorage.removeItem('auth_method');
          
          // Redirect to the idea page
          console.log('Redirecting to idea page');
          router.push(`/idea?id=${userId}`);
        } else {
          // No pending idea or no redirect flag, go to dashboard
          console.log('No pending idea or redirect flag, going to dashboard');
          
          // Clear any leftover localStorage items
          localStorage.removeItem('pending_idea');
          localStorage.removeItem('redirect_to_idea');
          localStorage.removeItem('auth_method');
          
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Error processing OAuth callback:', err);
        setError(err.message || 'An error occurred during authentication');
        setIsProcessing(false);
      }
    };

    handleOAuthRedirect();
  }, [status, session, router, searchParams, isMounted]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.errorMessage}>
            <h2>Authentication Error</h2>
            <p>{error}</p>
            <button 
              onClick={() => router.push('/dashboard')}
              className={styles.submitButton}
            >
              Go to Dashboard
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
              <h3>Debug Info:</h3>
              <pre>{JSON.stringify(debug, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.heroContent}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Completing authentication...</h2>
          <p>Please wait while we process your sign-in</p>
          
          {/* Only render this if we're client-side mounted to avoid hydration mismatch */}
          {isMounted && process.env.NODE_ENV === 'development' && pendingIdea && (
            <div style={{ marginTop: '1rem', color: 'green' }}>
              <p>Found your idea! Redirecting you to the idea page...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main component wrapped in Suspense boundary
export default function OAuthCallback() {
  return (
    <Suspense fallback={<div className={styles.container}>
      <div className={styles.heroContent}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading...</h2>
          <p>Please wait while we set up your account</p>
        </div>
      </div>
    </div>}>
      <OAuthCallbackContent />
    </Suspense>
  );
} 