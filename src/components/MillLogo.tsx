import Image from "next/image";
import { IMAGES } from "@/lib/images";

type MillLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function MillLogo({ size = 48, className = "", priority = false }: MillLogoProps) {
  return (
    <Image
      src={IMAGES.logo}
      alt="Jayalakshmi Vilas Rice Mill — Melur"
      width={size}
      height={size}
      priority={priority}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
