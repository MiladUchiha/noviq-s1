'use client'
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import { ArrowRight, PlayCircle } from 'lucide-react'; // Example icons
import { useEffect, useRef } from 'react';
import styles from './Second.module.css'; // New CSS Module Name

// --- Register GSAP Plugins ---
gsap.registerPlugin(ScrollTrigger); // Register globally or here

const SecondaryCTA = () => {
  const sectionRef = useRef(null);
  const blockRef = useRef(null);
  const headlineRef = useRef(null);
  const textRef = useRef(null); // Ref for optional text
  const buttonGroupRef = useRef(null);
  const primaryButtonRef = useRef(null); // Ref for pulse animation

  // --- Configuration ---
  const primaryCTAText = "Generate Your Business Path";
  const secondaryCTAText = "Watch a Quick Demo"; // Or "Learn More", "Explore Features"
  const showSecondaryCTA = true; // Control if secondary button appears
  const valueReminderText = "Get your AI-generated business plan and integrated tools instantly."; // Optional text

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // --- Initial States ---
      gsap.set(blockRef.current, { opacity: 0, scale: 0.9, y: 50 });
      gsap.set([headlineRef.current, textRef.current, buttonGroupRef.current], { opacity: 0, y: 30 });

      // --- Entrance Animation ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%', // Trigger as it comes into view
          // markers: true, // Debugging
          toggleActions: 'play none none none',
        }
      });

      tl.to(blockRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
      })
      .to([headlineRef.current, textRef.current, buttonGroupRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15 // Stagger reveal of internal elements
      }, "-=0.8"); // Overlap with block animation

      // --- Subtle Pulse/Glow on Primary Button ---
      if (!isReducedMotion && primaryButtonRef.current) {
        gsap.to(primaryButtonRef.current, {
          boxShadow: '0 0 15px 5px rgba(197, 174, 255, 0.3), 0 0 25px 10px rgba(197, 174, 255, 0.15)', // Example glow
          duration: 1.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: tl.duration() - 0.5 // Start slightly before timeline ends
        });
         // Enhanced hover for primary button (can be CSS too)
         primaryButtonRef.current.addEventListener('mouseenter', () => {
              gsap.to(primaryButtonRef.current, { scale: 1.05, duration: 0.2, ease: 'power1.out' });
         });
         primaryButtonRef.current.addEventListener('mouseleave', () => {
              gsap.to(primaryButtonRef.current, { scale: 1, duration: 0.2, ease: 'power1.out' });
         });
      }


    }, sectionRef); // Scope GSAP context

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section ref={sectionRef} className={styles.ctaSection}>
      <div ref={blockRef} className={styles.ctaBlock}>
          <h2 ref={headlineRef} className={styles.ctaHeadline}>
              Ready to Build Your Future?
          </h2>

          {valueReminderText && (
              <p ref={textRef} className={styles.ctaText}>
                  {valueReminderText}
              </p>
          )}

          <div ref={buttonGroupRef} className={styles.buttonGroup}>
              {/* --- Primary CTA --- */}
              <a 
                href="/register" // Replace with actual link
                ref={primaryButtonRef} 
                className={`${styles.ctaButton} ${styles.primaryButton}`}
              >
                  <span>{primaryCTAText}</span>
                  <ArrowRight size={18} /> 
              </a>

               {/* --- Secondary CTA (Conditional) --- */}
              {showSecondaryCTA && (
                  <a 
                    href="/demo" // Replace with actual link
                    className={`${styles.ctaButton} ${styles.secondaryButton}`}
                  >
                      <PlayCircle size={18} />
                      <span>{secondaryCTAText}</span>
                  </a>
              )}
          </div>
      </div>
        {/* Optional Background Glows / Elements for the section */}
        {/* <div className={styles.glowContainer}> ... </div> */}
    </section>
  );
};

export default SecondaryCTA;