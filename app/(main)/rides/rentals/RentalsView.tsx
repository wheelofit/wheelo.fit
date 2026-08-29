'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import HeightChartModal from './HeightChartModal';

import { OptimizedImage as Image } from '@/components/ui/OptimizedImage';

export interface CycleData {
  id: string;
  category: string;
  isInstock: boolean;
  tyreSize: string;
  speed: string;
  bikeType: string;
  brakes: string;
  pricing: Array<{ durationValue: number; durationUnit: string; price: number; durationLabel?: string }>;
  type: string;
  imageUrl?: string;
  quantity: number;
  nextAvailableDate?: string | null;
}

export default function RentalsView({ cycles }: { cycles: CycleData[] }) {
  const router = useRouter();
  
  const [category, setCategory] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedTyreSizes, setSelectedTyreSizes] = useState<string[]>([]);
  const [selectedSpeeds, setSelectedSpeeds] = useState<string[]>([]);
  const [selectedBikeTypes, setSelectedBikeTypes] = useState<string[]>([]);
  const [selectedBrakes, setSelectedBrakes] = useState<string[]>([]);
  
  const [sortOption, setSortOption] = useState<string>('Newest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isHeightChartOpen, setIsHeightChartOpen] = useState(false);

  const categories = ['Non Gear', 'Gear', 'Premium', 'Kids'];
  const tyreSizes = ["14 Inches (3'0 - 3'6)", "16 Inches (3'6 - 3'1)", "20 Inches (4'0 - 4'7)", "24 Inches (4'6 - 5'2)", "26 Inches (5'0 - 6'6)", "27.5 Inches (5'4 - 6'2)", "29 Inches (5'8 - 6'4)"];
  const speeds = ['Single Speed', '7 (1x7) Gears', '8 (1x8) Gears', '9 (1x9) Gears', '14 (2x7) Gears', '21 (3x7) Gears'];
  const bikeTypes = ['MTB', 'Hybrid', 'Road Bike', 'Kids'];
  const brakes = ['Power', 'Disc', 'Hydraulic'];

  const toggleArrayItem = (arr: string[], item: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (arr.includes(item)) setter(arr.filter(i => i !== item));
    else setter([...arr, item]);
  };

  const getStartingPriceInfo = (cycle: CycleData) => {
    if (!cycle.pricing || cycle.pricing.length === 0) return { price: 0, unit: 'MONTHS' };
    const basePricing = cycle.pricing.reduce((min, p) => p.durationValue < min.durationValue ? p : min, cycle.pricing[0]);
    return { price: basePricing.price, unit: basePricing.durationUnit };
  };

  const filteredCycles = useMemo(() => {
    const filtered = cycles.filter(c => {
      if (category !== 'All' && c.category !== category) return false;
      if (inStockOnly && !c.isInstock) return false;
      if (selectedTyreSizes.length > 0 && c.tyreSize && !selectedTyreSizes.includes(c.tyreSize)) return false;
      if (selectedSpeeds.length > 0 && c.speed && !selectedSpeeds.includes(c.speed)) return false;
      if (selectedBikeTypes.length > 0 && c.bikeType && !selectedBikeTypes.includes(c.bikeType)) return false;
      if (selectedBrakes.length > 0 && c.brakes && !selectedBrakes.includes(c.brakes)) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortOption === 'Price: Low to High') {
        return getStartingPriceInfo(a).price - getStartingPriceInfo(b).price;
      } else if (sortOption === 'Price: High to Low') {
        return getStartingPriceInfo(b).price - getStartingPriceInfo(a).price;
      } else if (sortOption === 'Availability') {
        return (b.isInstock ? 1 : 0) - (a.isInstock ? 1 : 0);
      }
      return 0; // 'Newest' is default from backend ordering
    });
  }, [cycles, category, inStockOnly, selectedTyreSizes, selectedSpeeds, selectedBikeTypes, selectedBrakes, sortOption]);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
      <style>{`
        .rentals-topbar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #333;
          flex-wrap: nowrap;
        }
        .rentals-layout {
          display: flex;
          gap: 2rem;
          flex-direction: row;
        }
        .rentals-sidebar {
          width: 250px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .rentals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
          gap: 1.5rem;
        }
        .mobile-filter-btn {
          display: none;
        }
        .mobile-only-item {
          display: none !important;
        }
        .desktop-only-item {
          display: flex;
        }
        .mobile-categories {
          display: none;
        }
        .mobile-bottom-bar {
          display: none;
        }
        
        @media (max-width: 768px) {
          .rentals-topbar {
            flex-wrap: nowrap;
            justify-content: space-between;
            gap: 0.5rem;
          }
          .rentals-topbar > h1 {
            width: auto;
            margin-bottom: 0 !important;
            font-size: 1.15rem !important;
          }
          .rentals-topbar > label > span {
            font-size: 0.9rem !important;
          }
          .rentals-layout {
            flex-direction: column;
          }
          .rentals-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: #0a0a0a;
            z-index: 1000;
            padding: 2rem;
            overflow-y: auto;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: block;
          }
          .rentals-sidebar.open {
            transform: translateX(0);
          }
          .mobile-filter-btn {
            display: flex;
            background: transparent;
            color: '#fff';
            border: 1px solid #333;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            white-space: nowrap;
            align-items: center;
            gap: 0.5rem;
          }
          .mobile-only-item {
            display: flex !important;
          }
          .desktop-only-item {
            display: none !important;
          }
          .mobile-categories {
            display: block;
          }
          .mobile-bottom-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #0a0a0a;
            border-top: 1px solid #333;
            z-index: 100;
          }
          .mobile-bottom-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 1rem;
            background: transparent;
            color: #fff;
            border: none;
            font-size: 1rem;
            cursor: pointer;
          }
          .mobile-bottom-divider {
            width: 1px;
            background: #333;
            margin: 0.5rem 0;
          }
          .hide-on-mobile {
            display: none !important;
          }
          .rentals-layout {
            padding-bottom: 4rem;
          }
        }
      `}</style>
      
      {/* Combined Top Bar & Categories */}
      <div className="rentals-topbar" style={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'none' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', whiteSpace: 'nowrap', color: '#fff' }}>Cycle on rent</h1>
          
          <div className="desktop-only-item" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {['All', ...categories].map(c => (
              <button 
                key={c}
                onClick={() => setCategory(c)}
                style={{ 
                  padding: '0.4rem 1.2rem', 
                  borderRadius: '24px', 
                  border: 'none', 
                  background: category === c ? '#1eb53a' : '#1eb53a15',
                  color: category === c ? '#fff' : '#1eb53a',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  boxShadow: category === c ? '0 4px 6px rgba(30, 181, 58, 0.2)' : 'none'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap', color: '#fff' }}>
            <div style={{
              position: 'relative',
              width: '36px',
              height: '20px',
              background: inStockOnly ? '#1eb53a' : '#333',
              borderRadius: '12px',
              transition: 'background 0.3s'
            }}>
              <div style={{
                position: 'absolute',
                top: '2px',
                left: inStockOnly ? '18px' : '2px',
                width: '16px',
                height: '16px',
                background: '#fff',
                borderRadius: '50%',
                transition: 'left 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </div>
            <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Instock</span>
            <input 
              type="checkbox" 
              checked={inStockOnly} 
              onChange={e => setInStockOnly(e.target.checked)} 
              style={{ display: 'none' }} 
            />
          </label>
          
          <div className="hide-on-mobile" style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              style={{ background: 'transparent', color: '#1eb53a', border: '1px solid #1eb53a', padding: '0.4rem 1.2rem', borderRadius: '24px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
              {sortOption !== 'Newest' ? sortOption : 'Sort'}
            </button>
            
            {isSortDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', zIndex: 50, minWidth: '180px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                {['Newest', 'Price: Low to High', 'Price: High to Low', 'Availability'].map(option => (
                  <div 
                    key={option}
                    onClick={() => { setSortOption(option); setIsSortDropdownOpen(false); }}
                    style={{ padding: '0.8rem 1rem', color: sortOption === option ? '#1eb53a' : '#fff', cursor: 'pointer', background: sortOption === option ? '#222' : 'transparent', borderBottom: '1px solid #333', fontSize: '0.9rem' }}
                    onMouseOver={e => e.currentTarget.style.background = '#222'}
                    onMouseOut={e => e.currentTarget.style.background = sortOption === option ? '#222' : 'transparent'}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mobile-categories" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#fff', fontWeight: 'bold' }}>Category</h3>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'nowrap', 
          gap: '0.8rem', 
          overflowX: 'auto',
          paddingBottom: '0.8rem',
          paddingRight: '1rem'
        }}>
          <style>{`
            .mobile-categories div::-webkit-scrollbar {
              height: 4px;
            }
            .mobile-categories div::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 4px;
            }
            .mobile-categories div::-webkit-scrollbar-thumb {
              background: rgba(30, 181, 58, 0.5);
              border-radius: 4px;
            }
          `}</style>
          {['All', ...categories].map(c => (
            <button 
              key={`mobile-${c}`}
              onClick={() => setCategory(c)}
              style={{ 
                padding: '0.6rem 1.2rem', 
                borderRadius: '24px', 
                border: 'none', 
                background: category === c ? '#1eb53a' : '#1eb53a15', 
                color: category === c ? '#fff' : '#1eb53a',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontWeight: '600',
                fontSize: '0.9rem',
                flexShrink: 0
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="rentals-layout">
        {/* Sidebar */}
        <div className={`rentals-sidebar ${isFilterOpen ? 'open' : ''}`}>
          <div className="mobile-only-item" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem' }}>Filters</h2>
            <button onClick={() => setIsFilterOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Tyre Size
              <button 
                onClick={() => setIsHeightChartOpen(true)}
                style={{ background: 'transparent', border: 'none', color: '#1eb53a', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                Size Guide
              </button>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {tyreSizes.map(ts => (
                <label key={ts} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: '#ccc' }}>
                  <input type="checkbox" checked={selectedTyreSizes.includes(ts)} onChange={() => toggleArrayItem(selectedTyreSizes, ts, setSelectedTyreSizes)} style={{ width: '16px', height: '16px' }} />
                  {ts}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff' }}>Speed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {speeds.map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: '#ccc' }}>
                  <input type="checkbox" checked={selectedSpeeds.includes(s)} onChange={() => toggleArrayItem(selectedSpeeds, s, setSelectedSpeeds)} style={{ width: '16px', height: '16px' }} />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff' }}>Type</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {bikeTypes.map(bt => (
                <label key={bt} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: '#ccc' }}>
                  <input type="checkbox" checked={selectedBikeTypes.includes(bt)} onChange={() => toggleArrayItem(selectedBikeTypes, bt, setSelectedBikeTypes)} style={{ width: '16px', height: '16px' }} />
                  {bt}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff' }}>Brakes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {brakes.map(b => (
                <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: '#ccc' }}>
                  <input type="checkbox" checked={selectedBrakes.includes(b)} onChange={() => toggleArrayItem(selectedBrakes, b, setSelectedBrakes)} style={{ width: '16px', height: '16px' }} />
                  {b}
                </label>
              ))}
            </div>
          </div>
          
          <button 
            className="mobile-only-item"
            onClick={() => setIsFilterOpen(false)}
            style={{ width: '100%', padding: '1rem', background: '#1eb53a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '1rem', justifyContent: 'center', cursor: 'pointer' }}
          >
            Apply Filters
          </button>
        </div>

        {/* Grid */}
        <div style={{ flex: 1 }}>
          <div className="rentals-grid">
            {filteredCycles.map(cycle => (
              <div 
                key={cycle.id} 
                onClick={() => router.push(`/rides/rentals/${cycle.id}`)}
                style={{ background: '#1a1a1a', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', color: '#fff', position: 'relative', border: '1px solid #333', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                
                {/* Image area with light background and inner radius */}
                <div style={{ height: '220px', background: '#f5f4ef', position: 'relative', borderRadius: '16px 16px 0 0' }}>
                  {/* Top badges inside image area */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: '#1eb53a', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.9rem' }}>⚡</span> {cycle.category || 'Gear'}
                  </div>

                  {cycle.imageUrl ? (
                    <Image src={cycle.imageUrl} alt={cycle.type} width={400} height={300} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2rem' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>No Image</div>
                  )}
                  
                  {/* Out of stock badge on bottom right of image */}
                  {!cycle.isInstock && (
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <div style={{ background: '#dc2626', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Sold out</div>
                      <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        {cycle.nextAvailableDate 
                          ? `Available from ${new Date(cycle.nextAvailableDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}` 
                          : 'Currently unavailable'}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Details area */}
                <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#fff' }}>{cycle.type}</h3>
                  <p style={{ color: '#888', margin: '0 0 1.2rem 0', fontSize: '0.9rem' }}>
                    {cycle.bikeType || 'MTB'} | {cycle.tyreSize ? cycle.tyreSize.split('(')[1]?.replace(')', '') || cycle.tyreSize : "4'7 to 5'1 ft"}
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {(() => {
                        const priceInfo = getStartingPriceInfo(cycle);
                        return (
                          <>
                            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#fff' }}>₹ {priceInfo.price.toLocaleString()}</span>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}> {priceInfo.unit === 'MONTHS' ? '/ month' : priceInfo.unit === 'DAYS' ? '/ day' : ''}</span>
                          </>
                        );
                      })()}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/rides/rentals/${cycle.id}`);
                      }}
                      style={{ 
                        background: cycle.isInstock ? '#1eb53a' : 'transparent', 
                        color: cycle.isInstock ? '#fff' : '#1eb53a', 
                        border: cycle.isInstock ? 'none' : '1px solid #1eb53a', 
                        padding: '0.6rem 1.5rem', 
                        borderRadius: '24px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 10,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseOver={(e) => { if(cycle.isInstock) e.currentTarget.style.opacity = '0.8' }}
                      onMouseOut={(e) => { if(cycle.isInstock) e.currentTarget.style.opacity = '1' }}
                    >
                      {cycle.isInstock ? 'Select' : 'Pre-Book'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCycles.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: '#888' }}>
                No cycles match your selected filters.
              </div>
            )}
          </div>
        </div>
      </div>

      <HeightChartModal isOpen={isHeightChartOpen} onClose={() => setIsHeightChartOpen(false)} />

      {/* Mobile Bottom Bar for Sort & Filter */}
      <div className="mobile-bottom-bar">
        <button 
          className="mobile-bottom-btn"
          onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
          Sort
        </button>
        <div className="mobile-bottom-divider"></div>
        <button 
          className="mobile-bottom-btn"
          onClick={() => setIsFilterOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          Filter
        </button>
        
        {isSortDropdownOpen && (
          <div style={{ position: 'absolute', bottom: '100%', left: 0, width: '50%', background: '#1a1a1a', borderTop: '1px solid #333', borderRight: '1px solid #333', zIndex: 101 }}>
            {['Newest', 'Price: Low to High', 'Price: High to Low', 'Availability'].map(option => (
              <div 
                key={option}
                onClick={() => { setSortOption(option); setIsSortDropdownOpen(false); }}
                style={{ padding: '1rem', color: sortOption === option ? '#1eb53a' : '#fff', cursor: 'pointer', borderBottom: '1px solid #333' }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
