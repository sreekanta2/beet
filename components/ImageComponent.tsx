"use client";
import { cn } from "@/lib/utils";
import Image, { ImageProps, StaticImageData } from "next/image";
import { useState } from "react";

type AspectRatio = "16/9" | "4/3" | "1/1" | "3/4" | "9/16" | "none";

interface OptimizedImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string | StaticImageData;
  alt: string;
  aspectRatio?: AspectRatio;
  priority?: boolean;
  className?: string;
  containerClass?: string;
}

const aspectRatioMap: Record<AspectRatio, string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "9/16": "aspect-[9/16]",
  none: "",
};

export default function CustomImage({
  src,
  alt = "profile.jpg",
  aspectRatio = "none",
  priority = true,
  className = "",
  containerClass = "",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`relative ${containerClass} ${aspectRatioMap[aspectRatio]}`}
    >
      <Image
        src={src}
        alt={alt}
        priority={priority}
        className={cn(
          "object-cover transition-[opacity,filter] duration-300",
          {
            "opacity-0 blur-sm": isLoading,
            "opacity-100 blur-none": !isLoading,
          },
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        fill={aspectRatio !== "none"}
        {...(aspectRatio === "none"
          ? { width: props.width, height: props.height }
          : {})}
        {...props}
      />
    </div>
  );
}
