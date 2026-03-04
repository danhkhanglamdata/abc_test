# EventBoard Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a frontend mockup for EventBoard - interactive corporate event platform with Flow Builder

**Architecture:** React + TypeScript + Vite + Tailwind CSS + Zustand for state + @xyflow/react for Flow Builder

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v4, Zustand, Framer Motion, @xyflow/react, canvas-confetti

---

## Project Structure

```
eventboard/
├── src/
│   ├── components/
│   │   ├── common/          # Button, Card, Input, Modal
│   │   ├── features/        # Feature components
│   │   │   ├── moments/
│   │   │   ├── energy/
│   │   │   ├── wheel/
│   │   │   ├── poll/
│   │   │   ├── qa/
│   │   │   └── flow/
│   │   └── layout/          # AppLayout, AdminLayout, MobileNav
│   ├── pages/
│   │   ├── attendee/
│   │   └── admin/
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript interfaces
│   ├── data/                # Mock data
│   └── App.tsx
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## Task 1: Initialize Vite Project

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`

**Step 1: Initialize project**

```bash
npm create vite@latest eventboard -- --template react-ts
cd eventboard
```

**Step 2: Install dependencies**

```bash
npm install react-router-dom zustand clsx tailwind-merge framer-motion canvas-confetti @xyflow/react
npm install -D tailwindcss postcss autoprefixer @types/node
```

**Step 3: Initialize Tailwind**

```bash
npx tailwindcss init -p
```

---

## Task 2: Configure Tailwind CSS

**Files:**
- Modify: `tailwind.config.js`
- Create: `src/index.css`

**Step 1: Write tailwind config**

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

**Step 2: Write CSS**

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

## Task 3: Create Type Definitions

**Files:**
- Create: `src/types/index.ts`

**Step 1: Write types**

```typescript
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

export interface CheckinConfig { initialCount: number }
export interface EnergyConfig { goal: number; pointsPerAction: number; accumulatorSource: 'checkin' | 'moment' | 'manual' }
export interface WheelConfig { prizes: Prize[]; spinsAllowed: number; spinDuration: number }
export interface Prize { id: string; name: string; type: 'code' | 'text' | 'coupon'; value: string; weight: number }
export interface PollConfig { question: string; options: string[]; type: 'single' | 'multiple'; timeLimit?: number; showResultsImmediately: boolean }
export interface QAConfig { allowAnonymous: boolean; maxQuestionsPerUser: number; autoHighlightPopular: boolean }
export interface MomentConfig { maxLength: number; allowEmoji: boolean; requireModeration: boolean }
export interface VoteConfig { question: string; type: 'yesno' | 'thumbs' }

// Trigger
export type TriggerType = 'goal_reached' | 'poll_ended' | 'time_elapsed' | 'manual' | 'sequential'
export interface Trigger { id: string; type: TriggerType; sourceBlockId?: string; threshold?: number; delaySeconds?: number }

// Connection
export interface FlowConnection { id: string; source: string; target: string; trigger?: Trigger }

// Template
export interface FlowTemplate {
  id: string
  name: string
  description: string
  category: 'conference' | 'workshop' | 'networking' | 'product-launch'
  blocks: FlowBlock[]
  connections: FlowConnection[]
  isPublic: boolean
}

// Event
export interface Event { id: string; code: string; name: string; description: string; participantCount: number }

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
}

// Question
export interface Question {
  id: string
  userId: string
  text: string
  timestamp: Date
  upvotes: number
  isAnswered: boolean
}
```

---

## Task 4: Create Common Components - Button

**Files:**
- Create: `src/components/common/Button/Button.tsx`
- Create: `src/components/common/Button/index.ts`

**Step 1: Write Button component**

```tsx
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'primary', size = 'md', children, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(clsx(
        'rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50',
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

---

## Task 5: Create Common Components - Card & Modal

**Files:**
- Create: `src/components/common/Card/Card.tsx`
- Create: `src/components/common/Card/index.ts`
- Create: `src/components/common/Modal/Modal.tsx`
- Create: `src/components/common/Modal/index.ts`

**Step 1: Write Card**

```tsx
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface CardProps { className?: string; children: React.ReactNode; variant?: 'default' | 'elevated' | 'outlined' }

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

**Step 2: Write Modal**

