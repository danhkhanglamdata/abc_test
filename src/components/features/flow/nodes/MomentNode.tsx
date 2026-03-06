import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface BaseNodeData {
  label: string;
  description?: string;
}

interface MomentNodeProps {
  data: BaseNodeData;
  selected?: boolean;
}

const MomentNode = memo(({ data, selected }: MomentNodeProps) => {
  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-md border-2 min-w-[180px]
        transition-all duration-200
        ${selected ? 'border-pink-500 shadow-lg' : 'border-gray-200 bg-white'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-pink-500 !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-pink-500 !w-3 !h-3"
      />

      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-pink-100 text-pink-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
        <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
          Capture Moment
        </span>
      </div>
    </div>
  );
});

MomentNode.displayName = 'MomentNode';

export default MomentNode;
