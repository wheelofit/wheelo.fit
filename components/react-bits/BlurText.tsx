"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const BlurText = ({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const chars = containerRef.current?.querySelectorAll(".blur-char");
      if (!chars) return;

      gsap.fromTo(
        chars,
        { filter: "blur(10px)", opacity: 0, y: 20 },
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.04,
          delay: delay / 1000,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className}>
      {text.split(" ").map((word, wordIndex, wordsArray) => (
        <span
          key={wordIndex}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {word.split("").map((char, charIndex) => (
            <span
              key={charIndex}
              className="blur-char"
              style={{
                display: "inline-block",
                willChange: "filter, opacity, transform",
              }}
            >
              {char}
            </span>
          ))}
          {wordIndex < wordsArray.length - 1 && (
            <span style={{ display: "inline-block", whiteSpace: "pre" }}>
              {" "}
            </span>
          )}
        </span>
      ))}
    </div>
  );
};
