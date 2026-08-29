import React from 'react';
import { Metadata } from 'next';
import styles from '../rides.module.css';
import RentalsView from './RentalsView';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { SectionAccordion } from '@/components/ui/SectionAccordion';

import { OptimizedImage as Image } from '@/components/ui/OptimizedImage';
import { CycleData } from './RentalsView';

type CycleBooking = { startDate: Date; endDate: Date; quantity: number };
type CycleWithBookings = Omit<CycleData, 'isInstock' | 'nextAvailableDate'> & { bookings: CycleBooking[] };

export const metadata: Metadata = {
  title: 'Premium Bicycle Rentals in Mumbai | Wheelo.fit',
  description: 'Rent premium geared and non-geared cycles in Mumbai. Perfect for hitting the trails or a casual weekend spin with flexible timings.',
};

export const dynamic = 'force-dynamic';

export default async function RentalsPage() {
  const cycles = await (prisma as unknown as { rentalCycle: { findMany: (args: unknown) => Promise<(CycleWithBookings & Record<string, unknown>)[]> } }).rentalCycle.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: { bookings: { where: { status: 'CONFIRMED' } } }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cyclesWithStockInfo = cycles.map((cycle: CycleWithBookings & Record<string, unknown>) => {
    let isInstock = cycle.quantity > 0;
    let nextAvailableDate: string | null = null;
    
    if (isInstock && cycle.bookings && cycle.bookings.length > 0) {
      // Helper to get booked quantity for a specific date
      const getBookedQty = (date: Date) => cycle.bookings.reduce((sum: number, b: CycleBooking) => {
         const bStart = new Date(b.startDate); bStart.setHours(0,0,0,0);
         const bEnd = new Date(b.endDate); bEnd.setHours(23,59,59,999);
         if (date >= bStart && date <= bEnd) {
           return sum + b.quantity;
         }
         return sum;
      }, 0);

      const isAvailableFor30DaysFrom = (startDate: Date) => {
         for (let i = 0; i < 30; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            if (cycle.quantity - getBookedQty(d) <= 0) return false;
         }
         return true;
      };

      // Check if available for the next 1 month (30 days) starting today
      if (!isAvailableFor30DaysFrom(today)) {
         isInstock = false;
         
         // Find next available date (where it is free for 30 days) in the next 365 days
         for (let i = 1; i <= 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            if (isAvailableFor30DaysFrom(d)) {
               nextAvailableDate = d.toISOString();
               break;
            }
         }
      }
    } else if (cycle.quantity <= 0) {
       isInstock = false;
    }

    return {
      ...cycle,
      isInstock,
      nextAvailableDate
    };
  });

  return (
    <main>
      <div className={styles.hero} style={{ flexDirection: 'column', textAlign: 'center' }}>
        <Image src="/carousel_rental.png" alt="Bicycle Rentals" className={styles.heroImage} width={1920} height={1080} priority />
        <div className={styles.heroOverlay}></div>
        <h1 className={styles.title} style={{ marginBottom: '1rem' }}>Bicycle Rentals</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 2rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
          Discover our premium fleet of cycles. Well-maintained and comfortable, we have the perfect ride for hitting the trails or a casual weekend spin.
        </p>
        <div className={styles.noticeBox}>
          <strong>Important Note:</strong> For Weekly, Hourly, or Daily rentals, please <strong>DM us</strong> directly for custom bookings!
        </div>
      </div>
      
      <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '0 2rem' }}>
        <div style={{ height: '4rem' }}></div> {/* Spacer */}
        <RentalsView cycles={cyclesWithStockInfo} />

        {/* Additional Info Sections */}
        <div style={{ maxWidth: '1000px', margin: '3rem auto 0', paddingBottom: '3rem' }}>
          <SectionAccordion sections={[
            {
              title: 'Why Choose Us?',
              content: (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.5rem', paddingTop: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚲</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>Premium Fleet</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', fontSize: '0.95rem' }}>Top-quality geared and non-geared cycles, perfectly maintained for a smooth ride.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>Safety First</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', fontSize: '0.95rem' }}>Helmets and basic safety checks are always included with every rental.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏱️</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>Flexible Timings</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', fontSize: '0.95rem' }}>Rent by the hour, day, or week. We cater to all your scheduling needs via DM.</p>
                  </div>
                </div>
              )
            },
            {
              title: 'FAQs',
              content: (
                <div style={{ paddingTop: '1rem' }}>
                  <p><strong>Q: Do I need to leave a deposit?</strong><br/>A: Yes, a valid original ID (Aadhar/Driving License) must be deposited during the rental period.</p>
                  <p style={{marginTop: '10px'}}><strong>Q: What if the cycle gets damaged?</strong><br/>A: The rider is responsible for any physical damages during the rental period and will be charged accordingly.</p>
                  <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Link href="/faq" style={{ color: 'var(--primary, #1eb53a)', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      View all FAQs <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              )
            }
          ]} />
        </div>
      </div>
    </main>
  );
}
