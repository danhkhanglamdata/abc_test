# Event Platform - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build 2 core features: Event Creation with QR Code + User Participation via QR + Display Mode

**Architecture:** React 18 + Vite + TypeScript + Tailwind CSS, localStorage/IndexedDB for storage, hash routing for simplicity

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, qrcode (QR generation), idb (IndexedDB wrapper), jszip (export)

---

## Decision: Open Questions

| Question | Decision | Reason |
|----------|----------|--------|
| URL routing | Hash routing | Simpler for client-side only, no server needed |
| ID generation | nanoid | Short (8-10 chars), URL-friendly |
| Image compression | 80% JPEG | Good balance quality/size |
| Thumbnail size | 300px width | Optimal for gallery display |

---

## Phase 1: Project Setup

### Task 1: Initialize Vite React TypeScript Project

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/index.css`

**Step 1: Create package.json**

```json
{
  "name": "event-platform",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "zustand": "^4.5.0",
    "qrcode": "^1.5.3",
    "idb": "^8.0.0",
    "jszip": "^3.10.1",
    "nanoid": "^5.0.5",
    "lucide-react": "^0.330.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@types/qrcode": "^1.5.5",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.2",
    "vite": "^5.1.4"
  }
}
```

**Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 4: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color, #6366f1)',
      },
    },
  },
  plugins: [],
}
```

**Step 5: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 6: Create index.html**

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Event Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 7: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-color: #6366f1;
}

* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  min-height: 100vh;
}
```

**Step 8: Create src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 9: Create src/App.tsx (placeholder)**

```typescript
import { HashRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-white">
        <h1>Event Platform</h1>
      </div>
    </HashRouter>
  )
}

export default App
```

**Step 10: Install dependencies**

```bash
npm install
```

**Step 11: Verify dev server starts**

```bash
npm run dev
```
Expected: Dev server running at http://localhost:5173

**Step 12: Commit**

```bash
git add .
git commit -m "feat: initialize Vite React TypeScript project"
```

---

### Task 2: Create Type Definitions

**Files:**
- Create: `src/types/index.ts`

**Step 1: Write type definitions**

```typescript
export interface Event {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  banners: string[];
  primaryColor: string;
  requireInfo: boolean;
  infoFields: InfoField[];
  status: 'draft' | 'active' | 'ended';
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  eventId: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  uploaderName?: string;
  uploadedAt: string;
}

export interface InfoField {
  id: string;
  label: string;
  required: boolean;
  type: 'text' | 'email' | 'phone';
}

export interface EventStats {
  participants: number;
  mediaCount: number;
  views: number;
}
```

**Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

## Phase 2: Data Layer (IndexedDB)

### Task 3: Create IndexedDB Service

**Files:**
- Create: `src/lib/db.ts`

**Step 1: Write IndexedDB service**

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Event, Media } from '@/types';

interface EventDB extends DBSchema {
  events: {
    key: string;
    value: Event;
    indexes: { 'by-status': string; 'by-created': string };
  };
  media: {
    key: string;
    value: Media;
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

export async function createEvent(event: Event): Promise<void> {
  const db = await getDB();
  await db.put('events', event);
}

export async function getEvent(id: string): Promise<Event | undefined> {
  const db = await getDB();
  return db.get('events', id);
}

export async function getAllEvents(): Promise<Event[]> {
  const db = await getDB();
  return db.getAllFromIndex('events', 'by-created');
}

export async function updateEvent(event: Event): Promise<void> {
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

export async function addMedia(media: Media): Promise<void> {
  const db = await getDB();
  await db.put('media', media);
}

export async function getMediaByEvent(eventId: string): Promise<Media[]> {
  const db = await getDB();
  return db.getAllFromIndex('media', 'by-event', eventId);
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('media', id);
}
```

