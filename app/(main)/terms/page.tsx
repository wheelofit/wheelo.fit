import React from "react";
import styles from "@/components/legal/LegalPage.module.css";

export default function TermsAndConditions() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Terms and Conditions</h1>
        <p className={styles.lastUpdated}>Last Updated: July 2026</p>
      </div>

      <div className={styles.content}>
        <p>
          Welcome to <strong>Wheelo.fit</strong>. These terms and conditions
          outline the rules and regulations for the use of our website and
          services, including participation in our cycling classes, outdoor
          rides, and cycle rentals.
        </p>
        <p>
          By accessing this website and booking our services, we assume you
          accept these terms and conditions in full. Do not continue to use
          Wheelo.fit if you do not accept all of the terms and conditions stated
          on this page.
        </p>

        <h2>1. Participation and Health Waiver</h2>
        <p>
          By participating in any physical activities, indoor classes, or
          outdoor rides organized by Wheelo.fit, you agree to the following:
        </p>
        <ul>
          <li>
            You acknowledge that cycling involves inherent risks, including the
            risk of physical injury, and you voluntarily assume all such risks.
          </li>
          <li>
            You confirm that you are physically fit and have no medical
            condition that would prevent your full participation in these
            activities.
          </li>
          <li>
            You agree to release, waive, and discharge Wheelo.fit, its
            instructors, employees, and organizers from any and all liability,
            claims, demands, or actions arising out of any injury or damage to
            you or your property resulting from your participation.
          </li>
        </ul>

        <h2>2. Cycle Rentals and Equipment Damage</h2>
        <p>
          When renting bicycles or related equipment from Wheelo.fit, you agree
          to the following rental policies:
        </p>
        <ul>
          <li>
            <strong>Condition of Equipment:</strong> You are responsible for
            inspecting the cycle prior to the rental period and must return it
            in the same working condition.
          </li>
          <li>
            <strong>Damage and Loss:</strong> You are financially responsible
            for any damage, loss, or theft of the cycle during your rental
            period. Wheelo.fit reserves the right to charge the credit card on
            file for repair or replacement costs.
          </li>
          <li>
            <strong>Late Returns:</strong> Cycles returned past the agreed-upon
            rental time may be subject to additional late fees as outlined
            during the booking process.
          </li>
        </ul>

        <h2>3. Bookings, Cancellations, and Refunds</h2>
        <p>
          All bookings for classes, rides, and rentals must be made in advance
          through our platform.
        </p>
        <ul>
          <li>
            <strong>Cancellations:</strong> You may cancel a booking up to 12
            hours before the scheduled start time for a full refund or credit.
            Cancellations made within 12 hours of the start time are
            non-refundable.
          </li>
          <li>
            <strong>No Shows:</strong> Failure to attend a booked class or ride
            without prior cancellation will result in forfeiture of the payment
            or class credit.
          </li>
          <li>
            <strong>Service Modifications:</strong> Wheelo.fit reserves the
            right to cancel or modify any class or ride due to weather
            conditions, instructor unavailability, or unforeseen circumstances.
            In such events, a full refund or reschedule option will be provided.
          </li>
        </ul>

        <h2>4. User Conduct</h2>
        <p>
          We strive to maintain a welcoming, safe, and respectful environment.
          You agree to follow all instructions provided by Wheelo.fit staff and
          instructors. Harassment, abusive language, or reckless behavior will
          not be tolerated and may result in immediate termination of your
          booking without refund and a ban from future services.
        </p>

        <h2>5. Intellectual Property Rights</h2>
        <p>
          Unless otherwise stated, Wheelo.fit and/or its licensors own the
          intellectual property rights for all material on Wheelo.fit. All
          intellectual property rights are reserved. You may view and/or print
          pages from https://wheelo.fit for your own personal use subject to
          restrictions set in these terms and conditions.
        </p>

        <h2>6. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the
          laws of the jurisdiction in which Wheelo.fit operates, without regard
          to its conflict of law provisions.
        </p>

        <h2>7. Contact Information</h2>
        <p>
          If you have any questions or concerns regarding these Terms and
          Conditions, please contact us at: <br />
          Email: wheelofitclub@gmail.com <br />
          Phone: +91 88790 45474
        </p>
      </div>
    </main>
  );
}
