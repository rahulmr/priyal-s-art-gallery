import React, { useState, useEffect } from 'react';
import { ArtworkGrid } from '../components/ArtworkGrid';
import { ArtworkDetail } from '../components/ArtworkDetail';
import { getArtworks, type Artwork } from '../lib/db';

export function HomePage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const loadArtworks = async () => {
      const works = await getArtworks();
      setArtworks(works);
    };
    loadArtworks();
  }, []);

  return (
    <div>
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Priyal Raut's Gallery
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore a curated collection of contemporary artworks that push the
          boundaries of imagination and creativity.
        </p>
      </header>

      <ArtworkGrid
        artworks={artworks}
        onArtworkClick={(artwork) => setSelectedArtwork(artwork)}
      />

      {selectedArtwork && (
        <ArtworkDetail
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
}