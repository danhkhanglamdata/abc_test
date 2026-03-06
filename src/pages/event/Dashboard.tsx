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
