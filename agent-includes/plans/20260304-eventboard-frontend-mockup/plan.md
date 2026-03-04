# EventBoard - Frontend Mockup Plan

**Project:** EventBoard - Interactive Corporate Event Platform
**Type:** Frontend-only Web Application (Mockup/PoC)
**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS
**Priority:** UI/UX flow completion for feasibility demonstration

---

## 1. Project Overview

**EventBoard** is a web app that transforms corporate events into interactive, memorable experiences. Attendees scan a QR code and instantly join the event space—no app installation, no account creation required.

### Core Value Proposition
- Zero-friction attendee onboarding (QR scan → instant access)
- Real-time engagement features (Moment Wall, Energy Bar)
- Gamification (Lucky Wheel, Live Polls)
- Organic data collection for organizers

### Target Users
1. **Attendees** - Event participants using mobile devices
2. **Organizers** - Corporate event planners managing events

---

## 2. Feature Specifications

### 2.1 Attendee Features (Mobile-First)

#### 2.1.1 Event Landing / Join Flow
- **Route:** `/event/:eventCode` or `/join/:eventId`
- **Components:**
  - Event header (logo, name, banner)
  - "Join Event" CTA button (simulates QR scan landing)
  - Optional: Name/email input (for data collection demo)
  - Bottom navigation for main features

#### 2.1.2 Moment Wall
- **Route:** `/event/:eventId/moments`
- **Function:** Real-time emotional feed where attendees post moments
- **Components:**
  - `MomentCard` - Avatar (generated), message, timestamp, emoji reactions
  - `MomentInput` - Text input + emoji picker
  - `MomentFeed` - Masonry/grid layout of moments
- **Mock Data-populated with sample:** Pre moments for demo
- **Interactions:** Add moment, react with emoji, infinite scroll

#### 2.1.3 Energy Bar
- **Route:** `/event/:eventId/energy`
- **Function:** Collective energy meter - attendees contribute to reach a goal
- **Components:**
  - `EnergyMeter` - Animated progress bar with particle effects
  - `EnergyGoal` - Target display (e.g., "10,000 energy")
  - `EnergyContribution` - Tap/button to add energy (+10 per tap)
  - `EnergyCelebration` - Confetti animation when goal reached
- **States:** Idle, Contributing, Goal Reached

#### 2.1.4 Lucky Wheel
- **Route:** `/event/:eventId/wheel`
- **Function:** Spin wheel when Energy Bar reaches goal (unlocks feature)
- **Components:**
  - `WheelCanvas` - Animated spinning wheel with prizes
  - `SpinButton` - Large CTA to trigger spin
  - `PrizeModal` - Popup showing won prize
  - `WheelLockOverlay` - Shown when not yet unlocked
- **Prizes:** Discount codes, freebies, social media shoutouts (mock data)
- **Animation:** CSS keyframes for spin, easing functions

#### 2.1.5 Live Poll
- **Route:** `/event/:eventId/poll`
- **Function:** Real-time voting on questions
- **Components:**
  - `PollQuestion` - Current poll question display
  - `PollOptions` - Clickable option buttons with vote counts
  - `PollResults` - Live percentage bars
  - `PollTimer` - Countdown timer (optional)
- **States:** Voting, Results Revealed, Poll Ended

#### 2.1.6 Anonymous Q&A
- **Route:** `/event/:eventId/qa`
- **Function:** Submit questions anonymously for speakers
- **Components:**
  - `QuestionInput` - Text area for submitting questions
  - `QuestionList` - List of submitted questions
  - `QuestionCard` - Question with upvote button
  - `QuestionSort` - Sort by newest/popular
- **Interactions:** Submit question, upvote, hide answered

### 2.2 Organizer Dashboard

#### 2.2.1 Dashboard Home
- **Route:** `/admin/:eventId`
- **Components:**
  - `StatCard` - Key metrics (participants, interactions, questions)
  - `LiveCounter` - Real-time participant count
  - `ActivityFeed` - Recent interactions stream

