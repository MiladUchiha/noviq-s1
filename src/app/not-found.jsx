'use client' // Essential for using hooks and client-side libraries like GSAP

import gsap from 'gsap-trial';
import { CustomEase } from 'gsap-trial/CustomEase';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import { Home } from 'lucide-react'; // Using a Home icon instead of Sparkles
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from '../components/Home/Hero/Hero.module.css'; // Reuse the same CSS module

// Assuming your home route is '/' or '/en' if using locales
const HOME_ROUTE = '/en' // Adjust this to your actual home route

const NotFound = () => {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null) // Ref for the button animation

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase)
    let ctx = gsap.context(() => {})

    const initAnimations = () => {
      ctx = gsap.context(() => {
        // Custom ease from HeroTitle
        CustomEase.create("refinedEase", "M0,0 C0.25,0.1 0.25,1 1,1")

        // --- Initial States ---
        gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
            opacity: 0,
            y: 30
        })
        gsap.set(titleRef.current, { scale: 0.98 })

        // --- Main Timeline ---
        const tl = gsap.timeline({
          defaults: {
            duration: 1,
            ease: "power3.out"
          }
        })

        // Background lines (same as EnhancedHero)
        tl.to(".backgroundLines", {
          opacity: 0.7,
          duration: 2,
          ease: "power2.inOut"
        })

        // Title animation (similar to HeroTitle)
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: "refinedEase"
        }, "-=1.5") // Start slightly after background

        // Subtitle animation (similar to HeroTitle)
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out"
        }, "-=0.9")

         // Button animation
        .to(buttonRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out"
        }, "-=0.8")

        // Floating elements entrance (same as EnhancedHero)
        .from(".floatingElement", {
          scale: 0,
          opacity: 0,
          stagger: {
            each: 0.2,
            from: "random"
          },
          duration: 1.5,
          ease: "power2.out"
        }, "-=1.2") // Overlap slightly with text animation

        // Floating animation for gradient elements (same as EnhancedHero)
        gsap.utils.toArray(".floatingElement").forEach((element, i) => {
          gsap.to(element, {
            y: "random(-40, 40)",
            x: "random(-40, 40)",
            duration: "random(4, 6)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2 // Stagger the start
          })
        })

        // Parallax effect on mouse move (same as EnhancedHero)
        const handleMouseMove = (e) => {
          const { clientX, clientY } = e
          const { innerWidth, innerHeight } = window

          const x = (clientX - innerWidth / 2) / innerWidth
          const y = (clientY - innerHeight / 2) / innerHeight

          gsap.to(".floatingElements", {
            x: x * 50,
            y: y * 50,
            duration: 1,
            ease: "power2.out"
          })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
      }, containerRef)
    }

    initAnimations()

    // Cleanup GSAP animations and listeners on unmount
    return () => {
      ctx.revert()
    }
  }, []) // Empty dependency array ensures this runs only once on mount

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Reusing background lines */}
      <div className={`${styles.backgroundLines} backgroundLines opacity-0`} />

      <section className={styles.hero}>
        <div className={`${styles.heroContent} heroContent`}>
          {/* Left Section: Adapted for 404 */}
          <div className={styles.heroLeft}>
            <div className="relative"> {/* Container for title + line */}
                <h1 ref={titleRef} className={styles.title}>
                 404 - Page Not Found
                </h1>
                 {/* Optional: Add a subtle line like in HeroTitle if desired */}
                 {/* <div ref={titleLineRef} className={styles.titleLine} /> */}
            </div>
            <p ref={subtitleRef} className={styles.subtitle}>
              Oops! It seems the page you were looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>

            {/* Button Group: Simplified to one button */}
            <div ref={buttonRef} className={styles.buttonGroup} style={{ justifyContent: 'center' }}> {/* Center the button */}
               <Link
                 href={HOME_ROUTE}
                 className={`${styles.submitButton} ${styles.generateButton}`} // Combine styles for appearance, adjust if needed
                 style={{ flex: '0 1 auto', width: 'auto', minWidth: '200px' }} // Adjust flex properties for single button
               >
                 <Home size={18} />
                 <span>Go to Homepage</span>
                 {/* Optional: Include button glow effect */}
                 {/* <span className={styles.buttonGlow} /> */}
               </Link>
            </div>
          </div>

          {/* Right Section: Reusing floating elements */}
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
  )
}

export default NotFound