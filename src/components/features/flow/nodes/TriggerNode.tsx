import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface TriggerNodeData {
  label: string;
  description?: string;
  triggerType?: 'time' | 'action' | 'manual';
}

interface TriggerNodeProps {
  data: TriggerNodeData;
  selected?: boolean;
}

const TriggerNode = memo(({ data, selected }: TriggerNodeProps) => {
  const getTriggerIcon = () => {
    switch (data?.triggerType) {
      case 'time':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'action':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-md border-2 min-w-[180px]
        transition-all duration-200
        ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200 bg-white'}
      `}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500 !w-3 !h-3"
      />

      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
          {getTriggerIcon()}
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
        <span className={`
          text-xs px-2 py-0.5 rounded-full
          ${data?.triggerType === 'time' ? 'bg-purple-100 text-purple-700' : ''}
          ${data?.triggerType === 'action' ? 'bg-orange-100 text-orange-700' : ''}
          ${data?.triggerType === 'manual' ? 'bg-gray-100 text-gray-700' : ''}
        `}>
          {data?.triggerType === 'time' && 'Time Trigger'}
          {data?.triggerType === 'action' && 'Action Trigger'}
          {data?.triggerType === 'manual' && 'Manual Trigger'}
          {!data?.triggerType && 'Trigger'}
        </span>
      </div>
    </div>
  );
});

TriggerNode.displayName = 'TriggerNode';

export default TriggerNode;
