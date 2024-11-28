import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getArtworks, addArtwork, updateArtwork, deleteArtwork, type Artwork } from '../lib/db';
import { ImageUpload } from '../components/ImageUpload';
import { Pencil, Trash2, Plus } from 'lucide-react';

export function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newImage, setNewImage] = useState<string>('');
  const [editImage, setEditImage] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadArtworks = async () => {
      const works = await getArtworks();
      setArtworks(works);
    };
    loadArtworks();
  }, [user, navigate]);

  const handleAddArtwork = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!newImage) {
      alert('Please select an image');
      return;
    }

    const newArtwork = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image_data: newImage,
    };

    await addArtwork(newArtwork);
    const works = await getArtworks();
    setArtworks(works);
    setNewImage('');
    (e.target as HTMLFormElement).reset();
  };

  const handleUpdateArtwork = async (
    id: number,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedArtwork = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      ...(editImage && { image_data: editImage }),
    };

    await updateArtwork(id, updatedArtwork);
    const works = await getArtworks();
    setArtworks(works);
    setEditingId(null);
    setEditImage('');
  };

  const handleDeleteArtwork = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      await deleteArtwork(id);
      const works = await getArtworks();
      setArtworks(works);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Artwork</h2>
        <form onSubmit={handleAddArtwork} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              name="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C17C74] focus:ring-[#C17C74]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <ImageUpload
              onImageSelect={setNewImage}
              defaultImage={newImage}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C17C74] focus:ring-[#C17C74]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C17C74] hover:bg-[#A86B64]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Artwork
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Artworks</h2>
          <div className="space-y-4">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="border rounded-lg p-4 flex items-start space-x-4"
              >
                <img
                  src={artwork.image_data}
                  alt={artwork.title}
                  className="w-32 h-32 object-cover rounded"
                />
                
                {editingId === artwork.id ? (
                  <form
                    onSubmit={(e) => handleUpdateArtwork(artwork.id, e)}
                    className="flex-1 space-y-4"
                  >
                    <input
                      name="title"
                      defaultValue={artwork.title}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C17C74] focus:ring-[#C17C74]"
                    />
                    <ImageUpload
                      onImageSelect={setEditImage}
                      defaultImage={editImage || artwork.image_data}
                    />
                    <textarea
                      name="description"
                      defaultValue={artwork.description}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C17C74] focus:ring-[#C17C74]"
                    />
                    <div className="space-x-2">
                      <button
                        type="submit"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[#C17C74] hover:bg-[#A86B64]"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditImage('');
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{artwork.title}</h3>
                    <p className="text-gray-500 mt-1">{artwork.description}</p>
                    <div className="mt-4 space-x-2">
                      <button
                        onClick={() => setEditingId(artwork.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteArtwork(artwork.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}