**Step 2: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add IndexedDB service"
```

---

## Phase 3: State Management (Zustand)

### Task 4: Create Event Store

**Files:**
- Create: `src/stores/eventStore.ts`

**Step 1: Write event store**

```typescript
import { create } from 'zustand';
import { Event } from '@/types';
import { createEvent, getEvent, getAllEvents, updateEvent, deleteEvent as dbDeleteEvent } from '@/lib/db';
import { nanoid } from 'nanoid';

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  loadEvents: () => Promise<void>;
  loadEvent: (id: string) => Promise<void>;
  createEvent: (data: Omit<Event, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateEvent: (id: string, data: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  setCurrentEvent: (event: Event | null) => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  currentEvent: null,
  loading: false,

  loadEvents: async () => {
    set({ loading: true });
    const events = await getAllEvents();
    set({ events: events.reverse(), loading: false });
  },

  loadEvent: async (id: string) => {
    set({ loading: true });
    const event = await getEvent(id);
    set({ currentEvent: event || null, loading: false });
  },

  createEvent: async (data) => {
    const id = nanoid(10);
    const now = new Date().toISOString();
    const event: Event = {
      ...data,
      id,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    await createEvent(event);
    set((state) => ({ events: [event, ...state.events] }));
    return id;
  },

  updateEvent: async (id: string, data: Partial<Event>) => {
    const { currentEvent, events } = get();
    if (currentEvent?.id === id) {
      const updated = { ...currentEvent, ...data, updatedAt: new Date().toISOString() };
      await updateEvent(updated);
      set({
        currentEvent: updated,
        events: events.map((e) => (e.id === id ? updated : e)),
      });
    }
  },

  deleteEvent: async (id: string) => {
    await dbDeleteEvent(id);
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
      currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
    }));
  },

  setCurrentEvent: (event) => set({ currentEvent: event }),
}));
```

**Step 2: Commit**

```bash
git add src/stores/eventStore.ts
git commit -m "feat: add event store with Zustand"
```

---

### Task 5: Create Media Store

**Files:**
- Create: `src/stores/mediaStore.ts`

**Step 1: Write media store**

```typescript
import { create } from 'zustand';
import { Media } from '@/types';
import { addMedia, getMediaByEvent, deleteMedia as dbDeleteMedia } from '@/lib/db';
import { nanoid } from 'nanoid';

interface MediaState {
  media: Media[];
  loading: boolean;
  loadMedia: (eventId: string) => Promise<void>;
  addMedia: (data: Omit<Media, 'id' | 'uploadedAt'>) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
}

export const useMediaStore = create<MediaState>((set) => ({
  media: [],
  loading: false,

  loadMedia: async (eventId: string) => {
    set({ loading: true });
    const media = await getMediaByEvent(eventId);
    set({ media: media.reverse(), loading: false });
  },

  addMedia: async (data) => {
    const id = nanoid(10);
    const media: Media = {
      ...data,
      id,
      uploadedAt: new Date().toISOString(),
    };
    await addMedia(media);
    set((state) => ({ media: [media, ...state.media] }));
  },

  deleteMedia: async (id: string) => {
    await dbDeleteMedia(id);
    set((state) => ({ media: state.media.filter((m) => m.id !== id) }));
  },
}));
```

**Step 2: Commit**

```bash
git add src/stores/mediaStore.ts
git commit -m "feat: add media store with Zustand"
```

---

## Phase 4: Components - Event Creation

### Task 6: Create Event Form Component

**Files:**
- Create: `src/components/EventForm.tsx`

**Step 1: Write EventForm component**

```typescript
import { useState } from 'react';
import { Event, InfoField } from '@/types';
import { useEventStore } from '@/stores/eventStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Image, Clock, MapPin } from 'lucide-react';

interface EventFormProps {
  event?: Event;
}

