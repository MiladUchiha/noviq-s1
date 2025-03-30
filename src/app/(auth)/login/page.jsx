'use client'

import gsap from 'gsap-trial'
import { CustomEase } from 'gsap-trial/CustomEase'
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger'
import { HelpCircle, Lock, Mail, UserPlus } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import styles from '../../../components/Home/Hero/Hero.module.css'; // Assuming styles are in Hero.module.css

// --- Placeholder for Google Icon ---
const GoogleIcon = () => (
    <svg viewBox="0 0 48 48" width="20px" height="20px"> {/* Slightly smaller icon */}
        <path fill="#EA4335" d="M24 9.5c3.2 0 5.8 1.2 7.6 3l5.7-5.7C33.8 3.7 29.3 2 24 2 15.4 2 8.2 6.6 5 13.2l6.4 4.9C12.9 13.4 18 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.2 25.1c0-1.6-.1-3.1-.4-4.6H24v8.8h12.4c-.5 2.8-2.1 5.2-4.5 6.8l6.2 4.8c3.6-3.3 5.7-8 5.7-13.8z"></path>
        <path fill="#34A853" d="M11.4 31.3c-.4-.8-.6-1.7-.6-2.7s.2-1.9.6-2.7L5 21.1C3.4 24.2 2.5 27.9 2.5 32s.9 7.8 2.5 10.9l6.4-4.9c-.4-.8-.6-1.7-.6-2.7z"></path>
        <path fill="#FBBC05" d="M24 44c5.3 0 9.8-1.8 13.1-4.8l-6.2-4.8c-1.8 1.2-4.1 1.9-6.9 1.9-5.1 0-9.5-3.4-11.1-8.1l-6.4 4.9C8.2 39.4 15.4 44 24 44z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);
// --- --- ---

const REGISTER_ROUTE = '/register'
const FORGOT_PASSWORD_ROUTE = '/forgot-password'

const LoginPage = () => {
    const router = useRouter()
    const containerRef = useRef(null)
    const cardRef = useRef(null) // Ref for the entire card animation
    // Refs for individual elements inside the card if needed for staggering
    const titleRef = useRef(null)
    const formRef = useRef(null) // Keep ref for form if submitting via ref

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        // GSAP setup
        gsap.registerPlugin(ScrollTrigger, CustomEase)
        let ctx = gsap.context(() => {})

        const initAnimations = () => {
             ctx = gsap.context(() => {
                CustomEase.create("refinedEase", "M0,0 C0.25,0.1 0.25,1 1,1")

                // Initial States
                gsap.set(cardRef.current, { opacity: 0, y: 50, scale: 0.95 }) // Animate the card itself
                // Optionally set initial states for elements inside the card if you want to stagger them after the card appears
                // gsap.set([titleRef.current, formRef.current, '.auth-link-group'], { opacity: 0, y: 20 });

                // Main Timeline
                const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" }})

                // Background lines
                tl.to(".backgroundLines", { opacity: 0.7, duration: 2, ease: "power2.inOut" })
                // Card Entrance Animation
                .to(cardRef.current, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "refinedEase"
                }, "-=1.5") // Start card animation slightly after background
                // Optionally animate elements inside the card appearing
                // .to([titleRef.current, formRef.current, '.auth-link-group'], { opacity: 1, y: 0, stagger: 0.2 }, "-=0.8");

                // Floating elements (can start earlier)
                .from(".floatingElement", { scale: 0, opacity: 0, stagger: { each: 0.2, from: "random" }, duration: 1.5, ease: "power2.out" }, 0.3) // Start floating elements early

                // Floating animation & Parallax (same as before)
                gsap.utils.toArray(".floatingElement").forEach((element, i) => {
                    gsap.to(element, { y: "random(-30, 30)", x: "random(-30, 30)", duration: "random(5, 7)", repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.25 })
                })
                const handleMouseMove = (e) => {
                    // Keep parallax subtle
                    const { clientX, clientY } = e; const { innerWidth, innerHeight } = window; const x = (clientX - innerWidth / 2) / innerWidth; const y = (clientY - innerHeight / 2) / innerHeight
                    gsap.to(".floatingElements", { x: x * 30, y: y * 30, duration: 1.5, ease: "power3.out" })
                }
                window.addEventListener('mousemove', handleMouseMove)
                return () => window.removeEventListener('mousemove', handleMouseMove)

            }, containerRef)
        }
        initAnimations()
        return () => { ctx.revert() }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Basic validation
        if (!email) { setError('Please enter your email address.'); return; }
        if (!password) { setError('Please enter your password.'); return; }
        setError('')
        setIsLoading(true)

        const button = e.currentTarget.querySelector('button[type="submit"]')
        // Button press animation
        if (button) {
            gsap.timeline()
                .to(button, { scale: 0.98, duration: 0.1 }) // Slightly subtler press
                .to(button, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" });
        }

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            });
            
            if (result.error) {
                setError('Invalid email or password');
                return;
            }
            
            // On successful login, redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            console.error('Login failed:', err)
            setError('Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch (err) {
            console.error('Google Sign In failed:', err);
            setError('Google Sign In failed. Please try again.');
            setIsLoading(false); // Only set to false if there's an error (since successful signin redirects)
        }
    }


    return (
        <div ref={containerRef} className={styles.authPageContainer}> {/* Use a specific container */}
            {/* Background lines & Floating Elements (Positioned fixed/absolute) */}
            <div className={`${styles.backgroundLines} backgroundLines opacity-0`} />
            <div className={`${styles.floatingElementsContainer} floatingElements`} aria-hidden="true">
                 <div className={`${styles.floatingElements}`}>
                      {Array.from({ length: 6 }).map((_, i) => (
                          <div
                              key={i}
                              className={`${styles.floatingElement} floatingElement`}
                              style={{ '--element-delay': `${i * 0.2}s` }}
                          />
                      ))}
                  </div>
            </div>


            {/* Centered Auth Card */}
            <div ref={cardRef} className={styles.authCard}>
                <h1 ref={titleRef} className={styles.authTitle}>
                    Welcome Back
                </h1>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <form onSubmit={handleSubmit} ref={formRef} className={styles.authForm}>
                    {/* Input Group for Email */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email-input" className={styles.inputLabel}>Email Address</label>
                        <div className={styles.inputWrapper}>
                           <Mail size={18} className={styles.inputIcon} />
                            <input
                                id="email-input"
                                type="email"
                                className={styles.inputField}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Input Group for Password */}
                    <div className={styles.inputGroup}>
                         <label htmlFor="password-input" className={styles.inputLabel}>Password</label>
                         <div className={styles.inputWrapper}>
                            <Lock size={18} className={styles.inputIcon} />
                            <input
                                id="password-input"
                                type="password"
                                className={styles.inputField}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={isLoading}
                            />
                         </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className={styles.forgotPasswordLinkWrapper}>
                        <Link href={FORGOT_PASSWORD_ROUTE} className={styles.inlineAuthLink}>
                            <HelpCircle size={14} /> Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={styles.submitButton} // Main action button style
                        disabled={isLoading}
                    >
                        <span className={styles.buttonText}>
                            {isLoading ? 'Logging In...' : 'Login'}
                        </span>
                        {/* Subtle glow on hover might be nice */}
                         <span className={styles.buttonGlow} />
                    </button>

                     {/* OR Separator */}
                     <div className={styles.orSeparator}>OR</div>

                     {/* Google Sign In Button */}
                    <button
                        type="button" // Important: type="button" to prevent form submission
                        onClick={handleGoogleSignIn}
                        className={`${styles.submitButton} ${styles.googleButton}`} // Base style + Google specific overrides
                        disabled={isLoading}
                    >
                        <GoogleIcon />
                        <span className={styles.buttonText}>Sign In with Google</span>
                    </button>

                </form>

                 {/* Link to Register */}
                <div className={`${styles.authLink} auth-link-group`}> {/* Class for animation grouping if needed */}
                     Don't have an account?{' '}
                    <Link href={REGISTER_ROUTE}>
                        <UserPlus size={14} /> Register
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage