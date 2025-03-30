'use client' // Add if using Next.js App Router

import { ArrowRight, ChevronDown, Globe, Menu, User, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link'; // Use Next.js Link or <a> if not using Next.js
import { useEffect, useRef, useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN'); // Default language
  const langDropdownRef = useRef(null); // Ref for detecting clicks outside dropdown
  
  // Use NextAuth session instead of local state
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';

  // --- Configuration Data ---
  const navLinks = [
    { href: '/#features', text: 'Features' },
    { href: '/#how-it-works', text: 'How It Works' },
    { href: '/pricing', text: 'Pricing' }, // Example
    { href: '/blog', text: 'Blog' },
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
    // Add more languages
  ];

  const primaryCTAText = "Get Started";
  const primaryCTALink = "/register"; // Example link

  // --- Handlers ---
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLangDropdown = () => {
    setIsLangDropdownOpen(!isLangDropdownOpen);
  };

  const selectLanguage = (langCode) => {
    setCurrentLang(langCode);
    setIsLangDropdownOpen(false);
    // TODO: Add logic here to actually change the language
    console.log(`Language changed to: ${langCode}`);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  // --- Effect for closing dropdown on outside click ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownRef]);
  
   // --- Effect to disable body scroll when mobile menu is open ---
   useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function
    return () => {
       document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* --- Logo --- */}
        <Link href="/" className={styles.logo}>
          {/* Replace with your actual Logo Component or Text */}
          Noviq
        </Link>

        {/* --- Desktop Navigation Links --- */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.navLink}>
                {link.text}
              </Link>
            </li>
          ))}
        </ul>

        {/* --- Right Side Elements --- */}
        <div className={styles.navRight}>
          {/* Language Selector */}
          <div className={styles.langSelector} ref={langDropdownRef}>
            <button
              className={styles.langTrigger}
              onClick={toggleLangDropdown}
              aria-haspopup="true"
              aria-expanded={isLangDropdownOpen}
              aria-label={`Select language, current language ${currentLang}`}
            >
              <Globe size={18} />
              <span>{currentLang}</span>
              <ChevronDown size={16} className={`${styles.chevron} ${isLangDropdownOpen ? styles.chevronOpen : ''}`} />
            </button>

            {/* Language Dropdown Menu */}
            {isLangDropdownOpen && (
              <ul className={styles.langDropdown} role="menu">
                {languages.map((lang) => (
                  <li key={lang.code} role="menuitem">
                    <button
                      className={`${styles.langItem} ${currentLang === lang.code ? styles.langItemActive : ''}`}
                      onClick={() => selectLanguage(lang.code)}
                    >
                      {lang.name} ({lang.code})
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Conditional authentication buttons */}
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className={`${styles.authButton} ${styles.dashboardButton}`}>
                <User size={16} />
                <span>Dashboard</span>
              </Link>
              <button onClick={handleLogout} className={`${styles.authButton} ${styles.logoutButton}`}>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link href="/login" className={`${styles.authButton} ${styles.loginButton}`}>
              <span>Login</span>
            </Link>
          )}

          {/* CTA Button - Show only when not logged in */}
          {!isLoggedIn && (
            <Link href={primaryCTALink} className={`${styles.ctaButton} ${styles.navCtaButton}`}>
              <span>{primaryCTAText}</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* --- Mobile Menu Button --- */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

       {/* --- Mobile Menu Panel --- */}
       <div className={`${styles.mobileMenuPanel} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
           <ul className={styles.mobileNavLinks}>
                {navLinks.map((link) => (
                    <li key={`mobile-${link.href}`}>
                    <Link href={link.href} className={styles.mobileNavLink} onClick={toggleMobileMenu}>
                        {link.text}
                    </Link>
                    </li>
                ))}
                
                {/* Add auth links to mobile menu */}
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link href="/dashboard" className={`${styles.mobileNavLink} ${styles.mobileAuthLink}`} onClick={toggleMobileMenu}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          toggleMobileMenu();
                          handleLogout();
                        }} 
                        className={`${styles.mobileNavLink} ${styles.mobileAuthLink} ${styles.mobileLogoutBtn}`}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link href="/login" className={`${styles.mobileNavLink} ${styles.mobileAuthLink}`} onClick={toggleMobileMenu}>
                      Login
                    </Link>
                  </li>
                )}
           </ul>
           {/* Optional: Include simplified Lang Selector or CTA in mobile menu */}
            <div className={styles.mobileMenuBottom}>
              {!isLoggedIn && (
                <Link href={primaryCTALink} className={`${styles.ctaButton} ${styles.mobileCtaButton}`} onClick={toggleMobileMenu}>
                  <span>{primaryCTAText}</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
       </div>
        {/* Optional: Overlay for mobile menu */}
       {isMobileMenuOpen && <div className={styles.mobileMenuOverlay} onClick={toggleMobileMenu}></div>}

    </nav>
  );
};

export default Navbar;