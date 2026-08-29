'use client';

import React, { useState } from 'react';
import RentalBookingForm from '@/app/(main)/rentals/RentalBookingForm';
import HeightChartModal from '../HeightChartModal';

import { OptimizedImage as Image } from '@/components/ui/OptimizedImage';
import { CycleData } from '../RentalsView';

export default function CycleDetailView({ cycle }: { cycle: CycleData }) {
  const [isHeightChartOpen, setIsHeightChartOpen] = useState(false);
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1rem 6rem 1rem' }}>
      
      <style>{`
        .mobile-only {
          display: none !important;
        }
        .desktop-form-container {
          display: flex;
          flex: 1 1 400px;
          flex-direction: column;
        }
        .mobile-close-btn {
          display: none !important;
        }
        @media (min-width: 769px) {
          .sticky-desktop {
            position: sticky;
            top: 120px;
            z-index: 10;
          }
        }
        @media (max-width: 768px) {
          .mobile-only {
            display: flex !important;
            flex-direction: column;
            width: 100%;
          }
          .desktop-only {
            display: none !important;
          }
          .desktop-form-container {
            display: ${isMobileFormOpen ? 'flex' : 'none'};
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #121212;
            z-index: 100;
            padding: 1.5rem;
            overflow-y: auto;
          }
          .mobile-close-btn {
            display: flex !important;
          }
        }
      `}</style>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Left Side: Cycle Display */}
        <div className="sticky-desktop" style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Out of stock banner attached to the image box */}
            {!cycle.isInstock && (
              <div style={{ 
                background: 'linear-gradient(90deg, #ef4444, #dc2626)', 
                color: '#fff', 
                padding: '0.8rem 1rem', 
                textAlign: 'center', 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                borderRadius: '16px 16px 0 0',
                letterSpacing: '0.5px'
              }}>
                {cycle.nextAvailableDate 
                  ? `Sold out for now. Pre-book for dates starting ${new Date(cycle.nextAvailableDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.` 
                  : 'Currently unavailable for rent.'}
              </div>
            )}

            <div style={{ background: '#f5f4ef', borderRadius: cycle.isInstock ? '16px' : '0 0 16px 16px', padding: '2rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>

              <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#eab30822', color: '#eab308', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                ⚡ {cycle.speed || 'Single Speed'}
              </div>
            
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
              {cycle.imageUrl ? (
                <Image src={cycle.imageUrl} alt={cycle.type} width={600} height={400} style={{ width: '100%', maxHeight: '350px', objectFit: 'contain' }} />
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No Image</div>
              )}
            </div>

            <div style={{ background: '#fef3c7', color: '#b45309', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', gap: '1rem' }}>
              <span>For Heights : {cycle.tyreSize ? cycle.tyreSize.split('(')[1]?.replace(')', '') : "4'7 to 5'1 ft"}</span>
              <span 
                onClick={() => setIsHeightChartOpen(true)}
                style={{ textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Height Chart
              </span>
            </div>
          </div>

          </div>

          <div className="mobile-only" style={{ background: '#1a1a1a', borderRadius: '16px', padding: '1.5rem', border: '1px solid #333', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>Monthly Rent Starts from</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
                ₹{cycle.pricing && cycle.pricing.length > 0 
                    ? (cycle.pricing.find(p => p.durationLabel?.toLowerCase() === '1 month')?.price 
                       || Math.max(...cycle.pricing.map(p => p.price)))
                    : '---'}/mo
              </span>
            </div>
            {cycle.isInstock ? (
              <button 
                onClick={() => setIsMobileFormOpen(true)}
                style={{ 
                  width: '100%',
                  padding: '1rem', 
                  background: 'linear-gradient(135deg, #e3ff00 0%, #a3e600 100%)', 
                  color: '#000', 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  border: 'none', 
                  borderRadius: '30px', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(227, 255, 0, 0.3)'
                }}
              >
                Book Now
              </button>
            ) : cycle.quantity > 0 ? (
              <button 
                onClick={() => setIsMobileFormOpen(true)}
                style={{ 
                  width: '100%',
                  padding: '1rem', 
                  background: 'transparent', 
                  color: '#1eb53a', 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  border: '2px solid #1eb53a', 
                  borderRadius: '30px', 
                  cursor: 'pointer'
                }}
              >
                Pre-Book
              </button>
            ) : (
              <button 
                disabled
                style={{ width: '100%', padding: '1rem', background: '#333', color: '#888', fontSize: '1.1rem', fontWeight: 'bold', border: 'none', borderRadius: '30px', cursor: 'not-allowed' }}
              >
                Sold Out
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Info & Booking */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="desktop-form-container">
            <div className="mobile-close-btn" style={{ justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button 
                onClick={() => setIsMobileFormOpen(false)} 
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', lineHeight: '1' }}
              >
                &times;
              </button>
            </div>
            <h1 style={{ fontSize: '2.2rem', margin: '0 0 1.5rem 0', color: '#fff' }}>{cycle.type}</h1>
            <RentalBookingForm 
              cycles={[cycle]} 
              preselectedCycleId={cycle.id} 
            />
          </div>

          <div style={{ background: '#0284c711', borderRadius: '16px', padding: '1.5rem', border: '1px solid #0284c722' }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#fff' }}>Specifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}><div style={{ flex: '0 0 130px', color: '#888' }}>Speed</div><div style={{ flex: 1, color: '#fff', fontWeight: '600' }}>{cycle.speed || 'Single Speed'}</div></div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}><div style={{ flex: '0 0 130px', color: '#888' }}>Brakes</div><div style={{ flex: 1, color: '#fff', fontWeight: '600' }}>{cycle.brakes || 'Power'}</div></div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}><div style={{ flex: '0 0 130px', color: '#888' }}>Tyre Size</div><div style={{ flex: 1, color: '#fff', fontWeight: '600', lineHeight: '1.4' }}>{cycle.tyreSize || '24 Inches'}</div></div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}><div style={{ flex: '0 0 130px', color: '#888' }}>Seat</div><div style={{ flex: 1, color: '#fff', fontWeight: '600' }}>Adjustable</div></div>
            </div>
          </div>

          <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '1.5rem', border: '1px solid #333' }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#fff' }}>Additional Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}><div style={{ flex: '0 0 130px', color: '#888' }}>Price Includes</div><div style={{ flex: 1, color: '#fff', fontWeight: '600', lineHeight: '1.4' }}>Lock, Seat Cover, Bottle Holder</div></div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}><div style={{ flex: '0 0 130px', color: '#888' }}>Security Deposit</div><div style={{ flex: 1, color: '#fff', fontWeight: '600' }}>Rs. 1,000</div></div>
            </div>
            
            <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '1.5rem', lineHeight: '1.4' }}>
              *Actual cycle may differ from the photo<br/>
              *Please go through our FAQs before availing any of our services. By subscribing to WheelO you are adhering to all our Terms & Conditions and Privacy Policy.
            </p>
          </div>
        </div>


      </div>

      <HeightChartModal isOpen={isHeightChartOpen} onClose={() => setIsHeightChartOpen(false)} />
    </div>
  );
}
