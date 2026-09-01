'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { OptimizedImage as Image } from '@/components/ui/OptimizedImage';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import OptionWheel from '../react-bits/OptionWheel';
import styles from './Navbar.module.css';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { scrollY } = useScroll();
  const router = useRouter();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
    
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Cycle Classes", href: "/rides/cycle-classes" },
    { name: "Midnight Rides", href: "/rides/midnight-rides" },
    { name: "Sunday Morning", href: "/rides/sunday-morning" },
    { name: "Rentals", href: "/rides/rentals" },
    { name: "Check Ticket", href: "/find-ticket" },
  ];

  const currentNavIndex = navLinks.findIndex(l => l.href === pathname);
  const initialIndex = currentNavIndex !== -1 ? currentNavIndex : 0;

  return (
    <>
      <motion.nav 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      >
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo.png" alt="Wheelo.fit - Premium Cycling Experiences in Mumbai" className={styles.logoImage} width={55} height={55} />
            Wheelo.fit
          </Link>
          
          <div className={styles.actions}>
            <button className={styles.hamburger} onClick={toggleSidebar} aria-label="Toggle Menu">
              <span className={`${styles.line} ${isOpen ? styles.open : ''}`}></span>
              <span className={`${styles.line} ${isOpen ? styles.open : ''}`}></span>
              <span className={`${styles.line} ${isOpen ? styles.open : ''}`}></span>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.overlay} 
              onClick={toggleSidebar}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={styles.sidebar}
            >
              <div className={styles.sidebarHeader}>
                <h2>Menu</h2>
                <button className={styles.closeButton} onClick={toggleSidebar}>&times;</button>
              </div>
              <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: '450px', marginTop: '20px' }}>
                <OptionWheel
                  items={navLinks.map(l => l.name)}
                  defaultSelected={initialIndex}
                  textColor="#a6a6a6"
                  activeColor="#ffffff"
                  side="left"
                  fontSize={2.4}
                  spacing={1.4}
                  curve={1}
                  tilt={6}
                  blur={2}
                  fade={0.25}
                  smoothing={200}
                  inset={30}
                  loop={false}
                  draggable={true}
                  onChange={() => {}}
                  onItemSelect={(index: number) => {
                    toggleSidebar();
                    router.push(navLinks[index].href);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
