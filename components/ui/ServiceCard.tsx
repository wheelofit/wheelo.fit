import React from 'react';
import Link from 'next/link';
import { OptimizedImage as Image } from '@/components/ui/OptimizedImage';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  icon?: string;
  href?: string;
}

export function ServiceCard({ title, description, image, href }: ServiceCardProps) {
  const CardContent = (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image src={image} alt={title} className={styles.image} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <button className={styles.btn}>Explore &#8594;</button>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} style={{ textDecoration: 'none' }}>
      {CardContent}
    </Link>
  ) : CardContent;
}
