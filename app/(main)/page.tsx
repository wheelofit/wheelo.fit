import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { HeroCarousel } from '@/components/landing/HeroCarousel';
import { AboutSection } from '@/components/landing/AboutSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import DomeGallery from '@/components/react-bits/DomeGallery';
import { TestimonialsSection } from '@/components/landing/Testimonials';
import { InstagramWidget } from '@/components/landing/InstagramWidget';

const galleryImages = [
  // Cycling classes visuals (Under 1MB)
  { src: '/cycling classes visuals/cycling-classes/Wheelofit cycling classes customer-1.jpg', alt: 'Cycling classes' },
  { src: '/cycling classes visuals/cycling-classes/Wheelofit cycling classes child-1.jpg', alt: 'Kids learning to cycle' },
  { src: '/cycling classes visuals/cycling-classes/Wheelofit cycling classes child-2.jpg', alt: 'Kids learning to cycle 2' },
  { src: '/cycling classes visuals/cycling-classes/Wheelofit cycling classes customer-2.jpg', alt: 'Cycling classes' },
  { src: '/cycling classes visuals/cycling-classes/Wheelofit cycling classes customer-3.jpg', alt: 'Cycling classes' },
  { src: '/cycling classes visuals/cycling-classes/Wheelofit National park cycling ride solo-tour.jpg', alt: 'National park ride' },
  { src: '/cycling classes visuals/cycling-classes/wheelofit-customer-4.jpg', alt: 'Cycling classes customer' },

  // Midnight cycling (Optimized size)
  { src: '/midnight-cycling/20260206_234829_Original.jpg', alt: 'Midnight ride in Mumbai' },
  { src: '/midnight-cycling/394f1e8d-0834-4654-877d-b26fc02f1964.jpg', alt: 'Community ride' },

  // Sunday morning cycling (Under 1MB)
  { src: '/sunday-morning-cycling/IMG_1301.jpeg', alt: 'Sunday morning cycling' },
  { src: '/sunday-morning-cycling/96234e23-b6af-466f-9045-abadd274fd8f.jpeg', alt: 'Coastal route' },
  { src: '/sunday-morning-cycling/cdec0adf-d6bb-4445-be4c-8480d493c13b.jpeg', alt: 'Morning sunrise' },
  { src: '/sunday-morning-cycling/A60632F4-8123-4B6A-8E8B-71EF9C10DB3E.jpeg', alt: 'Sunday morning coastal' }
];

export const metadata: Metadata = {
  title: "Wheelo.fit - Mumbai's Premier Cycling Community",
  description: "Join Wheelo.fit for midnight cycling rides in Mumbai, Sunday morning coastal rides, and premium high-octane cycling classes. Rent a cycle and join the community.",
  alternates: {
    canonical: "/",
  }
};

export default async function Home() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main>
      <HeroCarousel />
      <AboutSection />
      <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Step Into <span className="text-gradient">Our World</span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(240, 247, 242, 0.7)', lineHeight: '1' }}>
            Discover the rides and moments that bring the Wheelo community together.
          </p>
        </div>
        <div style={{ width: '100%', height: '700px', position: 'relative', overflow: 'hidden', maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)' }}>
          <DomeGallery images={galleryImages} overlayBlurColor="transparent" />
        </div>
      </section>
      <ServicesSection />
      <InstagramWidget />
      <TestimonialsSection testimonials={testimonials} />
    </main>
  );
}
