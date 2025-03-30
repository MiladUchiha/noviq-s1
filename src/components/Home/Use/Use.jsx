'use client'
import gsap from 'gsap-trial'
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger'
import {
    AppWindow // Mobile App
    , // First-time entrepreneur
    Briefcase, // Small Business Owner / E-commerce
    GraduationCap, // Side Hustler / Solopreneur
    Lightbulb, // Student
    MonitorSmartphone, // E-commerce Store
    PenTool, // Local Service
    ShoppingCart, // Innovator
    Store,
    User, // Tech Startup / SaaS
    Wrench
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import styles from './Use.module.css'; // New CSS Module Name

// --- Register GSAP Plugins ---
gsap.registerPlugin(ScrollTrigger); // Register globally or here

const WhoIsItForSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const personaRefs = useRef([]);
  const useCaseRefs = useRef([]);
  const dividerRef = useRef(null); // Ref for optional divider

  const personasData = [
    { icon: <User size={24} />, name: 'First-Time Entrepreneurs', desc: 'Taking the leap with a groundbreaking idea.' },
    { icon: <Briefcase size={24} />, name: 'Side Hustlers & Solopreneurs', desc: 'Building a venture alongside a day job.' },
    { icon: <Lightbulb size={24} />, name: 'Innovators & Inventors', desc: 'Bringing a novel concept or technology to market.' },
    { icon: <Store size={24} />, name: 'SMB Owners Pivoting', desc: 'Existing businesses looking to digitize or launch new offerings.' },
    { icon: <GraduationCap size={24} />, name: 'Student Entrepreneurs', desc: 'Exploring startup concepts while still studying.' },
  ];

  const useCasesData = [
    { icon: <MonitorSmartphone size={24} />, name: 'Tech Startups & SaaS', desc: 'Launch scalable software or platform businesses.' },
    { icon: <Wrench size={24} />, name: 'Local Service Businesses', desc: 'Consulting, agencies, home services, and more.' },
    { icon: <ShoppingCart size={24} />, name: 'E-commerce Ventures', desc: 'Niche product stores, dropshipping, or digital goods.' },
    { icon: <PenTool size={24} />, name: 'Creator & Content Businesses', desc: 'Newsletters, courses, communities, media platforms.' },
     { icon: <AppWindow size={24} />, name: 'Mobile Applications', desc: 'Develop and plan the launch of your next great app.' },
  ];

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mm = gsap.matchMedia(); // For responsive animations

    const ctx = gsap.context(() => {
      // --- Initial States ---
      gsap.set(titleRef.current, { opacity: 0, y: 50 });
      gsap.set([personaRefs.current, useCaseRefs.current], { opacity: 0, y: 20 });
      gsap.set(dividerRef.current, { scaleY: 0, opacity: 0 }); // Divider initially hidden

       // --- Responsive Animations ---
       mm.add("(min-width: 769px)", () => { // Desktop: Slide columns horizontally
            gsap.set(leftColRef.current, { opacity: 0, x: -80 });
            gsap.set(rightColRef.current, { opacity: 0, x: 80 });

            const tl = gsap.timeline({
                scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' }
            });

             tl.to(titleRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
               .to([leftColRef.current, rightColRef.current], { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', stagger: 0.2 }, "-=0.7")
               .to(dividerRef.current, { scaleY: 1, opacity: 1, duration: 0.8, ease: 'power2.inOut', transformOrigin: 'center top' }, "-=0.8") // Animate divider
               .to(personaRefs.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 }, "-=0.6")
               .to(useCaseRefs.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 }, "<"); // Animate use cases at same time as personas
       });

        mm.add("(max-width: 768px)", () => { // Mobile: Slide columns vertically
             gsap.set(leftColRef.current, { opacity: 0, y: 50 });
             gsap.set(rightColRef.current, { opacity: 0, y: 50 });

             const tl = gsap.timeline({
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' }
            });

             tl.to(titleRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
               .to(leftColRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out'}, "-=0.7")
               .to(personaRefs.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, "-=0.5")
               // No divider animation needed here typically
               .to(rightColRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out'}, "-=0.5") // Stagger second column
               .to(useCaseRefs.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, "-=0.5");
        });


      // --- Hover Effects (Common to both layouts) ---
      if (!isReducedMotion) {
        const items = [...personaRefs.current, ...useCaseRefs.current];
        items.forEach(item => {
            if (!item) return;
            const icon = item.querySelector(`.${styles.itemIcon}`);
            item.addEventListener('mouseenter', () => {
                gsap.to(item, { y: -4, backgroundColor: 'rgba(255, 255, 255, 0.04)', duration: 0.25, ease: 'power1.out'});
                if(icon) gsap.to(icon, { scale: 1.1, color: '#d8cfff', duration: 0.25, ease: 'power1.out'}); // Make icon slightly bigger and brighter
            });
             item.addEventListener('mouseleave', () => {
                 gsap.to(item, { y: 0, backgroundColor: 'transparent', duration: 0.25, ease: 'power1.out'});
                  if(icon) gsap.to(icon, { scale: 1, color: '#a78bfa', duration: 0.25, ease: 'power1.out'}); // Reset icon color
            });
        });
      }

    }, sectionRef); // Scope GSAP context

    return () => {
        ctx.revert(); // Cleanup GSAP
        mm.revert(); // Cleanup matchMedia
    }
  }, []);


  return (
    <section ref={sectionRef} className={styles.whoSection}>
        {/* Optional Background Glows */}
        {/* <div className={styles.glowContainer}> ... </div> */}

      <div className={styles.whoContainer}>
        <h2 ref={titleRef} className={styles.sectionTitleWho}>
          Built For Innovators Like You
        </h2>

        <div className={styles.splitGrid}>
            {/* Optional: Divider Element */}
            <div ref={dividerRef} className={styles.divider}></div>

            {/* --- Left Column: Personas --- */}
            <div ref={leftColRef} className={styles.personasColumn}>
                <h3 className={styles.columnHeading}>Who We Empower</h3>
                 <ul className={styles.itemList}>
                    {personasData.map((persona, index) => (
                        <li key={`p-${index}`} ref={el => personaRefs.current[index] = el} className={styles.personaItem}>
                           <span className={styles.itemIcon}>{persona.icon}</span>
                            <div>
                                <span className={styles.itemName}>{persona.name}</span>
                                <p className={styles.itemDesc}>{persona.desc}</p>
                            </div>
                        </li>
                    ))}
                 </ul>
            </div>

            {/* --- Right Column: Use Cases --- */}
             <div ref={rightColRef} className={styles.useCasesColumn}>
                 <h3 className={styles.columnHeading}>What You Can Build</h3>
                 <ul className={styles.itemList}>
                    {useCasesData.map((useCase, index) => (
                         <li key={`uc-${index}`} ref={el => useCaseRefs.current[index] = el} className={styles.useCaseItem}>
                            <span className={styles.itemIcon}>{useCase.icon}</span>
                            <div>
                               <span className={styles.itemName}>{useCase.name}</span>
                               <p className={styles.itemDesc}>{useCase.desc}</p>
                            </div>
                         </li>
                    ))}
                 </ul>
            </div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsItForSection;