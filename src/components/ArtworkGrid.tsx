import React from 'react';
import { type Artwork } from '../lib/db';

interface ArtworkGridProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

export function ArtworkGrid({ artworks, onArtworkClick }: ArtworkGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <div
          key={artwork.id}
          className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          onClick={() => onArtworkClick(artwork)}
        >
          <img
            src={artwork.image_data}
            alt={artwork.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-lg font-semibold">{artwork.title}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}