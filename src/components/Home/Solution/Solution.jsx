'use client'
import gsap from 'gsap-trial'
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger'
import { AlertOctagon, Layers, MapPin, Target, Wrench, Zap } from 'lucide-react'
import { useEffect, useRef } from 'react'
import styles from './Solution.module.css'

// --- Register GSAP Plugins (do this once globally if possible) ---
// gsap.registerPlugin(ScrollTrigger);
// If not registered globally, uncomment the line above AND the one in useEffect

const ProblemSolutionSection = () => {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const problemColRef = useRef(null)
  const solutionColRef = useRef(null)
  const transitionLineRef = useRef(null)
  // Refs for subtle background glows
  const glowsRef = useRef([]) 

  const problems = [
    { icon: <AlertOctagon size={20} />, text: 'Feeling overwhelmed by the sheer complexity of starting?' },
    { icon: <MapPin size={20} />, text: 'Unsure where to begin or which steps to take first?' },
    { icon: <Layers size={20} />, text: 'Juggling expensive, disconnected tools that slow you down?' },
  ]

  const solutions = [
    { icon: <Zap size={20} />, text: 'AI analyzes your unique idea, cutting through the noise.' },
    { icon: <Target size={20} />, text: 'Get a clear, step-by-step strategic roadmap generated for you.' },
    { icon: <Wrench size={20} />, text: 'Access integrated tools designed to work together seamlessly.' },
  ]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger) // Uncomment if not registered globally

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {

      // --- Subtle Background Glow Animations ---
      if (!isReducedMotion) {
        glowsRef.current.forEach((glow) => {
          gsap.set(glow, { // Random initial position/scale
             xPercent: gsap.utils.random(-30, 30),
             yPercent: gsap.utils.random(-30, 30),
             scale: gsap.utils.random(0.8, 1.2)
          });
          gsap.to(glow, { // Continuous slow movement
            xPercent: "+=" + gsap.utils.random(-40, 40),
            yPercent: "+=" + gsap.utils.random(-40, 40),
            scale: "+=" + gsap.utils.random(-0.1, 0.1),
            opacity: gsap.utils.random(0.1, 0.3), // Fade in/out slightly
            duration: gsap.utils.random(10, 18),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        });
      } else {
         // Set low opacity state for reduced motion if desired
         gsap.set(glowsRef.current, { opacity: 0.1 });
      }


      // --- Entrance Animations ---
      gsap.set(titleRef.current, { opacity: 0, y: 40 })
      gsap.set(transitionLineRef.current, { scaleX: 0, opacity: 0 })

      mm.add("(min-width: 769px)", () => {
        // Initial states
        gsap.set(problemColRef.current, { opacity: 0, x: -50 })
        gsap.set(solutionColRef.current, { opacity: 0, x: 50 })
        gsap.set(`.${styles.listItem}`, { opacity: 0, y: 20 }) 

        const tl = gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
           defaults: { duration: 1, ease: 'power3.out' } // Timeline defaults
        });

        tl.to(titleRef.current, { opacity: 1, y: 0 })
          .to([problemColRef.current, solutionColRef.current], { opacity: 1, x: 0, stagger: 0.2, duration: 1.2 }, "-=0.7")
          .to(transitionLineRef.current, { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.inOut' }, "-=0.8")
          .to(`.${styles.listItem}`, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.15 }, "-=0.5");
      });

      mm.add("(max-width: 768px)", () => {
         // Initial states
        gsap.set([problemColRef.current, solutionColRef.current], { opacity: 0, y: 50 })
        gsap.set(`.${styles.listItem}`, { opacity: 0, y: 20 })

         const tl = gsap.timeline({
           scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
           defaults: { duration: 1, ease: 'power3.out' }
         });

         tl.to(titleRef.current, { opacity: 1, y: 0 })
          .to(problemColRef.current, { opacity: 1, y: 0 }, "-=0.7")
          .to(`.${styles.problemItem}`, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, "-=0.5")
          .to(transitionLineRef.current, { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.inOut' }, "-=0.3")
          .to(solutionColRef.current, { opacity: 1, y: 0 }, "-=0.5")
          .to(`.${styles.solutionItem}`, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, "-=0.5");
      });

      // --- Hover Effects ---
      if (!isReducedMotion) {
        // Column Hover
        [problemColRef.current, solutionColRef.current].forEach(col => {
          if (!col) return;
          col.addEventListener('mouseenter', () => {
            gsap.to(col, {
              y: -6, // Slightly more lift
              borderColor: 'rgba(255, 255, 255, 0.2)', // Brighter border
              duration: 0.3,
              ease: 'power2.out'
            });
          });
          col.addEventListener('mouseleave', () => {
            gsap.to(col, {
              y: 0,
              borderColor: 'rgba(255, 255, 255, 0.08)', // Back to original
              duration: 0.3,
              ease: 'power2.out'
            });
          });
        });

        // List Item Hover
        gsap.utils.toArray(`.${styles.listItem}`).forEach(item => {
          const icon = item.querySelector(`.${styles.listIcon}`);
          item.addEventListener('mouseenter', () => {
            gsap.to(item, { x: 4, duration: 0.3, ease: 'power2.out' });
            if (icon) {
              gsap.to(icon, { scale: 1.1, rotate: -8, duration: 0.3, ease: 'back.out(2)' }); // Add rotation + back ease
            }
          });
          item.addEventListener('mouseleave', () => {
            gsap.to(item, { x: 0, duration: 0.3, ease: 'power2.out' });
             if (icon) {
              gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3, ease: 'back.out(2)' });
            }
          });
        });
      }


    }, sectionRef); // Scope GSAP context

    return () => {
      ctx.revert();
      mm.revert();
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.psSection}>
       {/* Subtle Background Glows */}
        <div className={styles.glowContainer}>
            {Array.from({ length: 3 }).map((_, i) => ( // Add 3 glows
                <div
                    key={i}
                    ref={el => glowsRef.current[i] = el}
                    className={`${styles.subtleGlow} ${styles[`subtleGlow${i + 1}`]}`} 
                />
            ))}
        </div>
      
      <div className={styles.psContainer}>
        <h2 ref={titleRef} className={styles.sectionTitle}>
          From Idea Chaos to Clear Strategy
        </h2>

        <div className={styles.psGrid}>
          {/* Problem Column */}
          <div ref={problemColRef} className={`${styles.psColumn} ${styles.problemColumn}`}>
             {/* Content... */}
             <h3 className={styles.columnTitle}>Sound Familiar?</h3>
            <ul className={styles.problemList}>
              {problems.map((item, index) => (
                <li key={`prob-${index}`} className={`${styles.listItem} ${styles.problemItem}`}>
                  <span className={styles.listIcon}>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Transition Element */}
          <div className={styles.transitionWrapper}>
              <div ref={transitionLineRef} className={styles.transitionLine}></div>
          </div>

          {/* Solution Column */}
          <div ref={solutionColRef} className={`${styles.psColumn} ${styles.solutionColumn}`}>
             {/* Content... */}
              <h3 className={styles.columnTitle}>Your Streamlined Path</h3>
            <ul className={styles.solutionList}>
              {solutions.map((item, index) => (
                <li key={`sol-${index}`} className={`${styles.listItem} ${styles.solutionItem}`}>
                  <span className={styles.listIcon}>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <p className={styles.solutionBenefit}>
              Our AI platform provides the analysis, planning, and integrated tools needed, saving you time, money, and uncertainty.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProblemSolutionSection;