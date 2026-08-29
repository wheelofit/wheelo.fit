import React from 'react';
import { Metadata } from 'next';
import { AsyncBookingForm as BookingForm } from '@/components/ui/AsyncBookingForm';
import prisma from '@/lib/prisma';
import { RidePageLayout } from '@/components/ui/RidePageLayout';
import styles from '@/components/ui/RidePageLayout.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sunday Morning Coastal Cycling | Wheelo.fit',
  description: 'Start your Sunday on two wheels with a refreshing 15km cycling experience through Mumbai’s scenic coastal stretches like Worli Seaface and Shivaji Park.',
};

const sliderImages = [
  { id: "1", img: "/sunday-morning-cycling/IMG_1301.jpeg", height: 400 },
  { id: "2", img: "/sunday-morning-cycling/96234e23-b6af-466f-9045-abadd274fd8f.jpeg", height: 250 },
  { id: "3", img: "/sunday-morning-cycling/cdec0adf-d6bb-4445-be4c-8480d493c13b.jpeg", height: 600 },
  { id: "4", img: "/sunday-morning-cycling/A60632F4-8123-4B6A-8E8B-71EF9C10DB3E.jpeg", height: 350 },
  { id: "5", img: "/sunday-morning-cycling/IMG_1303.jpeg", height: 450 },
];

