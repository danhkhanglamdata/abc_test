import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button, Card } from '@/components/common';
import { useFlowStore, createFlowNode, type FlowData } from '@/stores/flowStore';
import {
  TriggerNode,
  MomentNode,
  EnergyNode,
  WheelNode,
  PollNode,
  QANode,
  DelayNode,
  ConditionNode,
} from './nodes';

const nodeTypes = {
  trigger: TriggerNode,
  moment: MomentNode,
  energy: EnergyNode,
  wheel: WheelNode,
  poll: PollNode,
  qa: QANode,
  delay: DelayNode,
  condition: ConditionNode,
};

interface NodePanelProps {
  onAddNode: (type: string, label: string) => void;
}

function NodePanel({ onAddNode }: NodePanelProps) {
  const nodeTemplates = [
    { type: 'trigger', label: 'Trigger', color: 'blue' },
    { type: 'delay', label: 'Delay', color: 'gray' },
    { type: 'condition', label: 'Condition', color: 'amber' },
    { type: 'moment', label: 'Moment', color: 'pink' },
    { type: 'energy', label: 'Energy', color: 'yellow' },
    { type: 'wheel', label: 'Wheel', color: 'purple' },
    { type: 'poll', label: 'Poll', color: 'indigo' },
    { type: 'qa', label: 'Q&A', color: 'teal' },
  ];

  const getColorClasses = (color: string, isHover: boolean) => {
    const baseColors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    };
    const colors = baseColors[color] || baseColors.gray;
    return isHover
      ? `${colors.bg} ${colors.text} ${colors.border}`
      : `${colors.bg} ${colors.text} ${colors.border}`;
  };

  return (
    <Card className="p-3">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Add Node</h3>
      <div className="grid grid-cols-2 gap-2">
        {nodeTemplates.map((template) => (
          <button
            key={template.type}
            onClick={() => onAddNode(template.type, template.label)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              transition-all duration-200 hover:scale-105
              ${getColorClasses(template.color, false)}
              hover:brightness-95 border
            `}
          >
            {template.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

function FlowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, clearFlow } =
    useFlowStore();
  const { screenToFlowPosition } = useReactFlow();

  const handleAddNode = useCallback(
    (type: string, label: string) => {
      const position = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });

      const nodeData: FlowData = {
        label,
        description: `${label} node`,
        triggerType: type === 'trigger' ? 'time' : undefined,
        delayDuration: type === 'delay' ? 60000 : undefined,
      };

      const newNode = createFlowNode(type, position, nodeData);
      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const defaultEdgeOptions = useMemo(
    () => ({
      animated: true,
      type: 'smoothstep',
      style: { stroke: '#6b7280', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed as const,
        color: '#6b7280',
      },
    }),
    []
  );

  const nodeColor = useCallback((node: { type?: string }) => {
    switch (node.type) {
      case 'trigger':
        return '#3b82f6';
      case 'moment':
        return '#ec4899';
      case 'energy':
        return '#eab308';
      case 'wheel':
        return '#a855f7';
      case 'poll':
        return '#6366f1';
      case 'qa':
        return '#14b8a6';
      case 'delay':
        return '#6b7280';
      case 'condition':
        return '#f59e0b';
      default:
        return '#9ca3af';
    }
  }, []);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        className="bg-gray-50"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d1d5db" />
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-md" />
        <MiniMap
          nodeColor={nodeColor}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white border border-gray-200 rounded-lg shadow-md"
        />

        <Panel position="top-right" className="m-4">
          <div className="flex gap-2">
            <NodePanel onAddNode={handleAddNode} />
          </div>
        </Panel>

        <Panel position="top-left" className="m-4">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFlow}
            >
              Clear Flow
            </Button>
          </div>
        </Panel>

        {nodes.length === 0 && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center text-gray-400 pointer-events-none">
            <p className="text-lg">No nodes yet</p>
            <p className="text-sm">Click a node type to add it to the canvas</p>
          </div>
        )}
      </ReactFlow>
    </div>
  );
}

export function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}

export default FlowBuilder;
