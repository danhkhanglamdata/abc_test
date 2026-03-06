import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface BaseNodeData {
  label: string;
  description?: string;
}

interface WheelNodeProps {
  data: BaseNodeData;
  selected?: boolean;
}

const WheelNode = memo(({ data, selected }: WheelNodeProps) => {
  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-md border-2 min-w-[180px]
        transition-all duration-200
        ${selected ? 'border-purple-500 shadow-lg' : 'border-gray-200 bg-white'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-purple-500 !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-500 !w-3 !h-3"
      />

      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-purple-100 text-purple-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
          Spin Wheel
        </span>
      </div>
    </div>
  );
});

WheelNode.displayName = 'WheelNode';

export default WheelNode;
