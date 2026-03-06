import { useState } from 'react';
import { PlatformEvent, PlatformInfoField } from '@/types';
import { useEventStore } from '@/stores/eventStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Image, Clock, MapPin } from 'lucide-react';

interface EventFormProps {
  event?: PlatformEvent;
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
  const [infoFields, setInfoFields] = useState<PlatformInfoField[]>(event?.infoFields || []);
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

  const updateInfoField = (id: string, data: Partial<PlatformInfoField>) => {
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
                onChange={(e) => updateInfoField(field.id, { type: e.target.value as PlatformInfoField['type'] })}
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
