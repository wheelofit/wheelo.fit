import React from 'react';
import { Metadata } from 'next';
import { AsyncBookingForm as BookingForm } from '@/components/ui/AsyncBookingForm';
import prisma from '@/lib/prisma';
import { RidePageLayout } from '@/components/ui/RidePageLayout';
import styles from '@/components/ui/RidePageLayout.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mumbai Midnight Cycling Experience | Wheelo.fit',
  description: 'Explore Mumbai after hours on a guided midnight cycling tour. Ride through iconic landmarks like Haji Ali, Marine Drive, and Gateway of India.',
};

const sliderImages = [
  { id: "1", img: "/midnight-cycling/IMG_9065_Original.jpg", height: 400 },
  { id: "2", img: "/midnight-cycling/20260206_234829_Original.jpg", height: 250 },
  { id: "3", img: "/midnight-cycling/394f1e8d-0834-4654-877d-b26fc02f1964.jpg", height: 600 },
  { id: "4", img: "/midnight-cycling/20260215_003440_Original.jpg", height: 350 },
  { id: "5", img: "/midnight-cycling/0b1ae5c3-bb49-47ca-9f3c-2053da15b1c7.JPG", height: 450 },
];

export default async function MidnightRidesPage() {
  const dbEvents = await prisma.event.findMany({
    where: {
      eventType: 'MIDNIGHT',
      isActive: true,
      date: { gte: new Date() }
    },
    orderBy: { date: 'asc' },
    select: { id: true, title: true, date: true, timeSlot: true, price: true }
  });

  // Fetch global pricing set by Admin
  const globalEvent = await prisma.event.findFirst({
    where: { eventType: 'MIDNIGHT', price: { gt: 0 } },
    orderBy: { updatedAt: 'desc' }
  });
  const globalPrice = globalEvent?.price || 749;

  const events = dbEvents.map(e => ({
    id: e.id,
    title: e.title,
    date: e.date,
    timeSlot: e.timeSlot,
    price: globalPrice
  }));

  const overview = (
    <div key="overview">
      <p>What makes a true Mumbaikar? It’s the spirit of a city that never stops. And what better way to experience that spirit than on two wheels, when Mumbai comes alive in a completely different way?</p>
      <p>Whether you’re new to Mumbai, looking for a different weekend plan, or simply want to explore the city after hours, Our Mumbai Midnight Cycling Experience is made for you. Ride through the city’s iconic streets, enjoy the cool Mumbai breeze, meet new people, and create unforgettable memories along the way.</p>
      <p>Our guided route takes you through some of Mumbai’s most iconic landmarks, including Haji Ali, Tardeo, Wilson College, Mantralaya, Gateway Of India, Taj Mahal Palace, Marine Drive and Charni Chowpatty, before we make our way back to Worli.</p>
      <p>But this experience is more than just cycling. Along the way, we take planned breaks, play fun games, socialize with fellow riders, and enjoy Mumbai’s vibrant atmosphere together.</p>
      <p>So, leave the usual weekend plans behind and explore Mumbai after hours, and take home memories worth sharing.</p>
      <p style={{ textAlign: 'center', marginTop: '1rem', fontWeight: 'bold' }}>Worli – Gateway of India – Worli</p>
    </div>
  );

  const inclusionsExclusions = (
    <div key="inc-exc" className={styles.grid2Col}>
      <div className={styles.incCard}>
        <h3>Inclusions</h3>
        <ul className={`${styles.list} ${styles.incList}`}>
          <li>Gear/Non-gear Cycles</li>
          <li>A juice bottle</li>
          <li>First Aid</li>
          <li>Expertise and Ride support</li>
          <li>Helmets (limited)</li>
        </ul>
      </div>
      <div className={styles.excCard}>
        <h3>Exclusions</h3>
        <ul className={`${styles.list} ${styles.excList}`}>
          <li>Anything other than the above-mentioned things</li>
          <li>Any Personal Expenses</li>
        </ul>
      </div>
    </div>
  );

  const itinerary = (
    <div key="itinerary" className={styles.timeline}>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>10:15 PM</span>
        Meet at Worli for orientation, cycle allocation & refreshments
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>10:45 PM</span>
        Ride begins from Worli
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>11:45 PM</span>
        Short halt at Haji Ali
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>1:30 AM</span>
        Continue towards Marine Drive via Gateway of India
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>2:00 AM</span>
        Refresh, relax & enjoy the Marine Drive views
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>3:30 AM</span>
        Return to Worli and safely drop off the cycles
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
            <p>Worli - Nehru Planetarium - Haji Ali - Tardeo - Wilson College - Taraporewala Aquarium - Trident Hotel - Mantralaya - Gateway of India - Marine Drive - Charni Chowpatty</p>
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
            <p>We recommend wearing comfortable, breathable, and bright-coloured clothing for better visibility and comfort during the ride.</p>
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
    name: e.title || 'Mumbai Midnight Cycling Experience',
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
      url: 'https://wheelo.fit/rides/midnight-rides'
    }
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RidePageLayout 
        title="Midnight Rides"
        overview={overview}
        inclusionsExclusions={inclusionsExclusions}
        itinerary={itinerary}
        additionalSections={additionalSections}
        sliderImages={sliderImages}
        priceText="₹749"
        bookingForm={
          <BookingForm 
            key="booking-form"
            title="Book Your Spot"
            buttonText="Register Now"
            events={events}
          />
        }
      />
    </>
  );
}
