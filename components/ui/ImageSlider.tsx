'use client';

import React, { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

import styles from './ImageSlider.module.css';

interface ImageSliderProps {
  images: { id: string; img: string; }[];
}

export function ImageSlider({ images }: ImageSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [slidesInView, setSlidesInView] = useState<number[]>([0]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setSlidesInView((prev) => {
      const inView = emblaApi.slidesInView();
      return Array.from(new Set([...prev, ...inView]));
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('slidesInView', () => {
      setSlidesInView((prev) => {
        const inView = emblaApi.slidesInView();
        return Array.from(new Set([...prev, ...inView]));
      });
    });
    emblaApi.on('reInit', onSelect);
    
    // Initial trigger
    setTimeout(() => {
      setSlidesInView(Array.from(new Set([...emblaApi.slidesInView(), 0])));
    }, 0);

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => {
      clearInterval(autoplay);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('slidesInView', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) return null;

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {images.map((img, index) => {
            const isActive = index === selectedIndex;
            const hasBeenViewed = slidesInView.includes(index);
            
            return (
              <div className={styles.slide} key={img.id}>
                {hasBeenViewed ? (
                  <>
                    {/* Blurred Background Layer */}
                    <OptimizedImage 
                      src={img.img} 
                      alt="" 
                      className={styles.bgImage} 
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    <div className={styles.bgOverlay} />
                    
                    {/* Main Foreground Image */}
                    <div className={`${styles.imageWrapper} ${isActive ? styles.activeScale : ''}`}>
                      <OptimizedImage 
                        src={img.img} 
                        alt="Gallery image"
                        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className={styles.controls}>
        <button className={styles.btn} onClick={() => emblaApi?.scrollPrev()}>&#10094;</button>
        <button className={styles.btn} onClick={() => emblaApi?.scrollNext()}>&#10095;</button>
      </div>
    </div>
  );
}
