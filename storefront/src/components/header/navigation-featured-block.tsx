import Image from "next/image";
import { useState } from "react";

export const NavigationFeaturedBlock: React.FC<{ imageSrc: string; altText: string; title: string }> = ({ imageSrc, altText, title }) => {
  const [imageError, setImageError] = useState(false);

  return (
      <div className="relative aspect-[5/3] overflow-hidden rounded-xs group border border-gray-300 bg-gray-100">
        {!imageError ? (
          <Image
            src={imageSrc}
            alt={altText}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Image not found
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-30" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl md:text-2xl font-normal text-white">{title}</h3>
        </div>
      </div>
  );
};