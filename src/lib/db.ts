import { openDB, type DBSchema } from 'idb';
import bcrypt from 'bcryptjs';

interface GalleryDB extends DBSchema {
  users: {
    key: number;
    value: {
      id: number;
      username: string;
      password: string;
      role: string;
    };
    indexes: { 'by-username': string };
  };
  artworks: {
    key: number;
    value: {
      id: number;
      title: string;
      description: string;
      image_data: string; // Changed from image_path to image_data for base64
      upload_date: string;
    };
  };
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Artwork {
  id: number;
  title: string;
  description: string;
  image_data: string; // Changed from image_path to image_data
  upload_date: string;
}

export async function initDb() {
  return openDB<GalleryDB>('gallery-db', 1, {
    upgrade(db) {
      const userStore = db.createObjectStore('users', {
        keyPath: 'id',
        autoIncrement: true,
      });
      userStore.createIndex('by-username', 'username', { unique: true });

      db.createObjectStore('artworks', {
        keyPath: 'id',
        autoIncrement: true,
      });

      // Create default admin user
      const defaultAdmin = {
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
      };
      userStore.add(defaultAdmin);
    },
  });
}

const getDb = () => initDb();

export async function createUser(username: string, password: string) {
  const db = await getDb();
  const hashedPassword = await bcrypt.hash(password, 10);
  return db.add('users', {
    username,
    password: hashedPassword,
    role: 'user',
  });
}

export async function validateUser(username: string, password: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.getFromIndex('users', 'by-username', username);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getArtworks(): Promise<Artwork[]> {
  const db = await getDb();
  return db.getAll('artworks');
}

export async function addArtwork(artwork: Omit<Artwork, 'id' | 'upload_date'>) {
  const db = await getDb();
  return db.add('artworks', {
    ...artwork,
    upload_date: new Date().toISOString(),
  });
}

export async function updateArtwork(
  id: number,
  artwork: Partial<Omit<Artwork, 'id' | 'upload_date'>>
) {
  const db = await getDb();
  const existing = await db.get('artworks', id);
  if (!existing) throw new Error('Artwork not found');
  
  return db.put('artworks', {
    ...existing,
    ...artwork,
  });
}

export async function deleteArtwork(id: number) {
  const db = await getDb();
  return db.delete('artworks', id);
}