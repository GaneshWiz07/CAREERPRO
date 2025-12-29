"use client";

import React, { useId } from "react";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparklesProps {
  className?: string;
  size?: number;
  minSize?: number | null;
  density?: number;
  speed?: number;
  minSpeed?: number | null;
  opacity?: number;
  opacitySpeed?: number;
  minOpacity?: number | null;
  color?: string;
  background?: string;
  hover?: boolean;
}

export const SparklesCore = ({
  className,
  size = 1.5,
  minSize = null,
  density = 600,
  speed = 1,
  minSpeed = null,
  opacity = 1,
  opacitySpeed = 3,
  minOpacity = null,
  color = "hsl(var(--primary))",
  background = "transparent",
  hover = false,
}: SparklesProps) => {
  const id = useId();
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; size: number; duration: number; delay: number }>
  >([]);

  useEffect(() => {
    const particleCount = Math.floor(density / 10);
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: minSize ? Math.random() * (size - minSize) + minSize : size,
        duration: minSpeed
          ? Math.random() * (speed - minSpeed) + minSpeed
          : speed,
        delay: Math.random() * 2,
      });
    }
    setParticles(newParticles);
  }, [density, size, minSize, speed, minSpeed]);

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={{ background }}
    >
      {particles.map((particle, i) => (
        <motion.div
          key={`${id}-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: color,
          }}
          animate={{
            opacity: [minOpacity ?? 0, opacity, minOpacity ?? 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration * opacitySpeed,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