export function EventForm({ event }: EventFormProps) {
  const navigate = useNavigate();
  const createEvent = useEventStore((s) => s.createEvent);
  const updateEvent = useEventStore((s) => s.updateEvent);

  const [form, setForm] = useState({
    name: event?.name || '',
    description: event?.description || '',
    startDate: event?.startDate || '',
    endDate: event?.endDate || '',
    location: event?.location || '',
    primaryColor: event?.primaryColor || '#6366f1',
    requireInfo: event?.requireInfo || false,
  });
  const [infoFields, setInfoFields] = useState<InfoField[]>(event?.infoFields || []);
  const [banners, setBanners] = useState<string[]>(event?.banners || []);
  const [submitting, setSubmitting] = useState(false);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setBanners((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeBanner = (index: number) => {
    setBanners((prev) => prev.filter((_, i) => i !== index));
  };

  const addInfoField = () => {
    setInfoFields((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: '', required: false, type: 'text' },
    ]);
  };

  const updateInfoField = (id: string, data: Partial<InfoField>) => {
    setInfoFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
  };

  const removeInfoField = (id: string) => {
    setInfoFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate) return;

    setSubmitting(true);
    try {
      if (event) {
        await updateEvent(event.id, { ...form, infoFields, banners });
        navigate(`/event/${event.id}`);
      } else {
        const id = await createEvent({ ...form, infoFields, banners });
        await updateEvent(id, { status: 'active' });
        navigate(`/event/${id}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên sự kiện *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          required
          placeholder="Nhập tên sự kiện"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value.slice(0, 500) })}
          className="w-full border rounded-lg px-4 py-2 resize-none"
          rows={3}
          placeholder="Mô tả sự kiện (tối đa 500 ký tự)"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{form.description.length}/500</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            <Clock className="inline w-4 h-4 mr-1" />
            Bắt đầu *
          </label>
          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            <Clock className="inline w-4 h-4 mr-1" />
            Kết thúc *
          </label>
          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          <MapPin className="inline w-4 h-4 mr-1" />
          Địa điểm
        </label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Nhập địa điểm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          <Image className="inline w-4 h-4 mr-1" />
          Banner (có thể chọn nhiều)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleBannerUpload}
          className="w-full border rounded-lg px-4 py-2"
        />
        {banners.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {banners.map((banner, i) => (
              <div key={i} className="relative">
                <img src={banner} alt={`Banner ${i + 1}`} className="w-full h-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeBanner(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Màu chủ đạo</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={form.primaryColor}
            onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
            className="w-12 h-12 rounded cursor-pointer"
          />
          <input
            type="text"
            value={form.primaryColor}
            onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.requireInfo}
            onChange={(e) => setForm({ ...form, requireInfo: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium">Yêu cầu người tham gia nhập thông tin</span>
        </label>
      </div>

      {form.requireInfo && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Trường thông tin</label>
            <button
              type="button"
              onClick={addInfoField}
              className="text-sm text-blue-600 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Thêm trường
            </button>
          </div>
          {infoFields.map((field) => (
            <div key={field.id} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateInfoField(field.id, { label: e.target.value })}
                placeholder="Tên trường"
                className="flex-1 border rounded px-3 py-1"
              />
              <select
                value={field.type}
                onChange={(e) => updateInfoField(field.id, { type: e.target.value as InfoField['type'] })}
                className="border rounded px-2 py-1"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="phone">SĐT</option>
              </select>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateInfoField(field.id, { required: e.target.checked })}
                />
                Bắt buộc
              </label>
              <button type="button" onClick={() => removeInfoField(field.id)} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Đang lưu...' : event ? 'Cập nhật sự kiện' : 'Tạo sự kiện'}
      </button>
    </form>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/EventForm.tsx
git commit -m "feat: add EventForm component"
```

---

## Phase 5: Components - QR Code

### Task 7: Create QR Code Component

**Files:**
- Create: `src/components/QRCode.tsx`

**Step 1: Write QRCode component**

```typescript
import { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  download?: boolean;
}

export function QRCode({ value, size = 300, download = false }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    }
  }, [value, size]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} />
      {download && (
        <button
          onClick={handleDownload}
          className="text-sm text-blue-600 hover:underline"
        >
          Tải QR Code (PNG)
        </button>
      )}
    </div>
  );
}

export function generateEventURL(eventId: string): string {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#/event/${eventId}`;
}
```

**Step 2: Commit**

```bash
git add src/components/QRCode.tsx
git commit -m "feat: add QRCode component"
```

---

## Phase 6: Components - Event Page (Tabs)

### Task 8: Create Tab Navigation

**Files:**
- Create: `src/components/TabNav.tsx`

**Step 1: Write TabNav component**

```typescript
import { Info, Image, Upload } from 'lucide-react';

interface TabNavProps {
  tabs: { id: string; label: string; icon: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function TabNav({ tabs, activeTab, onChange }: TabNavProps) {
  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export const EVENT_TABS = [
  { id: 'info', label: 'Thông tin', icon: <Info className="w-4 h-4" /> },
  { id: 'gallery', label: 'Thư viện', icon: <Image className="w-4 h-4" /> },
  { id: 'upload', label: 'Tải lên', icon: <Upload className="w-4 h-4" /> },
];
```

**Step 2: Commit**

```bash
git add src/components/TabNav.tsx
git commit -m "feat: add TabNav component"
```

---

### Task 9: Create Info Tab Component

**Files:**
- Create: `src/components/InfoTab.tsx`

**Step 1: Write InfoTab component**

```typescript
import { Event } from '@/types';
import { Clock, MapPin } from 'lucide-react';

interface InfoTabProps {
  event: Event;
}

export function InfoTab({ event }: InfoTabProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {event.banners?.[0] && (
        <img
          src={event.banners[0]}
          alt={event.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      <h1 className="text-2xl font-bold">{event.name}</h1>

      <div className="space-y-2 text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span>
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{event.location}</span>
          </div>
        )}

        {event.description && (
          <p className="mt-4 text-gray-700 whitespace-pre-wrap">{event.description}</p>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/InfoTab.tsx
git commit -m "feat: add InfoTab component"
```

---

### Task 10: Create Gallery Tab Component

**Files:**
- Create: `src/components/GalleryTab.tsx`

**Step 1: Write GalleryTab component**

```typescript
import { useState } from 'react';
import { Media } from '@/types';
import { useMediaStore } from '@/stores/mediaStore';
import { Trash2, ExternalLink } from 'lucide-react';

interface GalleryTabProps {
  eventId: string;
  canDelete?: boolean;
}

export function GalleryTab({ eventId, canDelete = false }: GalleryTabProps) {
  const { media, deleteMedia, loadMedia } = useMediaStore();
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa?')) {
      await deleteMedia(id);
    }
  };

  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Chưa có ảnh nào</p>
        <p className="text-sm">Hãy là người đầu tiên tải ảnh lên!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
        {media.map((item) => (
          <div key={item.id} className="break-inside-avoid relative group">
            <img
              src={item.thumbnail || item.url}
              alt=""
              className="w-full rounded cursor-pointer"
              onClick={() => setLightbox(item.url)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => setLightbox(item.url)}
                className="p-2 bg-white rounded-full"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              {canDelete && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-500 text-white rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/GalleryTab.tsx
git commit -m "feat: add GalleryTab component with masonry layout"
```

---

### Task 11: Create Upload Tab Component

**Files:**
- Create: `src/components/UploadTab.tsx`

**Step 1: Write UploadTab component**

```typescript
import { useState, useRef } from 'react';
import { useMediaStore } from '@/stores/mediaStore';
import { useEventStore } from '@/stores/eventStore';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadTabProps {
  eventId: string;
  requireInfo: boolean;
  infoFields: Event['infoFields'];
}

export function UploadTab({ eventId, requireInfo, infoFields }: UploadTabProps) {
  const { addMedia, loading } = useMediaStore();
  const [uploaderName, setUploaderName] = useState('');
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUpload = !requireInfo || (uploaderName && infoFields.every((f) => !f.required || customFields[f.id]));

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !canUpload) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const { url, thumbnail } = await resizeImage(file);
        await addMedia({
          eventId,
          type: 'image',
          url,
          thumbnail,
          uploaderName: uploaderName || 'Khách',
        });
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setUploading(false);
    }
  };

  const resizeImage = async (file: File): Promise<{ url: string; thumbnail: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;

          // Full size (max 2MB)
          const maxSize = 1920;
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const url = canvas.toDataURL('image/jpeg', 0.8);

          // Thumbnail (300px)
          const thumbCanvas = document.createElement('canvas');
          const thumbCtx = thumbCanvas.getContext('2d')!;
          thumbCanvas.width = 300;
          thumbCanvas.height = (300 / width) * height;
          thumbCtx.drawImage(img, 0, 0, thumbCanvas.width, thumbCanvas.height);
          const thumbnail = thumbCanvas.toDataURL('image/jpeg', 0.7);

          resolve({ url, thumbnail });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-4">
      {requireInfo && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tên của bạn *</label>
            <input
              type="text"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Nhập tên"
              required
            />
          </div>
          {infoFields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium mb-1">
                {field.label} {field.required && '*'}
              </label>
              <input
                type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                value={customFields[field.id] || ''}
                onChange={(e) => setCustomFields({ ...customFields, [field.id]: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required={field.required}
              />
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !canUpload}
          className="flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <ImageIcon className="w-8 h-8 text-gray-400" />
          <span className="text-sm font-medium">Chọn từ thư viện</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !canUpload}
          className="flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <Camera className="w-8 h-8 text-gray-400" />
          <span className="text-sm font-medium">Chụp ảnh mới</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploading && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Đang tải lên...</span>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/UploadTab.tsx
git commit -m "feat: add UploadTab component with image processing"
```

---

## Phase 7: Pages

### Task 12: Create Event Page

**Files:**
- Create: `src/pages/EventPage.tsx`

**Step 1: Write EventPage component**

```typescript
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEventStore } from '@/stores/eventStore';
import { useMediaStore } from '@/stores/mediaStore';
import { TabNav, EVENT_TABS } from '@/components/TabNav';
import { InfoTab } from '@/components/InfoTab';
import { GalleryTab } from '@/components/GalleryTab';
import { UploadTab } from '@/components/UploadTab';
import { QRCode, generateEventURL } from '@/components/QRCode';
import { Loader2, QrCode } from 'lucide-react';

export function EventPage() {
  const { id } = useParams<{ id: string }>();
  const { currentEvent: event, loadEvent, loading } = useEventStore();
  const { loadMedia } = useMediaStore();
  const [activeTab, setActiveTab] = useState('info');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent(id);
      loadMedia(id);
    }
  }, [id]);

  if (loading || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="font-semibold truncate">{event.name}</h1>
          <button onClick={() => setShowQR(!showQR)} className="p-2 hover:bg-gray-100 rounded">
            <QrCode className="w-5 h-5" />
          </button>
        </div>

        {showQR && (
          <div className="p-4 border-b bg-gray-50">
            <QRCode value={generateEventURL(event.id)} size={200} download />
            <p className="text-xs text-center mt-2 text-gray-500">Quét để tham gia sự kiện</p>
          </div>
        )}

        <TabNav tabs={EVENT_TABS} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-4">
          {activeTab === 'info' && <InfoTab event={event} />}
          {activeTab === 'gallery' && <GalleryTab eventId={event.id} />}
          {activeTab === 'upload' && (
            <UploadTab eventId={event.id} requireInfo={event.requireInfo} infoFields={event.infoFields} />
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/pages/EventPage.tsx
git commit -m "feat: add EventPage with tabbed interface"
```

---

### Task 13: Create Dashboard Page

**Files:**
- Create: `src/pages/Dashboard.tsx`

**Step 1: Write Dashboard component**

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '@/stores/eventStore';
import { useMediaStore } from '@/stores/mediaStore';
import { Plus, Trash2, ExternalLink, Loader2, QrCode, BarChart3 } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function Dashboard() {
  const navigate = useNavigate();
  const { events, loadEvents, loading, deleteEvent } = useEventStore();
  const { media, loadMedia } = useMediaStore();

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sự kiện này?')) {
      await deleteEvent(id);
    }
  };

  const handleExport = async (eventId: string) => {
    await loadMedia(eventId);
    const zip = new JSZip();
    const folder = zip.folder('event-' + eventId);

    // Add images
    const imgFolder = folder!.folder('images');
    media.forEach((m, i) => {
      const base64Data = m.url.split(',')[1];
      imgFolder!.file(`photo-${i + 1}.jpg`, base64Data, { base64: true });
    });

    // Add metadata
    const event = events.find((e) => e.id === eventId);
    folder!.file('event.json', JSON.stringify(event, null, 2));
    folder!.file('media.json', JSON.stringify(media, null, 2));

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `event-${eventId}.zip`);
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý sự kiện</h1>
        <button
          onClick={() => navigate('/create')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Tạo sự kiện
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Chưa có sự kiện nào</p>
          <button onClick={() => navigate('/create')} className="text-blue-600 hover:underline mt-2">
            Tạo sự kiện đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{event.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.startDate).toLocaleDateString('vi-VN')} -{' '}
                    {new Date(event.endDate).toLocaleDateString('vi-VN')}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => navigate(`/event/${event.id}`)}
                      className="text-sm text-blue-600 flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" /> Xem
                    </button>
                    <button
                      onClick={() => navigate(`/event/${event.id}/display`)}
                      className="text-sm text-purple-600 flex items-center gap-1"
                    >
                      <QrCode className="w-4 h-4" /> Display
                    </button>
                    <button
                      onClick={() => handleExport(event.id)}
                      className="text-sm text-green-600 flex items-center gap-1"
                    >
                      <BarChart3 className="w-4 h-4" /> Export
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-sm text-red-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    event.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : event.status === 'ended'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {event.status === 'active' ? 'Đang hoạt động' : event.status === 'ended' ? 'Đã kết thúc' : 'Nháp'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Install file-saver**

```bash
npm install file-saver @types/file-saver
```

**Step 3: Commit**

```bash
git add src/pages/Dashboard.tsx
git commit -m "feat: add Dashboard with event management"
```

---

## Phase 8: Display Mode

### Task 14: Create Display Mode Page

**Files:**
- Create: `src/pages/DisplayMode.tsx`

**Step 1: Write DisplayMode component**

```typescript
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEventStore } from '@/stores/eventStore';
import { useMediaStore } from '@/stores/mediaStore';
import { QRCode, generateEventURL } from '@/components/QRCode';
import { Loader2 } from 'lucide-react';

export function DisplayMode() {
  const { id } = useParams<{ id: string }>();
  const { currentEvent: event, loadEvent } = useEventStore();
  const { media, loadMedia } = useMediaStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (id) {
      loadEvent(id);
      loadMedia(id);
    }
  }, [id]);

  useEffect(() => {
    if (media.length === 0 || isPaused) return;

    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [media.length, isPaused]);

  // Refresh media every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (id) loadMedia(id);
    }, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (!event) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div
      className="h-screen bg-black text-white overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Event info - top left */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 p-4 rounded-lg max-w-md">
        <h1 className="text-2xl font-bold">{event.name}</h1>
        {event.location && <p className="text-gray-300">{event.location}</p>}
        <p className="text-sm text-gray-400 mt-2">
          {new Date(event.startDate).toLocaleDateString('vi-VN')} -{' '}
          {new Date(event.endDate).toLocaleDateString('vi-VN')}
        </p>
      </div>

      {/* QR Code - top right */}
      <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-lg">
        <QRCode value={generateEventURL(event.id)} size={150} />
        <p className="text-xs text-black text-center mt-1">Quét để tải ảnh</p>
      </div>

      {/* Slideshow */}
      {media.length > 0 ? (
        <div className="h-full flex items-center justify-center">
          <img
            src={media[currentIndex]?.url}
            alt=""
            className="max-h-full max-w-full object-contain transition-opacity duration-500"
          />
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 text-xl">Chưa có ảnh nào</p>
        </div>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {media.slice(0, 20).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/pages/DisplayMode.tsx
git commit -m "feat: add DisplayMode with slideshow"
```

---

## Phase 9: Routing

### Task 15: Set Up Routes

**Files:**
- Modify: `src/App.tsx`

**Step 1: Update App.tsx with routes**

```typescript
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { EventPage } from '@/pages/EventPage';
import { DisplayMode } from '@/pages/DisplayMode';
import { EventForm } from '@/components/EventForm';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<EventForm />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/event/:id/edit" element={<EventForm />} />
        <Route path="/event/:id/display" element={<DisplayMode />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
```

**Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add routing for all pages"
```

---

## Phase 10: Build & Test

### Task 16: Build and Verify

**Step 1: Run build**

```bash
npm run build
```
Expected: Build successful with no errors

**Step 2: Commit**

```bash
git add .
git commit -m "feat: complete event platform MVP"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-2 | Project setup + types |
| 2 | 3 | IndexedDB service |
| 3 | 4-5 | Zustand stores |
| 4 | 6 | Event form |
| 5 | 7 | QR code |
| 6 | 8-11 | Tab components |
| 7 | 12-13 | Pages |
| 8 | 14 | Display mode |
| 9 | 15 | Routing |
| 10 | 16 | Build + verify |

---

## Plan Complete

**Plan complete and saved to `docs/plans/2026-03-06-event-platform-implementation.md`.**

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
