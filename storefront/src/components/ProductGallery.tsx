"use client";

import Image from "next/image";
import { useState, useRef } from "react";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, bgX: 0, bgY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Position relative to the container
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Percentages for the background position of the zoomed image
    const bgX = (x / width) * 100;
    const bgY = (y / height) * 100;

    setMousePos({ x, y, bgX, bgY });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Desktop Thumbnails */}
      <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
        {images.map((img, idx) => (
          <button 
            key={idx} 
            onMouseEnter={() => setSelectedImage(idx)}
            onClick={() => setSelectedImage(idx)}
            className={`w-full aspect-square relative rounded-lg overflow-hidden border-2 bg-white transition-all ${idx === selectedImage ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-400'}`}
          >
            <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-1" />
          </button>
        ))}
      </div>
      
      {/* Main Container */}
      <div 
        ref={containerRef}
        className="flex-grow relative aspect-square bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden cursor-none group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <span className="absolute top-4 left-4 z-20 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest shadow-glow pointer-events-none">HOT</span>
        
        {/* Normal Image */}
        <div className="w-full h-full relative">
          <Image 
            src={images[selectedImage]} 
            alt={title} 
            fill 
            className="object-contain p-6"
            priority 
          />
        </div>

        {/* Magnifier Box */}
        {isZoomed && (
          <div 
            className="hidden md:block absolute pointer-events-none border-2 border-gray-300 shadow-2xl bg-white overflow-hidden z-50"
            style={{
              width: "250px", // Size of the zoom box
              height: "200px",
              left: `${mousePos.x - 125}px`, // Center the box on cursor
              top: `${mousePos.y - 100}px`,
              backgroundImage: `url(${images[selectedImage]})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "800px 800px", // Fixed zoom scale
              backgroundPosition: `${mousePos.bgX}% ${mousePos.bgY}%`
            }}
          />
        )}

        {/* Mobile indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
          {images.map((_, idx) => (
            <div key={idx} className={`w-2 h-2 rounded-full ${idx === selectedImage ? 'bg-primary w-4' : 'bg-white/50'} transition-all`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
