import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  defaultImage?: string;
}

export function ImageUpload({ onImageSelect, defaultImage }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {defaultImage && (
        <img
          src={defaultImage}
          alt="Preview"
          className="w-full h-48 object-cover rounded-lg"
        />
      )}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-[#C17C74] transition-colors"
      >
        <div className="flex flex-col items-center">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}