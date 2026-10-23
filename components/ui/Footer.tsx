import React from "react";
import Link from "next/link";
import { OptimizedImage as Image } from "@/components/ui/OptimizedImage";
import styles from "./Footer.module.css";

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.5-4h-4.31V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div
            className={styles.brandInfo}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Wheelo.fit Logo"
                width={80}
                height={80}
              />
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
              <a
                href="https://www.instagram.com/wheelo.fit?cplk=MWF0Zno5enE4bnozZw%3D%3D&utm_source=qr"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon /> Instagram
              </a>
              <a
                href="https://www.facebook.com/share/1DTGfqTv9G/?mibextid=wwXIfr"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon /> Facebook
              </a>
              <a
                href="https://share.google/seiMVIIIJ0mkmYhV9"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GoogleIcon /> Google
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p>
            &copy; {new Date().getFullYear()} WheelO.fit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
