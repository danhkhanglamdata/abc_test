# Research Report: EventBoard Tech Stack & Patterns

**Date:** 2026-03-04
**Project:** EventBoard Frontend Mockup

---

## Executive Summary

Research completed for EventBoard frontend mockup. Key findings:

1. **Zustand** - Recommended for state management (simple, performant, hook-based)
2. **Motion (Framer Motion)** - Best for complex animations (120fps, gesture support)
3. **Tailwind CSS v4** - Custom animations via `@theme` directive
4. **canvas-confetti** - Recommended for celebration effects

---

## 1. State Management: Zustand

### Why Zustand?
- Lightweight (~1KB)
- No boilerplate
- Hook-based API
- TypeScript native
- Selective subscriptions (performance)

### Code Pattern

```typescript
// src/stores/useEventStore.ts
import { create } from 'zustand'

interface EventState {
  eventId: string
  eventName: string
  participants: number
  setEvent: (id: string, name: string) => void
  incrementParticipants: () => void
}

export const useEventStore = create<EventState>((set) => ({
  eventId: '',
  eventName: '',
  participants: 0,
  setEvent: (id, name) => set({ eventId: id, eventName: name }),
  incrementParticipants: () => set((state) => ({
    participants: state.participants + 1
  })),
}))
```

### Best Practices
- Use selectors: `const bears = useBearStore(s => s.bears)`
- Use `useShallow` for multiple props: `useStore(useShallow(s => ({a, b})))`
- Async actions supported natively

---

## 2. Animations: Motion (Framer Motion)

### Why Motion?
- 120fps GPU-accelerated
- Gesture support (tap, drag, hover)
- Layout animations
- Scroll-linked animations
- TypeScript included

### Installation
```bash
npm install motion
```

### Code Patterns

**Basic Animation:**
```tsx
import { motion } from 'motion/react'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
/>
```

**Spin Animation (Lucky Wheel):**
```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 3,
    ease: [0.17, 0.67, 0.83, 0.67] // Custom easing
  }}
/>
```

**Tap Gesture:**
```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.05 }}
>
  Spin!
</motion.button>
```

---

## 3. Tailwind CSS Animations

### Built-in Animations
- `animate-spin` - Rotation
- `animate-ping` - Ripple effect
- `animate-pulse` - Fade
- `animate-bounce` - Bounce

### Custom Animation (tailwind.config.js or CSS)

```css
/* src/index.css */
@theme {
  --animate-confetti: confetti 1s ease-out forwards;

  @keyframes confetti {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }

  --animate-pulse-fast: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  --animate-wiggle: wiggle 1s ease-in-out infinite;

  @keyframes wiggle {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
}
```

### Usage
```html
<div class="animate-confetti">...</div>
```

---

## 4. Celebration Effects

### Recommended: canvas-confetti
```bash
npm install canvas-confetti
```

```typescript
import confetti from 'canvas-confetti'

// Trigger celebration
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 }
})
```

### Integration with Energy Bar
```typescript
const handleEnergyGoal = () => {
  confetti({
    particleCount: 150,
    spread: 100,
    colors: ['#7C3AED', '#3B82F6', '#F59E0B']
  })
}
```

---

## 5. Project Structure Recommendation

```
eventboard/
├── src/
│   ├── components/
│   │   ├── common/          # Button, Card, Modal
│   │   ├── features/        # Feature-specific
│   │   │   ├── moments/
│   │   │   ├── energy/
│   │   │   ├── wheel/
│   │   │   ├── poll/
│   │   │   └── qa/
│   │   └── layout/
│   ├── pages/
│   ├── stores/              # Zustand stores
│   ├── hooks/
│   ├── data/               # Mock JSON
│   ├── types/
│   └── styles/
```

---

## 6. Dependencies Summary

| Package | Purpose | Version |
|---------|---------|---------|
| react | UI | ^18.2 |
| react-router-dom | Routing | ^6 |
| zustand | State | ^4 |
| motion | Animations | ^11 |
| tailwindcss | Styling | ^4 |
| canvas-confetti | Celebrations | ^1.7 |
| clsx, tailwind-merge | Utils | latest |

---

## 7. Key Implementation Notes

1. **Energy Bar** - Use CSS animation + Motion for smooth progress
2. **Lucky Wheel** - Motion rotate + CSS easing for spin effect
3. **Confetti** - canvas-confetti triggered on goal reach
4. **State** - 5 Zustand stores (event, moments, energy, polls, qa)
5. **Mobile-first** - Tailwind responsive classes

---

## 8. Resources

- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Motion GitHub](https://github.com/framer/motion)
- [Tailwind Animations](https://tailwindcss.com/docs/animation)
- [Motion Examples](https://motion.dev/examples)

---

*Report generated: 2026-03-04*
