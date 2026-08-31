import React from 'react';
import styles from '@/components/ui/InfoPage.module.css';

export default function ContactPage() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Get In Touch</h1>
        <p className={styles.subtitle}>
          Have a question about our classes, midnight rides, or cycle rentals? Drop us a message and we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.textBlock}>
          <h2>Contact Information</h2>
          <p>
            <strong>Business Name:</strong> Devansh Raviprakash Gupta
          </p>
          <p>
            <strong>Address:</strong> <br />
            BMC parking lot, Next to Raheja Artesia,<br />
            Hind cycle marg, Worli, Mumbai 400030
          </p>
          <p>
            <strong>Ph.no:</strong> +91 8879045474
          </p>
          <p>
            <strong>Email us at:</strong> wheelofitclub@gmail.com
          </p>
          <p>
            <strong>Instagram page:</strong> <a href="https://instagram.com/wheelo.fit" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>@wheelo.fit</a>
          </p>
          <br />
          <h2>Business Hours</h2>
          <p>Monday - Friday: 6:00 AM - 9:00 PM</p>
          <p>Saturday - Sunday: 5:00 AM - 10:00 PM</p>
        </div>

        <div className={styles.glassCard}>
          <form className={styles.contactForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="john@example.com" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" placeholder="How can we help?" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="message">Message</label>
              <textarea id="message" rows={5} placeholder="Write your message here..." required></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>Send Message</button>
          </form>
        </div>
      </div>
    </main>
  );
}
