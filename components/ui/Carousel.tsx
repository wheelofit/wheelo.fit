'use client';

import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurText } from '../react-bits/BlurText';
import Link from 'next/link';
import { OptimizedImage as Image } from '@/components/ui/OptimizedImage';
import styles from './Carousel.module.css';

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  link: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
}

export function Carousel({ slides }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [slidesInView, setSlidesInView] = useState<number[]>([0]);

  const autoplayRef = React.useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 4000);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setSlidesInView((prev) => {
      const inView = emblaApi.slidesInView();
      return Array.from(new Set([...prev, ...inView]));
    });
    startAutoplay();
  }, [emblaApi, setSelectedIndex, startAutoplay]);

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
    
    setTimeout(() => {
      setSlidesInView(Array.from(new Set([...emblaApi.slidesInView(), 0])));
    }, 0);

    startAutoplay();

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('slidesInView', onSelect);
    };
  }, [emblaApi, onSelect, startAutoplay]);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;
            const hasBeenViewed = slidesInView.includes(index);
            
            return (
              <Link href={slide.link} className={styles.slide} key={slide.id}>
                {hasBeenViewed ? (
                  <>
                    <div className={styles.imageWrapper}>
                      <motion.div
                        className={styles.image}
                        initial={{ scale: 1 }}
                        animate={{ scale: isActive ? 1.05 : 1 }}
                        transition={{ duration: 8, ease: "linear" }}
                        style={{ position: 'relative', width: '100%', height: '100%' }}
                      >
                        <Image 
                          src={slide.image} 
                          alt={slide.title} 
                          fill
                          sizes="(max-width: 768px) 100vw, 1200px"
                          priority={index === 0}
                          style={{ objectFit: 'cover' }}
                        />
                      </motion.div>
                      <div className={styles.overlay} />
                    </div>
                  </>
                ) : (
                  <div className={styles.imageWrapper} style={{ background: '#000' }} />
                )}
                
                <div className={styles.content}>
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <BlurText 
                          text={slide.title} 
                          className={styles.title} 
                          delay={50}
                        />
                        <motion.p 
                          className={styles.subtitle}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                        >
                          {slide.subtitle}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
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
