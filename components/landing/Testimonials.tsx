"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import styles from "./Testimonials.module.css";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
}

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [
      AutoScroll({
        playOnInit: true,
        speed: 1,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  if (!testimonials || testimonials.length === 0) return null;

  // Ensure we have enough items to span a full ultra-wide monitor seamlessly
  let carouselItems = [...testimonials];
  while (carouselItems.length < 8) {
    carouselItems = [...carouselItems, ...testimonials];
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} font-mono`}>
          <h2 className={`${styles.title} uppercase tracking-widest`}>
            What <span className="text-gradient">Riders Say</span>
          </h2>
          <p className={`${styles.subtitle} text-sm opacity-80`}>
            Don&apos;t just take our word for it. Hear from the community that
            makes Wheelo special.
          </p>
        </div>

        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.embla__container}>
            {carouselItems.map((testimonial, i) => (
              <div
                key={`${testimonial.id}-${i}`}
                className={styles.embla__slide}
              >
                <div className={`${styles.card} blueprint-border`}>
                  <div className={`${styles.rating} text-[var(--primary)]`}>
                    {"★".repeat(testimonial.rating)}
                    {"☆".repeat(5 - testimonial.rating)}
                  </div>
                  <div className={`${styles.content} font-mono text-sm`}>
                    &quot;{testimonial.content}&quot;
                  </div>
                  <div className={styles.author}>
                    <div
                      className={`${styles.avatar} border border-[var(--primary)] rounded-none bg-[var(--surface)] font-mono`}
                    >
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={`${styles.authorInfo} font-mono uppercase text-xs`}
                    >
                      <h4 className="text-[var(--primary)]">
                        {testimonial.name}
                      </h4>
                      {testimonial.role && (
                        <p className="opacity-70">{testimonial.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
