'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { OptimizedImage as Image } from '@/components/ui/OptimizedImage';

const proxyImage = (url: string) =>
  `/api/image-proxy?url=${encodeURIComponent(url)}`;
import { Play, Heart, MessageCircle } from 'lucide-react';
import styles from './InstagramWidget.module.css';

interface Post {
  id: string;
  type: 'post' | 'reel';
  image: string;
  link: string;
  likes: number;
  comments: number;
  caption: string;
  timestamp: string;
}

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

function formatCount(n: number): string {
  if (!n) return '–';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return n.toString();
}

export function InstagramWidget() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/instagram', { signal: controller.signal });
        const data = await response.json();

        if (response.ok && data.posts?.length > 0) {
          setPosts(data.posts);
        } else {
          setError(true);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('[InstagramWidget] fetch failed:', err);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    return () => controller.abort();
  }, []);

  // Fallback data if API fails (e.g., on Vercel)
  const displayPosts = (error || posts.length === 0) && !loading ? [
    { id: '1', type: 'reel', image: '/carousel_classes.png', link: 'https://www.instagram.com/wheelo.fit/', likes: 452, comments: 23, caption: 'Join our latest classes!', timestamp: '' },
    { id: '2', type: 'reel', image: '/carousel_midnight.png', link: 'https://www.instagram.com/wheelo.fit/', likes: 1205, comments: 89, caption: 'Midnight rides are back', timestamp: '' },
    { id: '3', type: 'reel', image: '/carousel_sunday.png', link: 'https://www.instagram.com/wheelo.fit/', likes: 830, comments: 45, caption: 'Sunday morning vibes', timestamp: '' },
    { id: '4', type: 'reel', image: '/carousel_rental.png', link: 'https://www.instagram.com/wheelo.fit/', likes: 320, comments: 12, caption: 'Rent your gear today', timestamp: '' },
  ] as Post[] : posts;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className={`${styles.title} font-mono uppercase`}>
              Follow Us on{' '}
              <span className="text-gradient">
                Instagram
              </span>
            </h2>
            <p className={`${styles.subtitle} font-mono text-sm opacity-80`}>
              Catch our latest updates, reels, and community stories.
            </p>
            {error && (
              <p className="font-mono text-xs text-red-400 mt-2">
                [SYS_ERR: LIVE_FETCH_FAILED. USING_LOCAL_CACHE]
              </p>
            )}
          </div>

          <Link
            href="https://www.instagram.com/wheelo.fit/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.followButton}
          >
            <InstagramIcon size={18} />
            <span>@wheelo.fit</span>
          </Link>
        </motion.div>

        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={`sk-${i}`} className={`${styles.postCard} ${styles.skeleton}`} />
              ))
            : displayPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.postCard} blueprint-border p-2`}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={error ? post.image : proxyImage(post.image)}
                    alt={post.caption || 'Wheelo.fit Instagram post'}
                    className={styles.image}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />

                  {post.type === 'reel' && (
                    <div className={styles.reelIcon}>
                      <Play size={22} fill="currentColor" />
                    </div>
                  )}

                  <div className={styles.overlay} style={{ background: 'linear-gradient(to top, rgba(9,18,11,0.9) 0%, rgba(9,18,11,0) 60%)' }}>
                    <div className={`${styles.stats} font-mono`}>
                      <div className={styles.stat}>
                        <Heart size={16} fill="currentColor" />
                        <span>{formatCount(post.likes)}</span>
                      </div>
                      <div className={styles.stat}>
                        <MessageCircle size={16} fill="currentColor" />
                        <span>{formatCount(post.comments)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
