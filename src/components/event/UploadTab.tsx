import { useState, useRef } from 'react';
import { useMediaStore } from '@/stores/mediaStore';
import { PlatformEvent, PlatformInfoField } from '@/types';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadTabProps {
  eventId: string;
  requireInfo: boolean;
  infoFields: PlatformEvent['infoFields'];
}

export function UploadTab({ eventId, requireInfo, infoFields }: UploadTabProps) {
  const { addMedia } = useMediaStore();
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