export default async function SundayMorningPage() {
  const dbEvents = await prisma.event.findMany({
    where: { eventType: 'SUNDAY', isActive: true, date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    select: { id: true, title: true, date: true, timeSlot: true, price: true }
  });

  // Fetch global pricing set by Admin
  const globalEvent = await prisma.event.findFirst({
    where: { eventType: 'SUNDAY', price: { gt: 0 } },
    orderBy: { updatedAt: 'desc' }
  });
  const globalPrice = globalEvent?.price || 649;

  const events = dbEvents.map(e => ({
    id: e.id,
    title: e.title,
    date: e.date,
    timeSlot: e.timeSlot,
    price: globalPrice
  }));

  const overview = (
    <div key="overview">
      <p>Start your Sunday on two wheels with a refreshing 15 km cycling experience through some of Mumbai’s most scenic coastal stretches. Our Sunday Morning Ride is designed for riders who want to enjoy the city at a relaxed pace while soaking in the fresh morning air, beautiful views, and vibrant cycling atmosphere.</p>
      <p style={{ fontWeight: 'bold', margin: '1rem 0' }}>🚴 Ride Route -- Worli → Worli Seaface → Worli Promenade Cycling Track → Shivaji Park → Worli</p>
      <p>The ride begins at Worli and takes you along the scenic Worli Seaface, where you can ride through the cycling track and enjoy the cool morning breeze and beautiful views of the Arabian Sea. It’s one of the highlights of ride, offering a peaceful and enjoyable stretch away from the usual city rush.</p>
      <p>A group photo session is also planned at Worli Promenade, giving you the perfect opportunity to capture the morning, the beautiful surroundings, and memories with fellow riders. The route then continues towards Shivaji Park before heading back to the starting point at Worli.</p>
      <p>Whether you&apos;re a regular cyclist or simply looking for an active and refreshing way to spend your Sunday morning, this ride offers the perfect combination of cycling, scenic views, fitness, and community.</p>
    </div>
  );

  const inclusionsExclusions = (
    <div key="inc-exc" className={styles.grid2Col}>
      <div className={styles.incCard}>
        <h3>Inclusions</h3>
        <ul className={`${styles.list} ${styles.incList}`}>
          <li>Geared Bicycle</li>
          <li>Helmet</li>
          <li>Refreshing Morning Drink / Breakfast</li>
          <li>First Aid & Mechanical Support</li>
        </ul>
      </div>
      <div className={styles.excCard}>
        <h3>Exclusions</h3>
        <ul className={`${styles.list} ${styles.excList}`}>
          <li>Travel to start point</li>
          <li>Additional food/drinks at cafe</li>
          <li>Personal expenses</li>
        </ul>
      </div>
    </div>
  );

  const itinerary = (
    <div key="itinerary" className={styles.timeline}>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>06:15 AM</span>
        Assemble at the starting point, brief introduction.
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>06:45 AM</span>
        Start the ride and catch the beautiful sunrise.
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>07:30 AM</span>
        Breakfast break at a famous local spot.
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>08:45 AM</span>
        Ride concludes.
      </div>
    </div>
  );

  const additionalSections = [
    {
      title: 'Things to carry',
      content: (
        <ul key="carry" className={styles.list}>
          <li><span style={{color: '#1eb53a'}}>✦</span> Identity Proof (Mandatory)</li>
          <li><span style={{color: '#1eb53a'}}>✦</span> Water Bottle Min 1 litre</li>
          <li><span style={{color: '#1eb53a'}}>✦</span> Snacks/Drinks (optional)</li>
          <li><span style={{color: '#1eb53a'}}>✦</span> Medicines (if any)</li>
          <li><span style={{color: '#1eb53a'}}>✦</span> Camera, Cell Phone (Optional)</li>
          <li><span style={{color: '#1eb53a'}}>✦</span> Dry fruits and chocolates</li>
          <li><span style={{color: '#1eb53a'}}>✦</span> A small bag to carry these stuffs.</li>
        </ul>
      )
    },
    {
      title: 'Disclaimer & Policies',
      content: (
        <div key="policies">
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>If you are unable to complete the ride, rented cycles must be returned to the starting point at your own expense.</li>
            <li>Smoking and alcohol consumption are strictly prohibited during the ride.</li>
            <li>Please avoid wearing or carrying expensive jewellery and valuables.</li>
            <li>Activities or the route may be changed or cancelled due to weather or other unavoidable circumstances.</li>
            <li>Follow all instructions given by our coordinators. Wheelo.fit is not responsible for any injuries or accidents that may occur during the ride.</li>
            <li>Participants are responsible for any damage caused to rented cycles during the ride.</li>
          </ul>
        </div>
      )
    },
    {
      title: 'FAQs',
      content: (
        <div key="faqs" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <strong>1) What is the route?</strong>
            <p>Worli (Meeting point) - Worli Seaface - Promenade Cycling track - Shivaji Park - Worli</p>
          </div>
          <div>
            <strong>2) What is the difficulty level of the route?</strong>
            <p>The ride is moderate in difficulty, with most of the route being flat and suitable for riders with basic cycling experience.</p>
          </div>
          <div>
            <strong>3) I’m very tall/short. Will I get a cycle suitable for my height?</strong>
            <p>Yes. Please inform us about your height and any specific requirements while booking. We’ll do our best to arrange a suitable cycle for your comfort.</p>
          </div>
          <div>
            <strong>4) Can I come alone?</strong>
            <p>Yes, many of our participants are solo travellers.</p>
          </div>
          <div>
            <strong>5) Is the ride safe for female solo travellers?</strong>
            <p>Absolutely! Our team stays with the group throughout the ride, and our events are popular among solo female riders, with around 50% female participation.</p>
          </div>
          <div>
            <strong>6) What if I’m unable to complete the ride?</strong>
            <p>Our experienced coordinators will make sure you complete the ride. In case you not able to, you need to transfer the cycles back to the start point.</p>
          </div>
          <div>
            <strong>7) What should I wear for the ride?</strong>
            <p>We recommend wearing comfortable outfit like Tee-shirt and Track/shorts.</p>
          </div>
          <div>
            <strong>8) Will I be able to complete the ride if I haven’t cycled for a long time?</strong>
            <p>Absolutely! We’ve had riders return to cycling after 10+ years and successfully complete the ride. We also include regular breaks along the route, making the experience comfortable and enjoyable rather than hectic one.</p>
          </div>
        </div>
      )
    }
  ];

  const jsonLd = events.map(e => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title || 'Sunday Morning Coastal Cycling',
    startDate: e.date.toISOString(),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Worli, Mumbai',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN'
      }
    },
    offers: {
      '@type': 'Offer',
      price: e.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: 'https://wheelo.fit/rides/sunday-morning'
    }
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RidePageLayout 
        title="Sunday Morning Rides"
        overview={overview}
        inclusionsExclusions={inclusionsExclusions}
        itinerary={itinerary}
        additionalSections={additionalSections}
        sliderImages={sliderImages}
        priceText="₹649"
        bookingForm={<BookingForm key="booking-form" title="Book Your Spot" buttonText="Register Now" events={events} />}
      />
    </>
  );
}