#### 2.2.2 Moment Wall Management
- **Route:** `/admin/:eventId/moments`
- **Components:**
  - `MomentModeration` - Approve/delete moments
  - `MomentAnalytics` - Engagement stats

#### 2.2.3 Poll Management
- **Route:** `/admin/:eventId/polls`
- **Components:**
  - `PollCreator` - Create new poll with options
  - `PollActiveToggle` - Start/stop poll
  - `PollResultsExport` - View detailed results

#### 2.2.4 Q&A Management
- **Route:** `/admin/:eventId/qa`
- **Components:**
  - `QuestionModeration` - Mark as answered, highlight
  - `QuestionQueue` - Priority queue for speakers

#### 2.2.5 Attendee Data Export
- **Route:** `/admin/:eventId/attendees`
- **Components:**
  - `AttendeeTable` - List of collected emails/names
  - `ExportCSVButton` - Download as CSV
  - `DataSummary` - Collection stats

---

## 2.6 Event Flow Builder (CORE FEATURE)

#### 2.6.1 Flow Canvas
- **Route:** `/admin/:eventId/flow`
- **Function:** Drag-drop builder để sắp xếp thứ tự gamification blocks
- **Components:**
  - `FlowCanvas` - Main canvas với React Flow
  - `BlockPalette` - Sidebar với các block types có thể kéo thả
  - `BlockNode` - Custom node hiển thị trên canvas
  - `ConnectionLine` - SVG lines thể hiện relationships
  - `FlowToolbar` - Save, Preview, Export buttons

#### 2.6.2 Block Types
| Block | Type ID | Source? | Target? | Description |
|-------|---------|---------|---------|-------------|
| **Check-in** | `checkin` | ✅ | ✅ | QR scan counter |
| **Energy Bar** | `energy` | ✅ | ✅ | Accumulator với goal |
| **Lucky Wheel** | `wheel` | ❌ | ✅ | Unlock when unlocked |
| **Live Poll** | `poll` | ❌ | ✅ | Voting activity |
| **Q&A** | `qa` | ❌ | ✅ | Anonymous questions |
| **Moment Wall** | `moment` | ❌ | ✅ | Share moments |
| **Simple Vote** | `vote` | ❌ | ✅ | Basic yes/no polls |

#### 2.6.3 Block Configuration
- **Components:**
  - `BlockConfigPanel` - Settings drawer cho từng block
  - `AccumulatorSettings` - Cấu hình nguồn data
  - `UnlockCondition` - Thiết lập điều kiện unlock
  - `TriggerSettings` - Thiết lập triggers

#### 2.6.4 Trigger System
| Trigger Type | Mô tả | Parameters |
|--------------|-------|------------|
| **Goal Reached** | Unlock khi source đạt target | `sourceBlockId`, `threshold` |
| **Poll Ended** | Unlock khi poll kết thúc | `sourceBlockId` |
| **Time Elapsed** | Unlock sau X phút | `sourceBlockId`, `delaySeconds` |
| **Manual** | Admin click để unlock | `blockId` |
| **Sequential** | Hoàn thành block trước | `sourceBlockId` |

#### 2.6.5 Template System
- **Components:**
  - `TemplateLibrary` - Danh sách templates có sẵn
  - `TemplateCard` - Preview template
  - `SaveTemplateModal` - Lưu flow hiện tại thành template
  - `LoadTemplateModal` - Load template vào canvas

**Pre-built Templates:**
1. **Conference Standard:** Check-in → Energy (500) → Poll → Q&A → Wheel
2. **Networking Event:** Check-in → Moments → Energy (1000) → Wheel
3. **Product Launch:** Poll → Vote → Moments → Exclusive Wheel
4. **Workshop:** Check-in → Energy (manual) → Poll → Certificate

#### 2.6.6 Flow Preview
- **Route:** `/admin/:eventId/flow/preview`
- **Function:** Test flow như attendee
- **Components:**
  - `FlowPlayer` - Simulated attendee experience
  - `FlowProgress` - Shows current block
  - `DebugPanel` - Shows unlock status của all blocks

