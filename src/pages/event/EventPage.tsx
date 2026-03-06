import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEventStore } from '@/stores/eventStore';
import { useMediaStore } from '@/stores/mediaStore';
import { TabNav, EVENT_TABS, InfoTab, GalleryTab, UploadTab, QRCode, generateEventURL } from '@/components/event';
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
