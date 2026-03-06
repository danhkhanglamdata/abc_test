import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { EnergyLevel } from '@/types';

interface EnergyNodeData {
  label: string;
  description?: string;
  config?: {
    energyLevel?: EnergyLevel;
  };
}

interface EnergyNodeProps {
  data: EnergyNodeData;
  selected?: boolean;
}

const energyConfig: Record<EnergyLevel, { color: string; bg: string; label: string }> = {
  low: { color: 'text-green-600', bg: 'bg-green-100', label: 'Low Energy' },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Medium Energy' },
  high: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'High Energy' },
  peak: { color: 'text-red-600', bg: 'bg-red-100', label: 'Peak Energy' },
};

const EnergyNode = memo(({ data, selected }: EnergyNodeProps) => {
  const energyLevel = data?.config?.energyLevel || 'medium';
  const config = energyConfig[energyLevel];

  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-md border-2 min-w-[180px]
        transition-all duration-200
        ${selected ? 'border-yellow-500 shadow-lg' : 'border-gray-200 bg-white'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-yellow-500 !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-yellow-500 !w-3 !h-3"
      />

      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-full ${config.bg} ${config.color}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-sm">
            {data?.label}
          </div>
          {data?.description && (
            <div className="text-xs text-gray-500 mt-0.5">
              {data.description}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100">
        <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
          {config.label}
        </span>
      </div>
    </div>
  );
});

EnergyNode.displayName = 'EnergyNode';

export default EnergyNode;