---

## 3. Technical Architecture

### 3.1 Project Structure
```
eventboard/
├── src/
│   ├── components/
│   │   ├── common/          # Shared UI components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Avatar/
│   │   ├── features/
│   │   │   ├── moments/    # Moment Wall components
│   │   │   ├── energy/    # Energy Bar components
│   │   │   ├── wheel/     # Lucky Wheel components
│   │   │   ├── poll/      # Live Poll components
│   │   │   ├── qa/        # Q&A components
│   │   │   ├── checkin/   # Check-in components
│   │   │   ├── vote/      # Simple vote components
│   │   │   └── flow/      # Flow Builder components
│   │   └── layout/
│   │       ├── AppLayout/
│   │       ├── AdminLayout/
│   │       └── MobileNav/
│   ├── pages/
│   │   ├── attendee/       # Attendee-facing pages
│   │   └── admin/         # Organizer pages
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # State management (Zustand)
│   ├── data/              # Mock data
│   ├── types/             # TypeScript interfaces
│   ├── utils/             # Helper functions
│   └── styles/            # Global styles
├── public/
│   └── assets/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### 3.2 State Management
- **Library:** Zustand (lightweight, simple for mockup)
- **Stores:**
  - `useEventStore` - Current event data
  - `useMomentStore` - Moments state
  - `useEnergyStore` - Energy bar state
  - `usePollStore` - Polls state
  - `useQAStore` - Q&A state
  - `useFlowStore` - Flow builder state (blocks, connections, triggers)

### 3.3 Routing (React Router v6)
```
/                           → Landing/Event selection
/event/:eventId             → Event main hub
/event/:eventId/moments     → Moment Wall
/event/:eventId/energy      → Energy Bar
/event/:eventId/wheel       → Lucky Wheel
/event/:eventId/poll        → Live Poll
/event/:eventId/qa          → Q&A
/admin/:eventId             → Organizer Dashboard
/admin/:eventId/moments     → Moment management
/admin/:eventId/polls       → Poll management
/admin/:eventId/qa          → Q&A management
/admin/:eventId/attendees   → Data export
/admin/:eventId/flow         → Event Flow Builder
/admin/:eventId/flow/preview → Flow Preview
```

### 3.4 UI/Styling
- **Framework:** Tailwind CSS v4
- **Design System:**
  - Mobile-first approach
  - Dark mode support (event atmosphere)
  - Animated components (Framer Motion for complex animations)
  - Custom cursor effects for engagement

### 3.5 Mock Data Strategy
- JSON files in `src/data/` for each feature
- Realistic sample data for demonstration
- Simulated "real-time" updates via setInterval

---

## 4. Component Hierarchy

```
App
├── Router
│   ├── LandingPage
│   ├── AttendeeApp
│   │   ├── AppLayout
│   │   │   ├── Header (Event info)
│   │   │   ├── MobileNav (Bottom nav)
│   │   │   └── Outlet
│   │   │       ├── MomentWallPage
│   │   │       ├── EnergyPage
│   │   │       ├── WheelPage
│   │   │       ├── PollPage
│   │   │       └── QAPage
│   └── AdminApp
│       ├── AdminLayout
│       │   ├── Sidebar
│       │   └── Outlet
│       ├── DashboardPage
│       ├── MomentsAdminPage
│       ├── PollsAdminPage
│       ├── QAAdminPage
│       ├── AttendeesPage
│       ├── FlowBuilderPage
│       └── FlowPreviewPage
```

---

## 5. Implementation Phases

### Phase 1: Foundation (Day 1)
- [ ] Initialize Vite + React + TypeScript project
- [ ] Setup Tailwind CSS
- [ ] Configure React Router
- [ ] Setup Zustand stores
- [ ] Create common UI components (Button, Card, Input, Modal)
- [ ] Create layout components

### Phase 2: Core Attendee Features (Day 2-3)
- [ ] Event Landing + Join flow
- [ ] Moment Wall (display + add)
- [ ] Energy Bar with animation
- [ ] Lucky Wheel with spin animation

### Phase 3: Engagement Features (Day 4)
- [ ] Live Poll (vote + results)
- [ ] Anonymous Q&A (submit + upvote)

### Phase 4: Organizer Dashboard (Day 5)
- [ ] Dashboard with stats
- [ ] Moment moderation
- [ ] Poll management
- [ ] Q&A management
- [ ] Attendee data export (CSV)

### Phase 5: Event Flow Builder (Day 5-6)
- [ ] Setup @xyflow/react
- [ ] Create BlockPalette component
- [ ] Create BlockNode components (7 types)
- [ ] Implement drag-drop from palette to canvas
- [ ] Implement connections between blocks
- [ ] Create BlockConfigPanel
- [ ] Implement UnlockCondition settings
- [ ] Implement Trigger settings

### Phase 6: Template System (Day 7)
- [ ] Create TemplateLibrary
- [ ] Implement SaveTemplateModal
- [ ] Implement LoadTemplateModal
- [ ] Add pre-built templates (4 templates)
- [ ] Test save/load flow

### Phase 7: Flow Preview (Day 8)
- [ ] Create FlowPlayer component
- [ ] Implement simulated attendee flow
- [ ] Show unlock status
- [ ] Debug panel

### Phase 8: Polish & Demo (Day 9)
- [ ] Animations and micro-interactions
- [ ] Responsive design verification
- [ ] Mock data population
- [ ] Demo flow testing

---

## 6. Key UI/UX Decisions

### 6.1 Color Palette
- **Primary:** Deep Purple (#7C3AED) - premium, event atmosphere
- **Secondary:** Electric Blue (#3B82F6) - energy, engagement
- **Accent:** Gold (#F59E0B) - celebration, prizes
- **Background:** Dark (#0F0F23) - event/night mode feel
- **Surface:** Dark Gray (#1A1A2E) - card backgrounds

### 6.2 Typography
- **Headings:** Bold, modern sans-serif
- **Body:** Clean, readable at small sizes (mobile-first)

### 6.3 Animations
- Moment Wall: Staggered fade-in
- Energy Bar: Smooth progress with particle burst on contribution
- Lucky Wheel: CSS spin with easing
- Poll results: Animated bar growth

---

## 7. Dependencies

### Production
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x",
  "zustand": "^4.x",
  "@xyflow/react": "^12.x",
  "framer-motion": "^11.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "canvas-confetti": "^1.7.x"
}
```

