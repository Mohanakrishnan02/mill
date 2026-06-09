import Image from "next/image";
import { isImageUrl } from "@/lib/images";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  className = "object-cover",
  fill = true,
  sizes = "(max-width: 640px) 50vw, 25vw",
  priority = false,
}: ProductImageProps) {
  if (!isImageUrl(src)) {
    return (
      <span className={`flex items-center justify-center text-5xl ${className}`}>
        {src}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
