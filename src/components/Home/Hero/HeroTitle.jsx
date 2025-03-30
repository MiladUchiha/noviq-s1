import gsap from 'gsap-trial';
import { CustomEase } from 'gsap-trial/CustomEase';
import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

const HeroTitle = ({ onAnimationComplete }) => {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const titleLineRef = useRef(null)
  const subtitleRef = useRef(null)
  
  useEffect(() => {
    gsap.registerPlugin(CustomEase)
    
    const ctx = gsap.context(() => {
      // Custom ease for refined animations
      CustomEase.create("refinedEase", "M0,0 C0.25,0.1 0.25,1 1,1")
      
      // Initial states
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.98
      })
      
      gsap.set(titleLineRef.current, {
        opacity: 0,
        scaleX: 0
      })
      
      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 20
      })

      // Main animation timeline
      const tl = gsap.timeline({
        onComplete: () => onAnimationComplete?.()
      })

      // Refined animation sequence
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: "refinedEase"
      })
      .to(titleLineRef.current, {
        opacity: 1,
        scaleX: 1,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8")
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.9")

      // Subtle hover interactions
      if (titleRef.current) {
        titleRef.current.addEventListener('mouseenter', () => {
          gsap.to(titleLineRef.current, {
            scaleX: 1.5,
            opacity: 0.3,
            duration: 0.4,
            ease: "power2.out"
          })
        })

        titleRef.current.addEventListener('mouseleave', () => {
          gsap.to(titleLineRef.current, {
            scaleX: 1,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [onAnimationComplete])

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <h1 ref={titleRef} className={styles.title}>
          Transform Your Vision Into Reality
        </h1>
        <div ref={titleLineRef} className={styles.titleLine} />
      </div>
      
      <p ref={subtitleRef} className={styles.subtitle}>
        Share your business idea and let our advanced AI transform it into 
        a comprehensive strategy for success. Where innovation meets execution.
      </p>
    </div>
  )
}

export default HeroTitle