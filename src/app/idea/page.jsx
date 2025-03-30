'use client';

import { getUserProfile } from '@/lib/auth';
import gsap from 'gsap-trial';
import { CustomEase } from 'gsap-trial/CustomEase';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import styles from '../../components/Home/Hero/Hero.module.css';

// Content component that uses searchParams
const IdeaPageContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const ideaBoxRef = useRef(null);
  
  // Fetch user data including the idea
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        router.push('/login');
        return;
      }
      
      try {
        const id = userId || session?.user?.id;
        if (!id) {
          setError('User information not found');
          setIsLoading(false);
          return;
        }
        
        const userData = await getUserProfile(id);
        if (!userData) {
          setError('Could not retrieve user data');
          setIsLoading(false);
          return;
        }
        
        setUserData(userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your idea');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [status, userId, session, router]);
  
  // Initialize animations
  useEffect(() => {
    if (isLoading || !userData) return;
    
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    
    const ctx = gsap.context(() => {
      CustomEase.create("refinedEase", "M0,0 C0.25,0.1 0.25,1 1,1");
      
      // Initial states
      gsap.set(contentRef.current, { opacity: 0, y: 30 });
      gsap.set(ideaBoxRef.current, { opacity: 0, y: 20, scale: 0.95 });
      
      // Animation timeline
      const tl = gsap.timeline({
        defaults: {
          duration: 1,
          ease: "power3.out"
        }
      });
      
      // Background elements
      tl.to(".backgroundLines", {
        opacity: 0.7,
        duration: 2,
        ease: "power2.inOut"
      })
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2
      }, "-=1.5")
      .to(ideaBoxRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: "refinedEase"
      }, "-=0.8");
      
      // Floating elements entrance
      tl.from(".floatingElement", {
        scale: 0,
        opacity: 0,
        stagger: {
          each: 0.2,
          from: "random"
        },
        duration: 1.5,
        ease: "power2.out"
      }, "-=1");
      
      // Floating animation for gradient elements
      gsap.utils.toArray(".floatingElement").forEach((element, i) => {
        gsap.to(element, {
          y: "random(-40, 40)",
          x: "random(-40, 40)",
          duration: "random(4, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2
        });
      });
      
      // Parallax effect on mouse move
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const x = (clientX - innerWidth / 2) / innerWidth;
        const y = (clientY - innerHeight / 2) / innerHeight;
        
        gsap.to(".floatingElements", {
          x: x * 50,
          y: y * 50,
          duration: 1,
          ease: "power2.out"
        });
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, containerRef);
    
    return () => {
      ctx.revert();
    };
  }, [isLoading, userData]);
  
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className="loading">Loading your idea...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.container}>
        <div className="error">{error}</div>
        <Link href="/dashboard" className={styles.submitButton}>
          Go to Dashboard
        </Link>
      </div>
    );
  }
  
  return (
    <div ref={containerRef} className={styles.container}>
      <div className={`${styles.backgroundLines} backgroundLines opacity-0`} />
      
      <section className={styles.hero}>
        <div ref={contentRef} className={`${styles.heroContent} heroContent`}>
          <div className={styles.heroLeft}>
            <h1 className={styles.title}>Your Vision</h1>
            
            <div ref={ideaBoxRef} className={styles.ideaBox}>
              <div className={styles.ideaBoxHeader}>
                <Sparkles size={18} />
                <span>Your Idea</span>
              </div>
              <div className={styles.ideaContent}>
                {userData?.idea || "No idea has been provided yet."}
              </div>
            </div>
            
            <div className={styles.buttonGroup}>
              <Link href="/dashboard" className={styles.submitButton}>
                <span className={styles.buttonText}>
                  Proceed to Dashboard
                </span>
                <span className={styles.buttonGlow} />
              </Link>
            </div>
          </div>
          
          <div className={styles.heroRight}>
            <div className={`${styles.floatingElements} floatingElements`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`${styles.floatingElement} floatingElement`}
                  style={{
                    '--element-delay': `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Main component wrapped in Suspense boundary
const IdeaPage = () => {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Loading...</h2>
            <p>Please wait while we retrieve your idea</p>
          </div>
        </div>
      </div>
    }>
      <IdeaPageContent />
    </Suspense>
  );
};

export default IdeaPage; 