### Dev
```json
{
  "typescript": "^5.x",
  "vite": "^5.x",
  "@types/react": "^18.x",
  "tailwindcss": "^4.x",
  "autoprefixer": "^10.x",
  "postcss": "^8.x"
}
```

---

## 8. Success Criteria

### Attendee Features
1. ✅ All 7 block types functional with mock data
2. ✅ Mobile-responsive (primary target: phones)
3. ✅ Demo flow: Check-in → Energy → Wheel → Poll → Q&A

### Flow Builder
4. ✅ Drag-drop canvas với @xyflow/react
5. ✅ 7 block types có thể thêm vào canvas
6. ✅ Visual connections giữa các blocks
7. ✅ Unlock conditions configurable
8. ✅ Save/Load flow templates
9. ✅ Flow preview mode

### Organizer Dashboard
10. ✅ All 7 organizer pages accessible
11. ✅ CSV export produces valid file with attendee data
12. ✅ Smooth animations on Energy Bar and Lucky Wheel

---

## 9. Out of Scope (v1 Mockup)

- Real backend/API integration
- User authentication (attendees are anonymous)
- QR code generation
- Real-time WebSocket updates
- Email sending
- Analytics beyond basic counters

---

*Plan created: 2026-03-04*
*Updated: 2026-03-04 - Added Event Flow Builder*
*Focus: UI/UX Mockup for Feasibility Demo*
