import React from "react";
import { ServiceCard } from "../ui/ServiceCard";
import styles from "./ServicesSection.module.css";

const services = [
  {
    title: "Cycle Classes",
    description:
      "Join our high-energy indoor cycling sessions designed for all fitness levels. Burn calories and build endurance with expert instructors.",
    image:
      "/cycling classes visuals/cycling-classes/Wheelofit services-img1.jpg",
    href: "/rides/cycle-classes",
  },
  {
    title: "Mumbai Midnight Cycling",
    description:
      "Explore the empty streets of Mumbai under the moonlight. A safe, guided, and unforgettable nocturnal adventure.",
    image: "/midnight-cycling/IMG_9065_Original.jpg",
    href: "/rides/midnight-rides",
  },
  {
    title: "Sunday Morning Ride",
    description:
      "Breathe in the fresh morning air with our community. Scenic routes perfect for a refreshing start to your Sunday.",
    image: "/sunday-morning-cycling/IMG_1303.jpeg",
    href: "/rides/sunday-morning",
  },
  {
    title: "Cycle Rental",
    description:
      "Choose from our fleet of premium, well-maintained bicycles. Rent for a day, a week, or a month.",
    image: "/carousel_rental.png",
    href: "/rides/rentals",
  },
];

export function ServicesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Our <span className="text-gradient">Services</span>
          </h2>
        </div>
        <div className={styles.grid}>
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              image={service.image}
              href={service.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
