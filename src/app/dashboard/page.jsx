'use client';

import { getUserProfile } from '@/lib/auth';
import { LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from '../../components/Home/Hero/Hero.module.css';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const initialLoadDone = useRef(false);
  const [debugInfo, setDebugInfo] = useState({});

  // Authentication and profile loading
  useEffect(() => {
    const loadUserProfile = async () => {
      if (status !== 'authenticated') {
        if (status === 'unauthenticated') {
          router.push('/login');
        }
        setLoading(false);
        return;
      }
      
      // Don't re-run if we've already processed
      if (initialLoadDone.current) return;
      initialLoadDone.current = true;
      
      try {
        // Validate user ID
        if (!session?.user?.id) {
          console.error("No user ID found in session");
          setError("User ID not found. Try logging out and back in.");
          setLoading(false);
          return;
        }
        
        console.log("User ID from session:", session.user.id);
        
        // Just load the user profile
        try {
          const profile = await getUserProfile(session.user.id);
          setUserProfile(profile);
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
          setError(`Error loading profile: ${profileError.message}`);
        }
        
        // Clean up any leftover localStorage items for safety
        if (typeof window !== 'undefined') {
          const hadPendingIdea = localStorage.getItem('pending_idea');
          const hadRedirectFlag = localStorage.getItem('redirect_to_idea');
          
          setDebugInfo({
            hadPendingIdea: hadPendingIdea ? 'Yes' : 'No',
            hadRedirectFlag: hadRedirectFlag ? 'Yes' : 'No',
          });
          
          // Clear these as they shouldn't be needed anymore
          localStorage.removeItem('pending_idea');
          localStorage.removeItem('redirect_to_idea');
          localStorage.removeItem('auth_method');
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error in auth handler:", error);
        setError(`Error: ${error.message}`);
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, [status, session, router]);

  // Handle user logout
  const handleSignOut = async () => {
    localStorage.removeItem('pending_idea');
    localStorage.removeItem('redirect_to_idea');
    localStorage.removeItem('auth_method');
    await signOut({ callbackUrl: '/' });
  };

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.dashboardContainer}>
          <h1>Loading...</h1>
          <p>Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  // Dashboard UI
  return (
    <div className={styles.container}>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1>Dashboard</h1>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        <div className={styles.welcomeSection}>
          <div className={styles.userAvatar}>
            <User size={48} />
          </div>
          <h2>Welcome, {session?.user?.name || 'User'}!</h2>
          <p>You are signed in as {session?.user?.email}</p>
          
          {error && (
            <div className={styles.errorMessage} style={{ margin: '1rem auto', maxWidth: '600px' }}>
              <div className={styles.errorIcon}>⚠️</div>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className={styles.dashboardContent}>
          <div className={styles.dashboardCard}>
            <h3>User Profile</h3>
            {userProfile ? (
              <div>
                <p><strong>Name:</strong> {userProfile.name}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
                <p><strong>Account created:</strong> {new Date(userProfile.created_at).toLocaleDateString()}</p>
                {userProfile.idea && (
                  <div>
                    <p><strong>Your Idea:</strong></p>
                    <p className={styles.ideaPreview}>
                      {userProfile.idea.length > 100 
                        ? `${userProfile.idea.substring(0, 100)}...` 
                        : userProfile.idea}
                    </p>
                    <button 
                      onClick={() => router.push(`/idea?id=${session.user.id}`)} 
                      className={styles.viewIdeaButton}
                    >
                      View Full Idea
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading profile data...</p>
            )}
          </div>
          
          {/* Debug information - only visible during development */}
          {process.env.NODE_ENV === 'development' && (
            <div className={styles.dashboardCard} style={{ marginTop: '1rem' }}>
              <h3>Debug Information</h3>
              <p><strong>Authentication Status:</strong> {status}</p>
              <p><strong>Session ID:</strong> {session?.user?.id}</p>
              <p><strong>Previous localStorage state:</strong></p>
              <ul>
                <li>Had pending idea: {debugInfo.hadPendingIdea}</li>
                <li>Had redirect flag: {debugInfo.hadRedirectFlag}</li>
              </ul>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('pending_idea');
                      localStorage.removeItem('redirect_to_idea');
                      localStorage.removeItem('auth_method');
                      window.location.reload();
                    }
                  }}
                  className={styles.submitButton}
                >
                  Clear localStorage & Reload
                </button>
                
                <button 
                  onClick={() => {
                    if (session?.user?.id) {
                      router.push(`/idea?id=${session.user.id}`);
                    }
                  }}
                  className={styles.viewIdeaButton}
                >
                  Go to Idea Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 