'use client' // Essential for using hooks and client-side libraries like GSAP

import gsap from 'gsap-trial';
import { CustomEase } from 'gsap-trial/CustomEase';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import { Lock, LogIn, Mail, User } from 'lucide-react'; // Icons for fields and login link
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import styles from '../../../components/Home/Hero/Hero.module.css'; // Reuse the same CSS module

// --- Placeholder for Google Icon ---
// You might use an SVG, an image, or a library like 'react-icons'
const GoogleIcon = () => (
    <svg viewBox="0 0 48 48" width="24px" height="24px">
        <path fill="#EA4335" d="M24 9.5c3.2 0 5.8 1.2 7.6 3l5.7-5.7C33.8 3.7 29.3 2 24 2 15.4 2 8.2 6.6 5 13.2l6.4 4.9C12.9 13.4 18 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.2 25.1c0-1.6-.1-3.1-.4-4.6H24v8.8h12.4c-.5 2.8-2.1 5.2-4.5 6.8l6.2 4.8c3.6-3.3 5.7-8 5.7-13.8z"></path>
        <path fill="#34A853" d="M11.4 31.3c-.4-.8-.6-1.7-.6-2.7s.2-1.9.6-2.7L5 21.1C3.4 24.2 2.5 27.9 2.5 32s.9 7.8 2.5 10.9l6.4-4.9c-.4-.8-.6-1.7-.6-2.7z"></path>
        <path fill="#FBBC05" d="M24 44c5.3 0 9.8-1.8 13.1-4.8l-6.2-4.8c-1.8 1.2-4.1 1.9-6.9 1.9-5.1 0-9.5-3.4-11.1-8.1l-6.4 4.9C8.2 39.4 15.4 44 24 44z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);
// --- --- ---

const LOGIN_ROUTE = '/login' // Updated login route

// Create a wrapper component to use searchParams
const RegisterPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const containerRef = useRef(null)
    const formRef = useRef(null)
    const titleRef = useRef(null)
    const googleButtonRef = useRef(null)
    const loginLinkRef = useRef(null)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('') // For displaying form errors
    const [pendingIdea, setPendingIdea] = useState(null);

    // Check for pending idea in localStorage on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedIdea = localStorage.getItem('pending_idea');
            if (storedIdea) {
                console.log('Found pending idea in localStorage:', storedIdea.substring(0, 30) + '...');
                setPendingIdea(storedIdea);
            }
        }
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, CustomEase)
        let ctx = gsap.context(() => {})

        const initAnimations = () => {
            ctx = gsap.context(() => {
                CustomEase.create("refinedEase", "M0,0 C0.25,0.1 0.25,1 1,1")

                // --- Initial States ---
                gsap.set(titleRef.current, { opacity: 0, y: 30, scale: 0.98 })
                gsap.set(formRef.current, { opacity: 0, y: 30 })
                gsap.set(googleButtonRef.current, { opacity: 0, y: 20 })
                gsap.set(loginLinkRef.current, { opacity: 0, y: 20 })

                // --- Main Timeline ---
                const tl = gsap.timeline({
                    defaults: {
                        duration: 1,
                        ease: "power3.out"
                    }
                })

                // Background lines
                tl.to(".backgroundLines", {
                    opacity: 0.7,
                    duration: 2,
                    ease: "power2.inOut"
                })

                // Title animation
                .to(titleRef.current, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.4,
                    ease: "refinedEase"
                }, "-=1.5")

                // Form animation (fade in as a block)
                .to(formRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2
                }, "-=1.0") // Start slightly after title

                 // Google Button and Login Link
                .to([googleButtonRef.current, loginLinkRef.current], {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    stagger: 0.2,
                }, "-=0.7") // Animate these after form appears

                // Floating elements entrance
                .from(".floatingElement", {
                    scale: 0,
                    opacity: 0,
                    stagger: {
                        each: 0.2,
                        from: "random"
                    },
                    duration: 1.5,
                    ease: "power2.out"
                }, "-=1.2")

                // Floating animation & Parallax (same as before)
                gsap.utils.toArray(".floatingElement").forEach((element, i) => {
                    gsap.to(element, { y: "random(-40, 40)", x: "random(-40, 40)", duration: "random(4, 6)", repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.2 })
                })
                const handleMouseMove = (e) => {
                    const { clientX, clientY } = e; const { innerWidth, innerHeight } = window; const x = (clientX - innerWidth / 2) / innerWidth; const y = (clientY - innerHeight / 2) / innerHeight
                    gsap.to(".floatingElements", { x: x * 50, y: y * 50, duration: 1, ease: "power2.out" })
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !email || !password) {
            setError('Please fill in all fields.')
            return
        }
        
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
        }
        
        setError('') // Clear previous errors
        setIsLoading(true)

        const button = e.currentTarget.querySelector('button[type="submit"]') // Target the submit button specifically

        // Optional: Add button press animation
        if (button) {
            gsap.timeline()
                .to(button, { scale: 0.97, duration: 0.1 })
                .to(button, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" });
        }

        try {
            // Call the API endpoint instead of the direct function
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    idea: pendingIdea // Include pending idea if available
                }),
            });
            
            const result = await response.json();
            
            if (!result.success) {
                // Display specific error message from the API
                const errorMessage = result.error || 'Registration failed. Please try again.';
                console.error('Registration error:', errorMessage);
                setError(errorMessage);
                return;
            }
            
            // Sign in the newly registered user
            const signInResult = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            
            if (signInResult?.error) {
                const signInError = signInResult.error || 'Error signing in after registration';
                console.error('Sign-in error:', signInError);
                setError(signInError);
                return;
            }
            
            // Redirect to idea page if idea was provided, otherwise to dashboard
            if (pendingIdea) {
                // Clear localStorage before redirecting
                localStorage.removeItem('pending_idea');
                localStorage.removeItem('redirect_to_idea');
                
                router.push(`/idea?id=${result.data.id}`);
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            console.error('Registration failed:', err)
            setError(err.message || 'Registration failed. Please try again.') 
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignUp = async () => {
        setIsLoading(true); 
        setError('');

        // Optional: Add button press animation
        if (googleButtonRef.current) {
            gsap.timeline()
                .to(googleButtonRef.current, { scale: 0.97, duration: 0.1 })
                .to(googleButtonRef.current, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" });
        }

        try {
            // Store additional flags in localStorage to ensure the idea is properly handled
            if (pendingIdea) {
                console.log('Redirecting to Google auth with pending idea');
                localStorage.setItem('pending_idea', pendingIdea);
                localStorage.setItem('redirect_to_idea', 'true');
                localStorage.setItem('auth_method', 'google');
                
                // Using a different query parameter that's more specific
                await signIn('google', { 
                    callbackUrl: '/oauth-callback?redirect_idea=true'
                });
            } else {
                // No idea in localStorage
                localStorage.removeItem('pending_idea');
                localStorage.removeItem('redirect_to_idea');
                localStorage.removeItem('auth_method');
                await signIn('google', { callbackUrl: '/dashboard' });
            }
        } catch (err) {
            console.error('Google Sign Up failed:', err);
            setError('Google Sign Up failed. Please try again.');
            setIsLoading(false);
        }
    }

    return (
        <div ref={containerRef} className={styles.container}>
            {/* Reusing background lines */}
            <div className={`${styles.backgroundLines} backgroundLines opacity-0`} />

            <section className={styles.hero}>
                {/* Keep heroContent for consistent padding/styling */}
                <div className={`${styles.heroContent} heroContent`}>
                    {/* Left Section: Registration Form */}
                    <div className={styles.heroLeft}>
                        <h1 ref={titleRef} className={`${styles.title} ${styles.centeredTitle}`}> {/* Add centeredTitle class if needed */}
                            Create Your Account
                        </h1>

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} ref={formRef} className={styles.registerForm}> {/* Use a specific class or reuse ideaForm */}
                            {error && (
                                <div className={styles.errorMessage}>
                                    <div className={styles.errorIcon}>⚠️</div>
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Input Group for Name */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="name-input" className={styles.inputLabel}>
                                    <User size={16} /> Name
                                </label>
                                <input
                                    id="name-input"
                                    type="text"
                                    className={styles.inputField} // Use a new class or adapt ideaTextarea styles
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Input Group for Email */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="email-input" className={styles.inputLabel}>
                                    <Mail size={16} /> Email Address
                                </label>
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

                            {/* Input Group for Password */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="password-input" className={styles.inputLabel}>
                                    <Lock size={16} /> Password
                                </label>
                                <input
                                    id="password-input"
                                    type="password"
                                    className={styles.inputField}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Choose a strong password"
                                    required
                                    minLength={8} // Basic validation example
                                    disabled={isLoading}
                                />
                                {/* Consider adding a show/hide password toggle here */}
                            </div>

                             {/* Submit Button */}
                             <button
                                type="submit"
                                className={styles.submitButton} // Reuse existing button style
                                disabled={isLoading}
                                style={{ width: '100%', marginTop: '1rem' }} // Ensure full width
                            >
                                <span className={styles.buttonText}>
                                    {isLoading ? 'Creating Account...' : 'Register'}
                                </span>
                                <span className={styles.buttonGlow} />
                            </button>
                        </form>

                         {/* OR Separator */}
                         <div className={styles.orSeparator}>OR</div>


                        {/* Google Sign Up Button */}
                        <button
                            ref={googleButtonRef}
                            onClick={handleGoogleSignUp}
                            className={styles.googleButton} // Needs specific styling
                            disabled={isLoading}
                        >
                            <GoogleIcon />
                            <span>Sign Up with Google</span>
                        </button>

                        {/* Link to Login */}
                        <p ref={loginLinkRef} className={styles.authLink}>
                            Already have an account?{' '}
                            <Link href={LOGIN_ROUTE}>
                                <LogIn size={14} /> Log In
                            </Link>
                        </p>
                    </div>

                    {/* Right Section: Reusing floating elements */}
                    <div className={styles.heroRight} aria-hidden="true"> {/* Hide decorative elements from screen readers */}
                        <div className={`${styles.floatingElements} floatingElements`}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`${styles.floatingElement} floatingElement`}
                                    style={{ '--element-delay': `${i * 0.2}s` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

// Main component wrapped in Suspense boundary
const RegisterPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterPageContent />
        </Suspense>
    )
}

export default RegisterPage