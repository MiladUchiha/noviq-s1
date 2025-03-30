'use client'
import gsap from 'gsap-trial';
import {
    BrainCircuit, // Connections/Strategy
    DraftingCompass, // PPT
    FileText, // Blueprint/Roadmap
    LayoutTemplate, // PDF
    Megaphone, // Market Analysis
    Network, // Website Builder
    Presentation, // Scaling/Growth
    Repeat // Iterate/Learn
    , // AI Core
    Search, // Idea
    Share, // Marketing
    TrendingUp
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import styles from './Steps.module.css'; // New CSS Module



const HowItWorksDetailed = () => {
    
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const stepRefs = useRef([]); // Refs for step cards
  const lineRefs = useRef([]); // Refs for connecting lines

  // Detailed step data tailored to the SaaS description
  const stepsData = [
    {
      number: '01',
      icon: <Share size={32} />, // Represents sharing/inputting the idea
      title: 'Define Your Vision',
      description: 'Start by telling our platform about your startup idea. Describe the concept, target market, or the core problem you aim to solve.',
      visualKey: 'input', // For potential specific visual animation
    },
    {
      number: '02',
      icon: <BrainCircuit size={32} />, // Represents the AI core
      title: 'AI Generates Your Blueprint',
      description: 'Our advanced AI performs deep analysis – market trends, competitor landscape, feasibility – crafting a unique business blueprint and strategic roadmap.',
       visualKey: 'analysis',
      subIcons: [<Search size={18} />, <Network size={18} />, <DraftingCompass size={18} />] // Sub-icons for detail
    },
    {
      number: '03',
      icon: <LayoutTemplate size={32} />, // Represents building tools, starting with website
      title: 'Build with Integrated Tools',
      description: 'Access your tailored toolkit. Generate professional presentations (PPT), create key documents (PDF), launch your website, and set up marketing campaigns seamlessly.',
       visualKey: 'tools',
       subIcons: [<Presentation size={18} />, <FileText size={18} />, <Megaphone size={18} />]
    },
     {
      number: '04',
      icon: <TrendingUp size={32} />, // Represents growth/scaling
      title: 'Launch, Learn & Scale',
      description: 'Monitor progress with built-in analytics. Gather feedback, leverage ongoing AI insights, and iterate on your strategy to effectively grow your venture.',
       visualKey: 'scale',
       subIcons: [<Repeat size={18} />]
    },
  ];

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // --- Initial States ---
      gsap.set(titleRef.current, { opacity: 0, y: 50 });
      gsap.set(stepRefs.current, { opacity: 0, y: 60 });
      gsap.set(lineRefs.current, { scaleX: 0, autoAlpha: 0 }); // Hide lines initially
      gsap.set(stepRefs.current.map(card => card?.querySelectorAll(`.${styles.stepNumber}, .${styles.stepIconContainer}, .${styles.stepTitle}, .${styles.stepDescription}, .${styles.subIconContainer}`)), { opacity: 0, y: 10 });

      // --- Main ScrollTrigger Timeline ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%', // Trigger animation earlier
          end: 'bottom 80%',
          // markers: true, // Debugging
          toggleActions: 'play none none none',
        },
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      })
      // Animate cards appearing with stagger
      .to(stepRefs.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.25, // Slightly more stagger for 4 items
      }, "-=0.7");

      // --- Animate Elements INSIDE Each Card ---
      stepRefs.current.forEach((card, index) => {
        if (!card) return;
        const number = card.querySelector(`.${styles.stepNumber}`);
        const iconContainer = card.querySelector(`.${styles.stepIconContainer}`);
        const title = card.querySelector(`.${styles.stepTitle}`);
        const desc = card.querySelector(`.${styles.stepDescription}`);
        const subIcons = card.querySelector(`.${styles.subIconContainer}`);
        const line = lineRefs.current[index];

        // Calculate start time relative to card's staggered appearance
        const cardStartTime = tl.startTime() + 0.3 + (index * 0.25); 

        // Add animations for internal elements to the main timeline
        tl.to([number, iconContainer], { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, cardStartTime)
          .to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, cardStartTime + 0.1)
          .to(desc, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, cardStartTime + 0.2)
          .to(subIcons, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, cardStartTime + 0.3);
        
        // Animate connecting line if it exists
        if (line) {
           tl.to(line, {
              scaleX: 1,
              autoAlpha: 1,
              duration: 0.7,
              ease: 'power2.inOut',
              transformOrigin: index === 0 ? 'left center' : 'left center' // Ensure scaling from correct origin (adjust if vertical)
           }, cardStartTime + 0.5); // Animate line after content appears
        }

        // Subtle loop for AI icon (Step 2)
        if (index === 1 && !isReducedMotion) {
             const aiIcon = iconContainer?.querySelector('svg');
             if (aiIcon) {
                gsap.to(aiIcon, {
                    scale: 1.1,
                    rotate: 3,
                    opacity: 0.9,
                    duration: 2,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    delay: cardStartTime + 1 // Start loop after entrance
                });
             }
        }
      });

      // --- Hover Effects ---
      if (!isReducedMotion) {
        stepRefs.current.forEach(card => {
           if (!card) return;
          const iconContainer = card.querySelector(`.${styles.stepIconContainer}`);
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -8, // More pronounced lift
              borderColor: 'rgba(255, 255, 255, 0.25)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 90px rgba(255,255,255,0.1)', 
              duration: 0.35,
              ease: 'power2.out'
            });
             if (iconContainer) {
                 gsap.to(iconContainer, { scale: 1.05, duration: 0.3, ease: 'power2.out'});
             }
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              borderColor: 'rgba(255, 255, 255, 0.1)', // Adjusted base border
              boxShadow: '0 18px 36px rgba(0, 0, 0, 0.2), 0 0 60px rgba(255,255,255,0.06)', // Adjusted base shadow
              duration: 0.35,
              ease: 'power2.out'
            });
             if (iconContainer) {
                 gsap.to(iconContainer, { scale: 1, duration: 0.3, ease: 'power2.out'});
             }
          });
        });
      }

    }, sectionRef); // Scope GSAP context

    return () => ctx.revert(); // Cleanup
  }, [])

  return (
    <section ref={sectionRef} className={styles.howItWorksSection}>
        {/* Optional Background Glows */}
        {/* <div className={styles.glowContainer}> ... </div> */}
      
      <div className={styles.howItWorksContainer}>
        <h2 ref={titleRef} className={styles.sectionTitle}>
          Transform Your Idea into Reality
        </h2>

        <div ref={gridRef} className={styles.stepsGrid}>
          {stepsData.map((step, index) => (
            <div
              key={index}
              ref={el => stepRefs.current[index] = el}
              className={styles.stepCard}
            >
                <div className={styles.stepCardContent}>
                    <div className={styles.stepHeader}>
                        <span className={styles.stepNumber}>{step.number}</span>
                        <div className={styles.stepIconContainer}>
                            {step.icon}
                        </div>
                    </div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                     {/* Render Sub Icons if they exist */}
                    {step.subIcons && step.subIcons.length > 0 && (
                        <div className={styles.subIconContainer}>
                            {step.subIcons.map((sIcon, sIndex) => <span key={sIndex}>{sIcon}</span>)}
                        </div>
                    )}
                </div>
                
                 {/* Connecting Line - Positioned absolutely relative to the grid cell */}
                {index < stepsData.length - 1 && (
                    <div
                        ref={el => lineRefs.current[index] = el}
                        className={`${styles.connectingLine} ${styles[`connectingLine${index + 1}`]}`}
                    />
                )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksDetailed;