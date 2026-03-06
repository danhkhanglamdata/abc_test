import { useState } from 'react';
import { useMediaStore } from '@/stores/mediaStore';
import { Trash2, ExternalLink } from 'lucide-react';

interface GalleryTabProps {
  eventId?: string;
  canDelete?: boolean;
}

export function GalleryTab({ canDelete = false }: GalleryTabProps) {
  const { media, deleteMedia } = useMediaStore();
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
