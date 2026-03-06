import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface DelayNodeData {
  label: string;
  description?: string;
  delayDuration?: number;
}

interface DelayNodeProps {
  data: DelayNodeData;
  selected?: boolean;
}

const DelayNode = memo(({ data, selected }: DelayNodeProps) => {
  const duration = data?.delayDuration || 0;
  const formatDuration = (ms: number) => {
    if (ms < 60000) {
      return `${Math.round(ms / 1000)}s`;
    }
    if (ms < 3600000) {
      return `${Math.round(ms / 60000)}m`;
    }
    return `${Math.round(ms / 3600000)}h`;
  };

  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-md border-2 min-w-[180px]
        transition-all duration-200
        ${selected ? 'border-gray-500 shadow-lg' : 'border-gray-200 bg-white'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-500 !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-500 !w-3 !h-3"
      />

      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-gray-100 text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
          Wait: {formatDuration(duration)}
        </span>
      </div>
    </div>
  );
});

DelayNode.displayName = 'DelayNode';

export default DelayNode;
