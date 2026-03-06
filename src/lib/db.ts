import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { PlatformEvent, PlatformMedia } from '@/types';

interface EventDB extends DBSchema {
  events: {
    key: string;
    value: PlatformEvent;
    indexes: { 'by-status': string; 'by-created': string };
  };
  media: {
    key: string;
    value: PlatformMedia;
    indexes: { 'by-event': string; 'by-uploaded': string };
  };
}

const DB_NAME = 'event-platform';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<EventDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<EventDB>> {
  if (!dbPromise) {
    dbPromise = openDB<EventDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const eventStore = db.createObjectStore('events', { keyPath: 'id' });
        eventStore.createIndex('by-status', 'status');
        eventStore.createIndex('by-created', 'createdAt');

        const mediaStore = db.createObjectStore('media', { keyPath: 'id' });
        mediaStore.createIndex('by-event', 'eventId');
        mediaStore.createIndex('by-uploaded', 'uploadedAt');
      },
    });
  }
  return dbPromise;
}

export async function createEvent(event: PlatformEvent): Promise<void> {
  const db = await getDB();
  await db.put('events', event);
}

export async function getEvent(id: string): Promise<PlatformEvent | undefined> {
  const db = await getDB();
  return db.get('events', id);
}

export async function getAllEvents(): Promise<PlatformEvent[]> {
  const db = await getDB();
  return db.getAllFromIndex('events', 'by-created');
}

export async function updateEvent(event: PlatformEvent): Promise<void> {
  const db = await getDB();
  await db.put('events', event);
}

export async function deleteEvent(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('events', id);
  const media = await getMediaByEvent(id);
  for (const m of media) {
    await db.delete('media', m.id);
  }
}

export async function addMedia(media: PlatformMedia): Promise<void> {
  const db = await getDB();
  await db.put('media', media);
}

export async function getMediaByEvent(eventId: string): Promise<PlatformMedia[]> {
  const db = await getDB();
  return db.getAllFromIndex('media', 'by-event', eventId);
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('media', id);
}
