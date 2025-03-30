'use client' // Add if using Next.js App Router

import { Github, Linkedin, Twitter } from 'lucide-react'; // Example social icons
import Link from 'next/link'; // Use Next.js Link if applicable, otherwise use <a>
import styles from './Footer.module.css'; // New CSS Module Name

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get current year dynamically

  // --- Footer Link Data ---
  const companyLinks = [
    { href: '/about', text: 'About Us' },
    { href: '/blog', text: 'Blog' },
    { href: '/contact', text: 'Contact' },
    // Add other company links as needed
  ];

  const productLinks = [
    { href: '/#features', text: 'Features' }, // Example link to section ID
    { href: '/pricing', text: 'Pricing' }, // If applicable
    { href: '/#how-it-works', text: 'How It Works' },
    // Add other product links
  ];

  const legalLinks = [
    { href: '/privacy-policy', text: 'Privacy Policy' },
    { href: '/terms-of-service', text: 'Terms of Service' },
    // Add other legal links
  ];
  
  const socialLinks = [
    { href: 'https://linkedin.com', icon: <Linkedin size={20} />, label: 'LinkedIn' },
    { href: 'https://twitter.com', icon: <Twitter size={20} />, label: 'Twitter' },
    { href: 'https://github.com', icon: <Github size={20} />, label: 'GitHub' },
    // { href: 'https://dribbble.com', icon: <Dribbble size={20} />, label: 'Dribbble' },
    // Add other social links
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* --- Link Columns --- */}
        <div className={styles.linkColumns}>
          {/* Company Links */}
          <div>
            <h4 className={styles.listHeading}>Company</h4>
            <ul className={styles.linkList}>
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h4 className={styles.listHeading}>Product</h4>
            <ul className={styles.linkList}>
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className={styles.listHeading}>Legal</h4>
            <ul className={styles.linkList}>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
            {/* Optional: Could be a 4th column for Contact/Support */}

        </div> {/* End Link Columns */}

        {/* --- Footer Bottom: Social & Copyright --- */}
        <div className={styles.footerBottom}>
           {/* Optional: Logo */}
           {/* <div className={styles.footerLogo}> Your Logo </div> */}

          <div className={styles.socialLinks}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconLink}
                aria-label={social.label} // Accessibility
              >
                {social.icon}
              </a>
            ))}
          </div>

          <p className={styles.copyrightText}>
             &copy; {currentYear} YourCompanyName. All Rights Reserved. 
          </p>
        </div> {/* End Footer Bottom */}

      </div> {/* End Footer Container */}
    </footer>
  );
};

export default Footer;