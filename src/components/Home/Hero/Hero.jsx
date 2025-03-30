'use client'
import gsap from 'gsap-trial'
import { CustomEase } from 'gsap-trial/CustomEase'
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import styles from './Hero.module.css'
import HeroTitle from './HeroTitle'

const EnhancedHero = () => {
  const router = useRouter()
  const [idea, setIdea] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPlaceholder, setCurrentPlaceholder] = useState('')
  const typingSpeed = 50
  const deletingSpeed = 30
  const pauseDuration = 1500
  const containerRef = useRef(null)
  const formRef = useRef(null)
  
  const placeholders = [
    "Create an AI-powered personal fitness coach app...",
    "Build a sustainable fashion marketplace platform...",
    "Develop a smart home energy management system...",
    "Launch a peer-to-peer skill-sharing platform...",
    "Design an augmented reality interior design app..."
  ]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase)
    let ctx = gsap.context(() => {})
    
    const initAnimations = () => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { 
            duration: 1,
            ease: "power3.out"
          }
        })

        // Background elements
        tl.to(".backgroundLines", {
          opacity: 0.7,
          duration: 2,
          ease: "power2.inOut"
        })

        // Form and floating elements
        .from(formRef.current, {
          opacity: 0,
          y: 30,
          duration: 1.2
        }, "-=0.7")
        .from(".floatingElement", {
          scale: 0,
          opacity: 0,
          stagger: {
            each: 0.2,
            from: "random"
          },
          duration: 1.5,
          ease: "power2.out"
        }, "-=1")

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
          })
        })

        // Parallax effect on mouse move
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

    return () => {
      ctx.revert()
    }
  }, [])

  useEffect(() => {
    let timeout

    const animatePlaceholder = () => {
      const current = placeholders[placeholderIndex]
      
      if (isDeleting) {
        setCurrentPlaceholder(prev => prev.slice(0, -1))
        if (currentPlaceholder.length === 0) {
          setIsDeleting(false)
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
        }
        timeout = setTimeout(animatePlaceholder, deletingSpeed)
      } else {
        if (currentPlaceholder.length === current.length) {
          timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
        } else {
          setCurrentPlaceholder(current.slice(0, currentPlaceholder.length + 1))
          timeout = setTimeout(animatePlaceholder, typingSpeed)
        }
      }
    }

    timeout = setTimeout(animatePlaceholder, typingSpeed)
    return () => clearTimeout(timeout)
  }, [currentPlaceholder, isDeleting, placeholderIndex])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const button = e.currentTarget.querySelector('button[type="submit"]')
    if (!button) return
    
    try {
      await gsap.timeline()
        .to(button, {
          scale: 0.97,
          duration: 0.1,
        })
        .to(button, {
          scale: 1,
          duration: 0.3,
          ease: "elastic.out(1, 0.3)"
        })
        .to(".floatingElement", {
          scale: 1.1,
          duration: 0.4,
          stagger: {
            each: 0.1,
            from: "random"
          },
          ease: "power2.out"
        }, 0)
        .to(".floatingElement", {
          scale: 1,
          duration: 0.6,
          stagger: {
            each: 0.1,
            from: "random"
          },
          ease: "elastic.out(1, 0.3)"
        })
      
      // Store idea in localStorage instead of URL parameter
      localStorage.setItem('pending_idea', idea);
      localStorage.setItem('redirect_to_idea', 'true');
      console.log('Stored idea in localStorage:', idea);
      
      // Redirect to register page without idea parameter
      router.push('/register');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={`${styles.backgroundLines} backgroundLines opacity-0`} />
      
      <section className={styles.hero}>
        <div className={`${styles.heroContent} heroContent`}>
          <div className={styles.heroLeft}>
            <HeroTitle />

            <form onSubmit={handleSubmit} ref={formRef} className={styles.ideaForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="idea-input" className={styles.ideaLabel}>
                  <span className={styles.labelText}>YOUR VISION STARTS HERE</span>
                  <span className={styles.labelLine} />
                </label>
                <textarea
                  id="idea-input"
                  className={styles.ideaTextarea}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={currentPlaceholder + (isDeleting ? '' : '|')}
                  rows={4}
                />
              </div>
              <div className={styles.buttonGroup}>
                <Link 
                  href="/idea-generator"
                  className={styles.generateButton}
                >
                  <Sparkles size={18} />
                  <span>Idea Generator</span>
                </Link>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isLoading || !idea.trim()}
                >
                  <span className={styles.buttonText}>
                    {isLoading ? 'Processing...' : 'Begin Transformation'}
                  </span>
                  <span className={styles.buttonGlow} />
                </button>
              </div>
            </form>
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
  )
}

export default EnhancedHero