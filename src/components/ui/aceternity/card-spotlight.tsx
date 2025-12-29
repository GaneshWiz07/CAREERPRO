"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardSpotlightProps {
  radius?: number;
  color?: string;
  children: React.ReactNode;
  className?: string;
}

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "hsl(var(--primary) / 0.15)",
  className,
}: CardSpotlightProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "relative rounded-xl border border-border bg-card p-8 overflow-hidden",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${color}, transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
