"use client";

import Image from "next/image";

type Props = {
  size?: number;
  animated?: "hover-spin" | "float" | "pulse" | "breathe" | "spin-slow" | "none";
  className?: string;
  alt?: string;
};

export default function NoodleLogo({ size = 20, animated = "none", className = "", alt = "Noodle logo" }: Props) {
  const animClass =
    animated === "hover-spin"
      ? "transition-transform duration-300 group-hover:scale-110"
      : animated === "float"
        ? "animate-noodle-float"
        : animated === "pulse"
          ? "animate-noodle-pulse-glow"
          : animated === "breathe"
            ? "animate-noodle-breathe"
            : animated === "spin-slow"
              ? "animate-noodle-spin-slow"
              : "";

  return (
    <Image
      src="/logo.png"
      alt={alt}
      width={size}
      height={Math.round((size * 115) / 152)}
      className={`inline-block object-contain select-none ${animClass} ${className}`}
      style={{ width: size, height: "auto" }}
      priority
    />
  );
}

export function NoodleMark({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Noodle emblem"
      width={size}
      height={Math.round((size * 115) / 152)}
      className={`inline-block object-contain select-none ${className}`}
      style={{ width: size, height: "auto" }}
      priority
    />
  );
}
