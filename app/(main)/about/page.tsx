import React from 'react';
import styles from '@/components/ui/InfoPage.module.css';

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>About Us</h1>
        <p className={styles.subtitle}>
          We are passionate about cycling, fitness, and building a community that pushes boundaries and explores the world on two wheels.
        </p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.textBlock}>
          <h2>Our Story</h2>
          <p>
            Founded in 2023 by Devansh Raviprakash Gupta, Wheelo.fit started with a simple mission: to make premium cycling experiences accessible to everyone. What began as a small group of enthusiasts doing midnight rides in Mumbai has now grown into a full-fledged fitness and outdoor adventure community.
          </p>
          <p>
            Whether you are looking to burn calories in our high-octane indoor studios, or catch the sunrise on our scenic Sunday rides, we have something for every rider.
          </p>
        </div>
        <div className={styles.glassCard}>
          <div className={styles.textBlock}>
            <h2>Our Core Values</h2>
            <p><strong>Community:</strong> We ride together. We support each other.</p>
            <p><strong>Excellence:</strong> We provide top-tier cycles and world-class instructors.</p>
            <p><strong>Safety:</strong> Your well-being is our top priority, both in the studio and on the road.</p>
            <p><strong>Sustainability:</strong> Promoting green, eco-friendly transportation and lifestyles.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
