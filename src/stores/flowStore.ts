import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Node,
  Edge,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';

// FlowData with index signature for ReactFlow compatibility
export interface FlowData extends Record<string, unknown> {
  label: string;
  description?: string;
  config?: Record<string, unknown>;
  triggerType?: 'time' | 'action' | 'manual';
  delayDuration?: number;
  condition?: string;
  conditionOperator?: 'equals' | 'not_equals' | 'greater_than' | 'less_than';
  conditionValue?: string;
}

export interface FlowState {
  nodes: Node<FlowData>[];
  edges: Edge[];
  selectedNode: Node<FlowData> | null;
  isExecuting: boolean;
  currentExecutionStep: string | null;

  // Node operations
  setNodes: (nodes: Node<FlowData>[]) => void;
  addNode: (node: Node<FlowData>) => void;
  updateNode: (nodeId: string, data: Partial<FlowData>) => void;
  removeNode: (nodeId: string) => void;
  onNodesChange: (changes: NodeChange[]) => void;

  // Edge operations
  setEdges: (edges: Edge[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Selection
  setSelectedNode: (node: Node<FlowData> | null) => void;

  // Execution
  setIsExecuting: (isExecuting: boolean) => void;
  setCurrentExecutionStep: (step: string | null) => void;

  // Flow operations
  clearFlow: () => void;
  loadFlow: (nodes: Node<FlowData>[], edges: Edge[]) => void;
}

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNode: null,
      isExecuting: false,
      currentExecutionStep: null,

      // Node operations
      setNodes: (nodes) => set({ nodes }),

      addNode: (node) =>
        set((state) => ({
          nodes: [...state.nodes, node],
        })),

      updateNode: (nodeId, data) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...data } }
              : node
          ),
        })),

      removeNode: (nodeId) =>
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== nodeId),
          edges: state.edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
          ),
        })),

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes as Node[]) as Node<FlowData>[],
        });
      },

      // Edge operations
      setEdges: (edges) => set({ edges }),

      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

      onConnect: (connection) => {
        set({
          edges: addEdge(
            { ...connection, animated: true, type: 'smoothstep' },
            get().edges
          ),
        });
      },

      // Selection
      setSelectedNode: (node) => set({ selectedNode: node }),

      // Execution
      setIsExecuting: (isExecuting) => set({ isExecuting }),
      setCurrentExecutionStep: (step) => set({ currentExecutionStep: step }),

      // Flow operations
      clearFlow: () => set({ nodes: [], edges: [], selectedNode: null }),

      loadFlow: (nodes, edges) => set({ nodes, edges }),
    }),
    {
      name: 'flow-storage',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
      }),
    }
  )
);

// Helper function to create a new node with unique ID
export const createFlowNode = (
  type: string,
  position: { x: number; y: number },
  data: FlowData
): Node<FlowData> => {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    position,
    data,
  };
};
