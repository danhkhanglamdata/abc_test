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
