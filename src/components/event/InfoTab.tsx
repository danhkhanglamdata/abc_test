import { PlatformEvent } from '@/types';
import { Clock, MapPin } from 'lucide-react';

interface InfoTabProps {
  event: PlatformEvent;
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