```tsx
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps { isOpen: boolean; onClose: () => void; children: React.ReactNode }

export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40" onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
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

## Task 6: Create Zustand Stores

**Files:**
- Create: `src/stores/useEventStore.ts`
- Create: `src/stores/useFlowStore.ts`
- Create: `src/stores/useMomentStore.ts`
- Create: `src/stores/useEnergyStore.ts`
- Create: `src/stores/usePollStore.ts`
- Create: `src/stores/useQAStore.ts`

**Step 1: Write useEventStore**

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

**Step 2: Write useFlowStore**

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
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  updateBlock: (id, updates) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
  })),
  removeBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(b => b.id !== id),
    connections: state.connections.filter(c => c.source !== id && c.target !== id)
  })),
  addConnection: (connection) => set((state) => ({ connections: [...state.connections, connection] })),
  removeConnection: (id) => set((state) => ({ connections: state.connections.filter(c => c.id !== id) })),
  setSelectedBlock: (id) => set({ selectedBlockId: id }),
  loadTemplate: (template) => set({ blocks: template.blocks, connections: template.connections }),
  resetFlow: () => set({ blocks: [], connections: [], selectedBlockId: null }),
}))
```

**Step 3: Write useEnergyStore**

```typescript
import { create } from 'zustand'

interface EnergyState {
  current: number
  goal: number
  addEnergy: (amount?: number) => void
  reset: () => void
}

export const useEnergyStore = create<EnergyState>((set) => ({
  current: 0,
  goal: 1000,
  addEnergy: (amount = 10) => set((state) => ({ current: state.current + amount })),
  reset: () => set({ current: 0 }),
}))
```

**Step 4: Write useMomentStore**

```typescript
import { create } from 'zustand'
import type { Moment } from '@/types'

interface MomentState {
  moments: Moment[]
  addMoment: (moment: Moment) => void
  addReaction: (momentId: string, emoji: string) => void
}

export const useMomentStore = create<MomentState>((set) => ({
  moments: [],
  addMoment: (moment) => set((state) => ({ moments: [moment, ...state.moments] })),
  addReaction: (momentId, emoji) => set((state) => ({
    moments: state.moments.map(m => {
      if (m.id !== momentId) return m
      const existing = m.reactions.find(r => r.emoji === emoji)
      if (existing) {
        return { ...m, reactions: m.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r) }
      }
      return { ...m, reactions: [...m.reactions, { emoji, count: 1 }] }
    })
  })),
}))
```

---

## Task 7: Create Layout Components

**Files:**
- Create: `src/components/layout/AppLayout.tsx`
- Create: `src/components/layout/MobileNav.tsx`
- Create: `src/components/layout/AdminLayout.tsx`

**Step 1: Write MobileNav**

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
              'flex flex-col items-center gap-1 px-3 py-2 rounded-lg',
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

**Step 2: Write AppLayout**

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

**Step 3: Write AdminLayout**

```tsx
import { Outlet, NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

const adminNav = [
  { to: '/admin/:eventId', icon: '📊', label: 'Dashboard', end: true },
  { to: '/admin/:eventId/flow', icon: '🔗', label: 'Flow Builder' },
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
                'flex items-center gap-3 px-4 py-3 rounded-lg',
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

## Task 8: Create Feature Components - Energy Bar

**Files:**
- Create: `src/components/features/energy/EnergyBar.tsx`
- Create: `src/components/features/energy/index.ts`

**Step 1: Write EnergyBar**

```tsx
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useEnergyStore } from '@/stores/useEnergyStore'

export function EnergyBar() {
  const { current, goal, addEnergy } = useEnergyStore()
  const percentage = Math.min((current / goal) * 100, 100)
  const isGoalReached = current >= goal

  const handleAddEnergy = () => {
    addEnergy(10)
    if (useEnergyStore.getState().current >= goal && !isGoalReached) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
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
          <span className="text-sm font-bold">{percentage.toFixed(0)}%</span>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center text-accent font-bold">
          🎉 Goal Reached! Lucky Wheel Unlocked!
        </motion.div>
      )}
    </div>
  )
}
```

---

## Task 9: Create Feature Components - Lucky Wheel

**Files:**
- Create: `src/components/features/wheel/LuckyWheel.tsx`
- Create: `src/components/features/wheel/index.ts`

**Step 1: Write LuckyWheel**

```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'

