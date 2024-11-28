import React from 'react';
import { X } from 'lucide-react';
import { type Artwork } from '../lib/db';

interface ArtworkDetailProps {
  artwork: Artwork;
  onClose: () => void;
}

export function ArtworkDetail({ artwork, onClose }: ArtworkDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{artwork.title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3">
            <img
              src={artwork.image_data}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="md:w-1/3 p-6">
            <div className="prose">
              <p className="text-gray-600">{artwork.description}</p>
              <p className="text-sm text-gray-500 mt-4">
                Added on {new Date(artwork.upload_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}