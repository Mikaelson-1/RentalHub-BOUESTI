"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";

interface SlideImage {
  src: string;
  alt: string;
}

interface HeroSlideshowProps {
  images: SlideImage[];
}

export default function HeroSlideshow({ images }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="rounded-2xl h-[280px] bg-gray-100 flex flex-col items-center justify-center gap-3">
        <Building2 className="w-10 h-10 text-gray-300" />
        <p className="text-gray-400 text-sm">Listings coming soon</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl h-[280px] overflow-hidden bg-gray-100">
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}

      {/* Decorative dots */}
      <div className="absolute top-4 left-4 w-3 h-3 bg-[#E67E22] rounded-full pointer-events-none" />
      <div className="absolute top-8 right-8 w-2 h-2 bg-[#192F59] rounded-full pointer-events-none" />

      {/* Navigation dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
