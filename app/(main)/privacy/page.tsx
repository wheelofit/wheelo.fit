import React from "react";
import styles from "@/components/legal/LegalPage.module.css";

export default function PrivacyPolicy() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: July 2026</p>
      </div>

      <div className={styles.content}>
        <p>
          At <strong>Wheelo.fit</strong>, your privacy is our priority. This
          Privacy Policy outlines how we collect, use, and protect your personal
          information when you use our website, attend our classes, or rent our
          equipment.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information to provide better services to all our users.
          The types of personal information we collect include:
        </p>
        <ul>
          <li>
            <strong>Personal Identification Information:</strong> Name, email
            address, phone number, and billing address when you register for an
            account, book a class, or rent a cycle.
          </li>
          <li>
            <strong>Payment Information:</strong> Credit card details and
            transaction history, securely processed by our third-party payment
            gateways.
          </li>
          <li>
            <strong>Health and Fitness Data:</strong> Optional data you provide
            regarding your fitness levels or medical conditions to ensure safe
            participation in our physical activities.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you interact with
            our website, including IP address, browser type, and pages visited.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for various purposes, including:</p>
        <ul>
          <li>
            To provide and maintain our services, including class bookings and
            cycle rentals.
          </li>
          <li>
            To notify you about changes to our schedules, policies, or services.
          </li>
          <li>
            To process transactions and send related information, including
            purchase confirmations and invoices.
          </li>
          <li>
            To improve our website, customer service, and overall user
            experience.
          </li>
          <li>
            To send promotional emails about new classes, special offers, or
            other information we think you may find interesting.
          </li>
        </ul>

        <h2>3. Data Protection and Security</h2>
        <p>
          We implement a variety of standard security measures to maintain the
          safety of your personal information. All sensitive payment information
          is transmitted via Secure Socket Layer (SSL) technology and encrypted
          into our payment gateway providers&apos; databases, accessible only by
          those authorized with special access rights to such systems.
        </p>

        <h2>4. Sharing Your Information</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personally
          identifiable information to outside parties except to trusted third
          parties who assist us in operating our website, conducting our
          business, or servicing you, so long as those parties agree to keep
          this information confidential.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete the personal
          information we have on you. If you wish to exercise these rights,
          please contact us using the information provided below.
        </p>

        <h2>6. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the &quot;Last Updated&quot; date.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at: <br />
          Email: wheelofitclub@gmail.com <br />
          Phone: +91 88790 45474
        </p>
      </div>
    </main>
  );
}
