"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function GridBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-full w-full bg-background bg-grid-small-foreground/[0.05] relative flex items-center justify-center",
        className
      )}
    >
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {children}
    </div>
  );
}

export function DotBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-full w-full bg-background bg-dot-foreground/[0.2] relative flex items-center justify-center",
        className
      )}
    >
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {children}
    </div>
  );
}
