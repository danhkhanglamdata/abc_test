# EventBoard - Implementation Plan

**Project:** EventBoard - Interactive Corporate Event Platform
**Created:** 2026-03-04
**Focus:** Frontend Mockup for Feasibility Demo

---

## 1. Project Setup

### 1.1 Initialize Project
```bash
npm create vite@latest eventboard -- --template react-ts
cd eventboard
npm install
```

### 1.2 Install Dependencies

**Core:**
```bash
npm install react-router-dom zustand clsx tailwind-merge
```

**Styling & Animations:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install framer-motion canvas-confetti
```

**Flow Builder:**
```bash
npm install @xyflow/react
```

### 1.3 Configure Tailwind

`tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#3B82F6',
        accent: '#F59E0B',
        background: '#0F0F23',
        surface: '#1A1A2E',
      },
      animation: {
        'confetti': 'confetti 1s ease-out forwards',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
```

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background text-white;
  }
}
```

---

## 2. Type Definitions

### 2.1 Core Types
`src/types/index.ts`:
```typescript
// Event Types
export interface Event {
  id: string
  code: string
  name: string
  description: string
  bannerUrl?: string
  logoUrl?: string
  participantCount: number
  createdAt: Date
}

// Block Types
export type BlockType = 'checkin' | 'energy' | 'wheel' | 'poll' | 'qa' | 'moment' | 'vote'

export interface FlowBlock {
  id: string
  type: BlockType
  title: string
  config: BlockConfig
  position: { x: number; y: number }
  isLocked: boolean
  isCompleted: boolean
}

export type BlockConfig = CheckinConfig | EnergyConfig | WheelConfig | PollConfig | QAConfig | MomentConfig | VoteConfig

export interface CheckinConfig {
  initialCount: number
}

export interface EnergyConfig {
  goal: number
  pointsPerAction: number
  accumulatorSource: 'checkin' | 'moment' | 'manual'
}

export interface WheelConfig {
  prizes: Prize[]
  spinsAllowed: number
  spinDuration: number
}

export interface Prize {
  id: string
  name: string
  type: 'code' | 'text' | 'coupon'
  value: string
  weight: number
}

export interface PollConfig {
  question: string
  options: string[]
  type: 'single' | 'multiple'
  timeLimit?: number
  showResultsImmediately: boolean
}

export interface QAConfig {
  allowAnonymous: boolean
  maxQuestionsPerUser: number
  autoHighlightPopular: boolean
}

export interface MomentConfig {
  maxLength: number
  allowEmoji: boolean
  requireModeration: boolean
}

export interface VoteConfig {
  question: string
  type: 'yesno' | ' thumbs'
}

// Trigger Types
export type TriggerType = 'goal_reached' | 'poll_ended' | 'time_elapsed' | 'manual' | 'sequential'

export interface Trigger {
  id: string
  type: TriggerType
  sourceBlockId?: string
  threshold?: number
  delaySeconds?: number
}

// Connection
export interface FlowConnection {
  id: string
  source: string
  target: string
  trigger?: Trigger
}

// Flow Template
export interface FlowTemplate {
  id: string
  name: string
  description: string
  category: 'conference' | 'workshop' | 'networking' | 'product-launch'
  blocks: FlowBlock[]
  connections: FlowConnection[]
  isPublic: boolean
}

// Moment
export interface Moment {
  id: string
  userId: string
  avatar: string
  message: string
  timestamp: Date
  reactions: { emoji: string; count: number }[]
}

// Poll
export interface Poll {
  id: string
  question: string
  options: { id: string; text: string; votes: number }[]
  status: 'voting' | 'results' | 'ended'
  timeLimit?: number
  endTime?: Date
}

// Q&A
export interface Question {
  id: string
  userId: string
  text: string
  timestamp: Date
  upvotes: number
  isAnswered: boolean
  isHighlighted: boolean
}

// Attendee
export interface Attendee {
  id: string
  name: string
  email: string
  joinedAt: Date
}
```

---

## 3. State Management (Zustand Stores)

### 3.1 Event Store
`src/stores/useEventStore.ts`:
```typescript
import { create } from 'zustand'
import type { Event } from '@/types'

interface EventState {
  currentEvent: Event | null
  setEvent: (event: Event) => void
  incrementParticipants: () => void
}

export const useEventStore = create<EventState>((set) => ({
  currentEvent: null,
  setEvent: (event) => set({ currentEvent: event }),
  incrementParticipants: () => set((state) => ({
    currentEvent: state.currentEvent
      ? { ...state.currentEvent, participantCount: state.currentEvent.participantCount + 1 }
      : null
  })),
}))
```

### 3.2 Flow Store
`src/stores/useFlowStore.ts`:
```typescript
import { create } from 'zustand'
import type { FlowBlock, FlowConnection, FlowTemplate } from '@/types'

interface FlowState {
  blocks: FlowBlock[]
  connections: FlowConnection[]
  templates: FlowTemplate[]
  selectedBlockId: string | null

  addBlock: (block: FlowBlock) => void
  updateBlock: (id: string, updates: Partial<FlowBlock>) => void
  removeBlock: (id: string) => void
  addConnection: (connection: FlowConnection) => void
  removeConnection: (id: string) => void
  setSelectedBlock: (id: string | null) => void
  loadTemplate: (template: FlowTemplate) => void
  resetFlow: () => void
}

export const useFlowStore = create<FlowState>((set) => ({
  blocks: [],
  connections: [],
  templates: [],
  selectedBlockId: null,

  addBlock: (block) => set((state) => ({
    blocks: [...state.blocks, block]
  })),

  updateBlock: (id, updates) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
  })),

  removeBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(b => b.id !== id),
    connections: state.connections.filter(c => c.source !== id && c.target !== id)
  })),

  addConnection: (connection) => set((state) => ({
    connections: [...state.connections, connection]
  })),

  removeConnection: (id) => set((state) => ({
    connections: state.connections.filter(c => c.id !== id)
  })),

  setSelectedBlock: (id) => set({ selectedBlockId: id }),

  loadTemplate: (template) => set({
    blocks: template.blocks,
    connections: template.connections
  }),

  resetFlow: () => set({ blocks: [], connections: [], selectedBlockId: null }),
}))
```

### 3.3 Other Stores
- `useMomentStore.ts` - Moments array, add, react
- `useEnergyStore.ts` - Current energy, goal, addEnergy()
- `usePollStore.ts` - Active polls, vote, results
- `useQAStore.ts` - Questions, submit, upvote

---

## 4. Common Components

### 4.1 Button
`src/components/common/Button/Button.tsx`:
```tsx
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  className, variant = 'primary', size = 'md', children, ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(clsx(
        'rounded-lg font-semibold transition-all',
        'hover:scale-105 active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-primary text-white': variant === 'primary',
          'bg-secondary text-white': variant === 'secondary',
          'bg-accent text-black': variant === 'accent',
          'bg-transparent border border-white/20 hover:bg-white/10': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      ))}
      {...props}
    >
      {children}
    </button>
  )
}
```

### 4.2 Card
`src/components/common/Card/Card.tsx`:
```tsx
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface CardProps {
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
}

export function Card({ className, children, variant = 'default' }: CardProps) {
  return (
    <div className={twMerge(clsx(
      'rounded-xl p-4',
      {
        'bg-surface': variant === 'default',
        'bg-surface shadow-lg shadow-primary/20': variant === 'elevated',
        'bg-transparent border border-white/10': variant === 'outlined',
      },
      className
    ))}>
      {children}
    </div>
  )
}
```

### 4.3 Modal
`src/components/common/Modal/Modal.tsx`:
```tsx
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto z-50 w-full max-w-md h-fit p-6 bg-surface rounded-2xl"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

---

## 5. Layout Components

### 5.1 App Layout (Attendee)
`src/components/layout/AppLayout.tsx`:
```tsx
import { Outlet } from 'react-router-dom'
import { MobileNav } from './MobileNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md p-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-center">EventBoard</h1>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}
```

### 5.2 Mobile Nav
`src/components/layout/MobileNav.tsx`:
```tsx
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

const navItems = [
  { to: '/event/:eventId/moments', icon: '💬', label: 'Moments' },
  { to: '/event/:eventId/energy', icon: '⚡', label: 'Energy' },
  { to: '/event/:eventId/wheel', icon: '🎡', label: 'Wheel' },
  { to: '/event/:eventId/poll', icon: '📊', label: 'Poll' },
  { to: '/event/:eventId/qa', icon: '❓', label: 'Q&A' },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => clsx(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
              isActive ? 'text-primary' : 'text-white/60'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
```

### 5.3 Admin Layout
`src/components/layout/AdminLayout.tsx`:
```tsx
import { Outlet, NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

const adminNav = [
  { to: '/admin/:eventId', icon: '📊', label: 'Dashboard', end: true },
  { to: '/admin/:eventId/flow', icon: '🔗', label: 'Flow Builder' },
  { to: '/admin/:eventId/moments', icon: '💬', label: 'Moments' },
  { to: '/admin/:eventId/polls', icon: '📊', label: 'Polls' },
  { to: '/admin/:eventId/qa', icon: '❓', label: 'Q&A' },
  { to: '/admin/:eventId/attendees', icon: '👥', label: 'Attendees' },
]

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-surface p-4 border-r border-white/10">
        <h1 className="text-2xl font-bold mb-8 text-primary">EventBoard</h1>
        <nav className="space-y-2">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive ? 'bg-primary text-white' : 'hover:bg-white/5'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
```

---

## 6. Feature Components

### 6.1 Energy Bar
`src/components/features/energy/EnergyBar.tsx`:
```tsx
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useEnergyStore } from '@/stores/useEnergyStore'

export function EnergyBar() {
  const { current, goal, addEnergy } = useEnergyStore()
  const percentage = Math.min((current / goal) * 100, 100)
  const isGoalReached = current >= goal

  const handleAddEnergy = () => {
    addEnergy()
    if (useEnergyStore.getState().current >= goal && !isGoalReached) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Energy Bar</h2>
        <span className="text-xl font-bold text-accent">
          {current.toLocaleString()} / {goal.toLocaleString()}
        </span>
      </div>

      <div className="relative h-8 bg-surface rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 50 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white drop-shadow-lg">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleAddEnergy}
        className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-lg"
      >
        ⚡ Add Energy (+10)
      </motion.button>

      {isGoalReached && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-accent font-bold"
        >
          🎉 Goal Reached! Lucky Wheel Unlocked!
        </motion.div>
      )}
    </div>
  )
}
```

### 6.2 Lucky Wheel
`src/components/features/wheel/LuckyWheel.tsx`:
```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'

const prizes = [
  '50% OFF', 'Free Gift', 'Thank You', '10% OFF',
  'Try Again', 'Grand Prize', '5% OFF', 'Bonus Points'
]

export function LuckyWheel() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [wonPrize, setWonPrize] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleSpin = () => {
    if (isSpinning) return
    setIsSpinning(true)

    const newRotation = rotation + 1440 + Math.random() * 360
    setRotation(newRotation)

    setTimeout(() => {
      setIsSpinning(false)
      const index = Math.floor(((newRotation % 360) / 45)) % 8
      setWonPrize(prizes[8 - index])
      setShowModal(true)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="relative w-80 h-80 mx-auto">
        <motion.div
          className="w-full h-full rounded-full border-4 border-accent"
          style={{
            background: `conic-gradient(${Array(8).fill(['#7C3AED', '#3B82F6', '#F59E0B', '#10B981']).flat().join(', ')})`,
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full shadow-lg" />
          </div>
        </motion.div>

        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-4xl">🔻</div>
      </div>

      <Button
        onClick={handleSpin}
        disabled={isSpinning}
        variant="accent"
        size="lg"
        className="w-full"
      >
        {isSpinning ? 'Spinning...' : '🎰 SPIN NOW!'}
      </Button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">🎉 Congratulations!</h2>
          <p className="text-xl mb-6">You won: <span className="text-accent font-bold">{wonPrize}</span></p>
          <Button onClick={() => setShowModal(false)}>Awesome!</Button>
        </div>
      </Modal>
    </div>
  )
}
```

### 6.3 Moment Wall
`src/components/features/moments/MomentWall.tsx`:
```tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMomentStore } from '@/stores/useMomentStore'

const emojis = ['❤️', '🔥', '👏', '😂', '😮', '😢']

export function MomentWall() {
  const { moments, addMoment, addReaction } = useMomentStore()
  const [newMessage, setNewMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    addMoment({
      id: crypto.randomUUID(),
      userId: 'anonymous',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      message: newMessage,
      timestamp: new Date(),
      reactions: []
    })
    setNewMessage('')
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Share a moment..."
          className="flex-1 px-4 py-3 bg-surface rounded-xl border border-white/10"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-primary rounded-xl font-bold"
        >
          Post
        </button>
      </form>

      <div className="grid gap-4">
        <AnimatePresence>
          {moments.map((moment, index) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-4 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <img
                  src={moment.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="mb-2">{moment.message}</p>
                  <div className="flex gap-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(moment.id, emoji)}
                        className="px-2 py-1 bg-white/5 rounded-lg text-sm hover:bg-white/10"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
```

---

## 7. Flow Builder Components

### 7.1 Flow Canvas
`src/components/features/flow/FlowCanvas.tsx`:
```tsx
import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { BlockNode } from './BlockNode'
import { useFlowStore } from '@/stores/useFlowStore'

const nodeTypes = {
  block: BlockNode,
}

export function FlowCanvas() {
  const { blocks, connections, addConnection } = useFlowStore()

  const initialNodes: Node[] = blocks.map(block => ({
    id: block.id,
    type: 'block',
    position: block.position,
    data: { block }
  }))

  const initialEdges: Edge[] = connections.map(conn => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    type: 'smoothstep',
    animated: true,
  }))

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds))
    if (params.source && params.target) {
      addConnection({
        id: crypto.randomUUID(),
        source: params.source,
        target: params.target,
      })
    }
  }, [setEdges, addConnection])

  return (
    <div className="h-[600px] bg-surface rounded-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
```

### 7.2 Block Node
`src/components/features/flow/BlockNode.tsx`:
```tsx
import { Handle, Position, NodeProps } from '@xyflow/react'
import { clsx } from 'clsx'
import type { FlowBlock } from '@/types'

const blockIcons: Record<string, string> = {
  checkin: '📱',
  energy: '⚡',
  wheel: '🎡',
  poll: '📊',
  qa: '❓',
  moment: '💬',
  vote: '👍',
}

const blockColors: Record<string, string> = {
  checkin: 'border-blue-500',
  energy: 'border-yellow-500',
  wheel: 'border-purple-500',
  poll: 'border-green-500',
  qa: 'border-orange-500',
  moment: 'border-pink-500',
  vote: 'border-cyan-500',
}

export function BlockNode({ data }: NodeProps<{ block: FlowBlock }>) {
  const { block } = data

  return (
    <div className={clsx(
      'bg-surface p-4 rounded-xl border-2 min-w-[150px]',
      blockColors[block.type],
      block.isLocked && 'opacity-50'
    )}>
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center gap-2">
        <span className="text-2xl">{blockIcons[block.type]}</span>
        <div>
          <div className="font-bold">{block.title}</div>
          <div className="text-xs text-white/60">{block.type}</div>
        </div>
      </div>

      {block.isLocked && (
        <div className="mt-2 text-xs text-red-400">🔒 Locked</div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
```

### 7.3 Block Palette
`src/components/features/flow/BlockPalette.tsx`:
```tsx
import { useDraggable } from '@xyflow/react'
import { clsx } from 'clsx'
import type { BlockType } from '@/types'

const blockTypes: { type: BlockType; label: string; icon: string }[] = [
  { type: 'checkin', label: 'Check-in', icon: '📱' },
  { type: 'energy', label: 'Energy', icon: '⚡' },
  { type: 'wheel', label: 'Wheel', icon: '🎡' },
  { type: 'poll', label: 'Poll', icon: '📊' },
  { type: 'qa', label: 'Q&A', icon: '❓' },
  { type: 'moment', label: 'Moment', icon: '💬' },
  { type: 'vote', label: 'Vote', icon: '👍' },
]

function DraggableBlock({ type, label, icon }: { type: BlockType; label: string; icon: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${type}`,
    data: { type, label }
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 p-3 bg-surface rounded-lg cursor-grab hover:bg-white/10"
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

export function BlockPalette() {
  return (
    <div className="space-y-2">
      <h3 className="font-bold mb-4">Blocks</h3>
      {blockTypes.map((block) => (
        <DraggableBlock key={block.type} {...block} />
      ))}
    </div>
  )
}
```

---

## 8. Pages

### 8.1 Landing Page
`src/pages/LandingPage.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function LandingPage() {
  const [eventCode, setEventCode] = useState('')
  const navigate = useNavigate()

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (eventCode.trim()) {
      navigate(`/event/${eventCode}`)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        EventBoard
      </h1>
      <p className="text-xl text-white/60 mb-12 text-center">
        Transform your events into interactive experiences
      </p>

      <form onSubmit={handleJoin} className="w-full max-w-md">
        <input
          type="text"
          value={eventCode}
          onChange={(e) => setEventCode(e.target.value)}
          placeholder="Enter event code..."
          className="w-full px-6 py-4 bg-surface rounded-xl border border-white/10 text-center text-lg mb-4"
        />
        <button
          type="submit"
          className="w-full py-4 bg-primary rounded-xl font-bold text-lg"
        >
          Join Event
        </button>
      </form>

      <div className="mt-12">
        <a
          href="/admin/demo"
          className="text-white/40 hover:text-white/60"
        >
          Admin Login →
        </a>
      </div>
    </div>
  )
}
```

### 8.2 Dashboard Page
`src/pages/admin/DashboardPage.tsx`:
```tsx
import { Card } from '@/components/common/Card'

export function DashboardPage() {
  const stats = [
    { label: 'Total Participants', value: '1,234', icon: '👥' },
    { label: 'Moments Posted', value: '567', icon: '💬' },
    { label: 'Questions Asked', value: '89', icon: '❓' },
    { label: 'Polls Completed', value: '12', icon: '📊' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} variant="elevated" className="text-center">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-white/60">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <span>👤</span>
              <span>New participant joined</span>
              <span className="ml-auto text-white/40">{i}m ago</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
```

---

## 9. Router Setup

`src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { LandingPage } from '@/pages/LandingPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { FlowBuilderPage } from '@/pages/admin/FlowBuilderPage'
import { EnergyPage } from '@/pages/attendee/EnergyPage'
import { WheelPage } from '@/pages/attendee/WheelPage'
// ... other imports

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<AppLayout />}>
          <Route path="/event/:eventId/moments" element={<MomentWallPage />} />
          <Route path="/event/:eventId/energy" element={<EnergyPage />} />
          <Route path="/event/:eventId/wheel" element={<WheelPage />} />
          <Route path="/event/:eventId/poll" element={<PollPage />} />
          <Route path="/event/:eventId/qa" element={<QAPage />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/:eventId" element={<DashboardPage />} />
          <Route path="/admin/:eventId/flow" element={<FlowBuilderPage />} />
          <Route path="/admin/:eventId/moments" element={<MomentsAdminPage />} />
          <Route path="/admin/:eventId/polls" element={<PollsAdminPage />} />
          <Route path="/admin/:eventId/qa" element={<QAAdminPage />} />
          <Route path="/admin/:eventId/attendees" element={<AttendeesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 10. Mock Data

`src/data/templates.ts`:
```typescript
import type { FlowTemplate } from '@/types'

export const flowTemplates: FlowTemplate[] = [
  {
    id: 'conference-standard',
    name: 'Conference Standard',
    description: 'Standard flow for corporate conferences',
    category: 'conference',
    isPublic: true,
    blocks: [
      { id: 'b1', type: 'checkin', title: 'QR Check-in', config: { initialCount: 0 }, position: { x: 100, y: 100 }, isLocked: false, isCompleted: false },
      { id: 'b2', type: 'energy', title: 'Energy Bar', config: { goal: 500, pointsPerAction: 10, accumulatorSource: 'checkin' }, position: { x: 100, y: 250 }, isLocked: true, isCompleted: false },
      { id: 'b3', type: 'poll', title: 'Live Poll', config: { question: '', options: [], type: 'single', showResultsImmediately: true }, position: { x: 100, y: 400 }, isLocked: true, isCompleted: false },
      { id: 'b4', type: 'wheel', title: 'Lucky Wheel', config: { prizes: [], spinsAllowed: 1, spinDuration: 3000 }, position: { x: 100, y: 550 }, isLocked: true, isCompleted: false },
    ],
    connections: [
      { id: 'c1', source: 'b1', target: 'b2', trigger: { id: 't1', type: 'sequential' } },
      { id: 'c2', source: 'b2', target: 'b3', trigger: { id: 't2', type: 'goal_reached', threshold: 500 } },
      { id: 'c3', source: 'b3', target: 'b4', trigger: { id: 't3', type: 'poll_ended' } },
    ],
  },
  // ... more templates
]
```

---

## 11. Implementation Checklist

### Phase 1: Foundation
- [ ] Initialize Vite project
- [ ] Install dependencies
- [ ] Configure Tailwind
- [ ] Create type definitions
- [ ] Setup Zustand stores

### Phase 2: Common Components
- [ ] Button
- [ ] Card
- [ ] Input
- [ ] Modal

### Phase 3: Layouts
- [ ] AppLayout
- [ ] AdminLayout
- [ ] MobileNav

### Phase 4: Attendee Features
- [ ] Landing Page
- [ ] Moment Wall
- [ ] Energy Bar
- [ ] Lucky Wheel
- [ ] Live Poll
- [ ] Q&A

### Phase 5: Admin Dashboard
- [ ] Dashboard
- [ ] Moment moderation
- [ ] Poll management
- [ ] Q&A management
- [ ] Attendee export

### Phase 6: Flow Builder
- [ ] Flow Canvas
- [ ] Block Palette
- [ ] Block Nodes
- [ ] Connections
- [ ] Block Config Panel
- [ ] Template System
- [ ] Flow Preview

### Phase 7: Polish
- [ ] Animations
- [ ] Mock data
- [ ] Demo testing

---

*Implementation Plan created: 2026-03-04*
