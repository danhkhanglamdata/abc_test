import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface ConditionNodeData {
  label: string;
  description?: string;
  condition?: string;
  conditionOperator?: 'equals' | 'not_equals' | 'greater_than' | 'less_than';
  conditionValue?: string;
}

interface ConditionNodeProps {
  data: ConditionNodeData;
  selected?: boolean;
}

const operatorLabels: Record<string, string> = {
  equals: '=',
  not_equals: '!=',
  greater_than: '>',
  less_than: '<',
};

const ConditionNode = memo(({ data, selected }: ConditionNodeProps) => {
  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-md border-2 min-w-[200px]
        transition-all duration-200
        ${selected ? 'border-amber-500 shadow-lg' : 'border-gray-200 bg-white'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-500 !w-3 !h-3"
      />

      {/* True output (left) */}
      <Handle
        type="source"
        position={Position.Left}
        id="true"
        className="!bg-green-500 !w-3 !h-3"
        style={{ top: '50%' }}
      />

      {/* False output (right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="!bg-red-500 !w-3 !h-3"
        style={{ top: '50%' }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-amber-500 !w-3 !h-3"
      />

      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-full bg-amber-100 text-amber-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
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

      {data?.condition && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-mono">
              {data.condition}
            </span>
            <span className="text-gray-400">
              {operatorLabels[data.conditionOperator || 'equals']}
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-mono">
              {data.conditionValue || '?'}
            </span>
          </div>
        </div>
      )}

      {/* Output labels */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-xs text-green-600 font-medium">
        True
      </div>
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-xs text-red-600 font-medium">
        False
      </div>
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';

export default ConditionNode;
