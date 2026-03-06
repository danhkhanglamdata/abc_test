import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface BaseNodeData {
  label: string;
  description?: string;
}

interface PollNodeProps {
  data: BaseNodeData;
  selected?: boolean;
}

const PollNode = memo(({ data, selected }: PollNodeProps) => {
  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-md border-2 min-w-[180px]
        transition-all duration-200
        ${selected ? 'border-indigo-500 shadow-lg' : 'border-gray-200 bg-white'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-indigo-500 !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-indigo-500 !w-3 !h-3"
      />

      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
          Poll / Vote
        </span>
      </div>
    </div>
  );
});

PollNode.displayName = 'PollNode';

export default PollNode;
