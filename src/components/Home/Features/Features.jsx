'use client'
import gsap from 'gsap-trial'
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger'
import {
    Bot,
    FileText, Globe,
    Package, Presentation,
    Route,
    TrendingUp
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import styles from './FeatureSection.module.css'; // New CSS Module Name

// --- Register GSAP Plugins ---
gsap.registerPlugin(ScrollTrigger); // Register globally or here

const FeaturesBenefitsAlt = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const introRef = useRef(null);
  const rowRefs = useRef([]); // Refs for feature rows

  // Same data, just presented differently
  const featuresData = [
     {
      icon: <Route size={40} />, // Slightly larger icons
      feature: 'AI Business Path Generation',
      benefit: 'Provides clarity, direction, and a validated roadmap, reducing guesswork and saving weeks of research.',
    },
    {
      icon: <Presentation size={40} />,
      feature: 'PPT Generator',
      benefit: 'Quickly create professional, data-informed pitch decks and presentations tailored to investors or stakeholders.',
    },
     {
      icon: <FileText size={40} />,
      feature: 'PDF Generator',
      benefit: 'Easily generate comprehensive business plans, market reports, and proposals based on your AI-generated strategy.',
    },
     {
      icon: <Globe size={40} />,
      feature: 'Website Builder',
      benefit: 'Launch a professional landing page or simple website quickly to establish your online presence – no coding required.',
    },
     {
      icon: <Bot size={40} />, 
      feature: 'AI Marketing Agent',
      benefit: 'Get AI-driven marketing strategies, target audience insights, and content ideas to effectively reach customers.',
    },
     {
      icon: <TrendingUp size={40} />,
      feature: 'Scalability Focus',
      benefit: 'Utilize tools, analytics, and ongoing AI guidance designed not just to launch, but to adapt and grow your business.',
    },
  ];

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // --- Initial States ---
      gsap.set([titleRef.current, introRef.current], { opacity: 0, y: 50 });
      // Set initial state for rows based on reduced motion
      if (!isReducedMotion) {
          rowRefs.current.forEach((row, index) => {
             if (!row) return;
              // Start rows off-screen left/right
             gsap.set(row, { opacity: 0, x: index % 2 === 0 ? -100 : 100 }); 
             // Also hide content inside
              gsap.set(row.querySelectorAll(`.${styles.visualContainer}, .${styles.textContainer}`), { opacity: 0 });
          });
      } else {
          // If reduced motion, just set to visible
           gsap.set(rowRefs.current, { opacity: 1, x: 0 });
      }


      // --- Entrance Animation for Title and Intro ---
      gsap.to([titleRef.current, introRef.current], {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%', // Trigger title/intro early
              toggleActions: 'play none none none',
          }
      });

      // --- Entrance Animation for Each Row ---
       if (!isReducedMotion) {
            rowRefs.current.forEach((row, index) => {
                if (!row) return;
                const visual = row.querySelector(`.${styles.visualContainer}`);
                const text = row.querySelector(`.${styles.textContainer}`);

                const rowTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 85%', // Trigger row animation as it comes into view
                         // markers: true, // Debugging
                        toggleActions: 'play none none none',
                    }
                });

                rowTl.to(row, { // Animate row sliding in
                    opacity: 1,
                    x: 0,
                    duration: 1.2,
                    ease: 'power3.out'
                })
                .to([visual, text], { // Fade in content slightly after row slides
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.inOut',
                    stagger: 0.1 // Slightly stagger visual and text fade-in
                }, "-=0.7"); // Overlap animation
            });
       }


        // --- Subtle Hover Effects (Optional) ---
         if (!isReducedMotion) {
            rowRefs.current.forEach((row) => {
                if (!row) return;
                const visual = row.querySelector(`.${styles.visualContainer}`);
                row.addEventListener('mouseenter', () => {
                    if(visual) gsap.to(visual, { scale: 1.03, duration: 0.3, ease: 'power1.out' });
                    // Maybe add a subtle background change to the row itself
                    // gsap.to(row, { backgroundColor: 'rgba(255, 255, 255, 0.03)', duration: 0.3 });
                });
                row.addEventListener('mouseleave', () => {
                     if(visual) gsap.to(visual, { scale: 1, duration: 0.3, ease: 'power1.out' });
                     // gsap.to(row, { backgroundColor: 'transparent', duration: 0.3 });
                });
            });
         }


    }, sectionRef); // Scope GSAP context

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
     <section ref={sectionRef} className={styles.featuresSectionAlt}>
       {/* Optional Subtle Background Glows */}
       {/* <div className={styles.glowContainer}> ... </div> */}
      
      <div className={styles.featuresContainerAlt}>
        <h2 ref={titleRef} className={styles.sectionTitleAlt}>
          Unlock Your Potential Features
        </h2>
         {/* Introductory Benefit */}
         <p ref={introRef} className={styles.introBenefitAlt}>
            <Package size={20} /> 
            <span>
                Our <strong>Integrated Tool Suite</strong> saves you time and money. Everything you need from idea analysis to launch and scaling, all in one streamlined platform – no juggling multiple expensive subscriptions.
            </span>
         </p>

        <div className={styles.featuresList}>
          {featuresData.map((featureItem, index) => (
            <div
              key={index}
              ref={el => rowRefs.current[index] = el}
              className={`${styles.featureRow} ${index % 2 !== 0 ? styles.rowReversed : ''}`} // Add class for reversed rows
            >
                {/* Visual Column */}
                <div className={styles.visualContainer}>
                   <div className={styles.visualBackground}> {/* Added background element */}
                       {featureItem.icon}
                   </div>
                </div>

                {/* Text Column */}
                <div className={styles.textContainer}>
                    <h3 className={styles.featureTitleAlt}>{featureItem.feature}</h3>
                    <p className={styles.benefitDescriptionAlt}>{featureItem.benefit}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBenefitsAlt;