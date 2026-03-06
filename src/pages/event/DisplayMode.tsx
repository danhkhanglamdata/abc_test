import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEventStore } from '@/stores/eventStore';
import { useMediaStore } from '@/stores/mediaStore';
import { QRCode, generateEventURL } from '@/components/event/QRCode';
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
