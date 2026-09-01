import React from 'react';
import Link from 'next/link';
import { OptimizedImage as Image } from '@/components/ui/OptimizedImage';
import styles from './Footer.module.css';



const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.5-4h-4.31V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <Link href="/">
              <Image src="/logo.png" alt="Wheelo.fit Logo" width={80} height={80} />
            </Link>
            <p className={styles.description}>
              A Community connected by Two wheels
            </p>
          </div>
          
          <div className={styles.linksGrid}>
            <div className={styles.linkColumn}>
              <h3>Experiences</h3>
              <Link href="/rides/cycle-classes">Cycling Classes</Link>
              <Link href="/rides/midnight-rides">Midnight Cycling Rides</Link>
              <Link href="/rides/sunday-morning">Sunday Morning Rides</Link>
              <Link href="/rides/rentals">Rentals</Link>
            </div>
            <div className={styles.linkColumn}>
              <h3>Company</h3>
              <Link href="/about">About Us</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className={styles.linkColumn}>
              <h3>Legal</h3>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/faq">FAQ&apos;s</Link>
            </div>
            <div className={styles.linkColumn}>
              <h3>Socials</h3>
              <Link href="#" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <InstagramIcon /> Instagram
              </Link>
              <Link href="#" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <FacebookIcon /> Facebook
              </Link>
              <Link href="#" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <TwitterIcon /> Twitter
              </Link>
              <Link href="#" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <YoutubeIcon /> YouTube
              </Link>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomSection}>
          <p>&copy; {new Date().getFullYear()} WheelO.fit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