const prizes = ['50% OFF', 'Free Gift', 'Thank You', '10% OFF', 'Try Again', 'Grand Prize', '5% OFF', 'Bonus Points']

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
            background: `conic-gradient(${['#7C3AED', '#3B82F6', '#F59E0B', '#10B981', '#7C3AED', '#3B82F6', '#F59E0B', '#10B981'].join(', ')})`,
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

      <Button onClick={handleSpin} disabled={isSpinning} variant="accent" size="lg" className="w-full">
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

---

## Task 10: Create Feature Components - Moment Wall & Poll & Q&A

**Files:**
- Create: `src/components/features/moments/MomentWall.tsx`
- Create: `src/components/features/moments/index.ts`
- Create: `src/components/features/poll/LivePoll.tsx`
- Create: `src/components/features/poll/index.ts`
- Create: `src/components/features/qa/QA.tsx`
- Create: `src/components/features/qa/index.ts`

**Step 1: Write MomentWall**

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
        <button type="submit" className="px-6 py-3 bg-primary rounded-xl font-bold">Post</button>
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
                <img src={moment.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="mb-2">{moment.message}</p>
                  <div className="flex gap-2">
                    {emojis.map((emoji) => (
                      <button key={emoji} onClick={() => addReaction(moment.id, emoji)} className="px-2 py-1 bg-white/5 rounded-lg text-sm">
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

**Step 2: Write LivePoll**

```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'

const defaultPoll = {
  id: '1',
  question: 'What is your favorite programming language?',
  options: [
    { id: '1', text: 'TypeScript', votes: 45 },
    { id: '2', text: 'Python', votes: 32 },
    { id: '3', text: 'Rust', votes: 18 },
    { id: '4', text: 'Go', votes: 15 },
  ],
  status: 'voting' as const,
}

export function LivePoll() {
  const [poll, setPoll] = useState(defaultPoll)
  const [voted, setVoted] = useState<string | null>(null)

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0)

  const handleVote = (optionId: string) => {
    if (voted) return
    setVoted(optionId)
    setPoll(prev => ({
      ...prev,
      options: prev.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
    }))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{poll.question}</h2>

      <div className="space-y-3">
        {poll.options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
          return (
            <motion.button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={!!voted}
              className="w-full p-4 bg-surface rounded-xl text-left relative overflow-hidden"
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-primary/20"
                initial={{ width: 0 }}
                animate={{ width: voted ? `${percentage}%` : '0%' }}
                transition={{ duration: 0.5 }}
              />
              <div className="relative flex justify-between items-center">
                <span>{option.text}</span>
                {voted && <span className="font-bold">{percentage.toFixed(0)}%</span>}
              </div>
            </motion.button>
          )
        })}
      </div>

      <p className="text-center text-white/60">{totalVotes} votes</p>
    </div>
  )
}
```

**Step 3: Write QA**

```tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const defaultQuestions = [
  { id: '1', text: 'How do you handle edge cases in production?', upvotes: 24, timestamp: new Date() },
  { id: '2', text: 'What is the roadmap for the next quarter?', upvotes: 18, timestamp: new Date() },
  { id: '3', text: 'Can you share more about the team structure?', upvotes: 12, timestamp: new Date() },
]

export function QA() {
  const [questions, setQuestions] = useState(defaultQuestions)
  const [newQuestion, setNewQuestion] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim()) return
    setQuestions(prev => [{
      id: crypto.randomUUID(),
      text: newQuestion,
      upvotes: 0,
      timestamp: new Date()
    }, ...prev])
    setNewQuestion('')
  }

  const handleUpvote = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question anonymously..."
          className="flex-1 px-4 py-3 bg-surface rounded-xl border border-white/10"
        />
        <button type="submit" className="px-6 py-3 bg-primary rounded-xl font-bold">Ask</button>
      </form>

      <div className="space-y-3">
        <AnimatePresence>
          {[...questions].sort((a, b) => b.upvotes - a.upvotes).map((question) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface p-4 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <button onClick={() => handleUpvote(question.id)} className="flex flex-col items-center gap-1 text-white/60 hover:text-primary">
                  <span className="text-xl">▲</span>
                  <span className="font-bold">{question.upvotes}</span>
                </button>
                <p className="flex-1">{question.text}</p>
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

## Task 11: Create Pages

**Files:**
- Create: `src/pages/LandingPage.tsx`
- Create: `src/pages/attendee/EnergyPage.tsx`
- Create: `src/pages/attendee/WheelPage.tsx`
- Create: `src/pages/attendee/MomentPage.tsx`
- Create: `src/pages/attendee/PollPage.tsx`
- Create: `src/pages/attendee/QAPage.tsx`
- Create: `src/pages/admin/DashboardPage.tsx`
- Create: `src/pages/admin/FlowBuilderPage.tsx`
- Create: `src/pages/admin/AttendeesPage.tsx`

**Step 1: Write LandingPage**

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function LandingPage() {
  const [eventCode, setEventCode] = useState('')
  const navigate = useNavigate()

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (eventCode.trim()) navigate(`/event/${eventCode}`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        EventBoard
      </h1>
      <p className="text-xl text-white/60 mb-12 text-center">Transform your events into interactive experiences</p>

      <form onSubmit={handleJoin} className="w-full max-w-md">
        <input
          type="text"
          value={eventCode}
          onChange={(e) => setEventCode(e.target.value)}
          placeholder="Enter event code..."
          className="w-full px-6 py-4 bg-surface rounded-xl border border-white/10 text-center text-lg mb-4"
        />
        <button type="submit" className="w-full py-4 bg-primary rounded-xl font-bold text-lg">Join Event</button>
      </form>

      <div className="mt-12">
        <a href="/admin/demo" className="text-white/40 hover:text-white/60">Admin Login →</a>
      </div>
    </div>
  )
}
```

**Step 2: Write DashboardPage**

```tsx
import { Card } from '@/components/common/Card'

const stats = [
  { label: 'Total Participants', value: '1,234', icon: '👥' },
  { label: 'Moments Posted', value: '567', icon: '💬' },
  { label: 'Questions Asked', value: '89', icon: '❓' },
  { label: 'Polls Completed', value: '12', icon: '📊' },
]

export function DashboardPage() {
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

**Step 3: Write Attendee Pages** (re-export from components)

```tsx
// src/pages/attendee/EnergyPage.tsx
export { EnergyBar as default } from '@/components/features/energy'

// src/pages/attendee/WheelPage.tsx
export { LuckyWheel as default } from '@/components/features/wheel'

// src/pages/attendee/MomentPage.tsx
export { MomentWall as default } from '@/components/features/moments'

// src/pages/attendee/PollPage.tsx
export { LivePoll as default } from '@/components/features/poll'

// src/pages/attendee/QAPage.tsx
export { QA as default } from '@/components/features/qa'
```

---

## Task 12: Create Flow Builder Components

**Files:**
- Create: `src/components/features/flow/BlockNode.tsx`
- Create: `src/components/features/flow/BlockPalette.tsx`
- Create: `src/components/features/flow/FlowCanvas.tsx`
- Create: `src/components/features/flow/index.ts`
- Create: `src/pages/admin/FlowBuilderPage.tsx`

**Step 1: Write BlockNode**

```tsx
import { Handle, Position, NodeProps } from '@xyflow/react'
import { clsx } from 'clsx'
import type { FlowBlock } from '@/types'

const blockIcons: Record<string, string> = {
  checkin: '📱', energy: '⚡', wheel: '🎡', poll: '📊', qa: '❓', moment: ' '👍',
}

const blockColors: Record<string, string💬', vote:> = {
  checkin: 'border-blue-500', energy: 'border-yellow-500', wheel: 'border-purple-500',
  poll: 'border-green-500', qa: 'border-orange-500', moment: 'border-pink-500', vote: 'border-cyan-500',
}

export function BlockNode({ data }: NodeProps<{ block: FlowBlock }>) {
  const { block } = data
  return (
    <div className={clsx('bg-surface p-4 rounded-xl border-2 min-w-[150px]', blockColors[block.type], block.isLocked && 'opacity-50')}>
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <span className="text-2xl">{blockIcons[block.type]}</span>
        <div>
          <div className="font-bold">{block.title}</div>
          <div className="text-xs text-white/60">{block.type}</div>
        </div>
      </div>
      {block.isLocked && <div className="mt-2 text-xs text-red-400">🔒 Locked</div>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
```

**Step 2: Write BlockPalette**

```tsx
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

export function BlockPalette() {
  return (
    <div className="space-y-2">
      <h3 className="font-bold mb-4">Blocks</h3>
      {blockTypes.map((block) => (
        <div key={block.type} className="flex items-center gap-2 p-3 bg-surface rounded-lg cursor-grab hover:bg-white/10">
          <span className="text-xl">{block.icon}</span>
          <span>{block.label}</span>
        </div>
      ))}
    </div>
  )
}
```

**Step 3: Write FlowCanvas**

```tsx
import { useCallback, useEffect } from 'react'
import { ReactFlow, Background, Controls, addEdge, useNodesState, useEdgesState, Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { BlockNode } from './BlockNode'
import { useFlowStore } from '@/stores/useFlowStore'

const nodeTypes = { block: BlockNode }

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

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [blocks, connections])

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds))
    if (params.source && params.target) {
      addConnection({ id: crypto.randomUUID(), source: params.source, target: params.target })
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

**Step 4: Write FlowBuilderPage**

```tsx
import { FlowCanvas } from '@/components/features/flow/FlowCanvas'
import { BlockPalette } from '@/components/features/flow/BlockPalette'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'

export function FlowBuilderPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Flow Builder</h1>
        <div className="flex gap-2">
          <Button variant="ghost">Preview</Button>
          <Button>Save Flow</Button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-64">
          <Card>
            <BlockPalette />
          </Card>
        </div>
        <div className="flex-1">
          <FlowCanvas />
        </div>
      </div>
    </div>
  )
}
```

---

## Task 13: Setup Router & App

**Files:**
- Create: `src/App.tsx`
- Modify: `src/main.tsx` (or `src/index.tsx`)

**Step 1: Write App.tsx**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { LandingPage } from '@/pages/LandingPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { FlowBuilderPage } from '@/pages/admin/FlowBuilderPage'
import EnergyPage from '@/pages/attendee/EnergyPage'
import WheelPage from '@/pages/attendee/WheelPage'
import MomentPage from '@/pages/attendee/MomentPage'
import PollPage from '@/pages/attendee/PollPage'
import QAPage from '@/pages/attendee/QAPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<AppLayout />}>
          <Route path="/event/:eventId/moments" element={<MomentPage />} />
          <Route path="/event/:eventId/energy" element={<EnergyPage />} />
          <Route path="/event/:eventId/wheel" element={<WheelPage />} />
          <Route path="/event/:eventId/poll" element={<PollPage />} />
          <Route path="/event/:eventId/qa" element={<QAPage />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/:eventId" element={<DashboardPage />} />
          <Route path="/admin/:eventId/flow" element={<FlowBuilderPage />} />
          <Route path="/admin/:eventId/attendees" element={<div>Attendees Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

**Step 2: Update main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## Task 14: Configure Path Aliases

**Files:**
- Modify: `tsconfig.json`
- Modify: `vite.config.ts`

**Step 1: Update tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 2: Update vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

## Task 15: Add Mock Data & Test

**Files:**
- Create: `src/data/mockData.ts`

**Step 1: Write mock data**

```typescript
import type { Moment } from '@/types'

export const mockMoments: Moment[] = [
  { id: '1', userId: '1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', message: 'Amazing keynote!', timestamp: new Date(), reactions: [{ emoji: '❤️', count: 12 }] },
  { id: '2', userId: '2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', message: 'Great networking event!', timestamp: new Date(), reactions: [{ emoji: '🔥', count: 8 }] },
  { id: '3', userId: '3', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', message: 'Love the energy!', timestamp: new Date(), reactions: [{ emoji: '👏', count: 15 }] },
]

// Initialize store with mock data in App.tsx or separate init
```

**Step 2: Test the app**

```bash
npm run dev
```

---

## Summary

This plan includes **15 tasks** covering:
1. Project setup with Vite + React + TypeScript
2. Tailwind CSS configuration
3. TypeScript type definitions
4-5. Common UI components (Button, Card, Modal)
6. Zustand state management stores
7. Layout components (AppLayout, AdminLayout, MobileNav)
8-10. Feature components (EnergyBar, LuckyWheel, MomentWall, LivePoll, QA)
11. Pages (Landing, Dashboard, Attendee pages)
12. Flow Builder components (BlockNode, BlockPalette, FlowCanvas)
13. Router setup
14. Path aliases configuration
15. Mock data and testing

---

*Plan created: 2026-03-04*
