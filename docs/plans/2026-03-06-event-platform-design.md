# Design: Event Platform - Core Features
Date: 2026-03-06

## Summary

Thiết kế 2 tính năng cốt lõi cho nền tảng sự kiện:
1. **Tạo Event**: Cho phép organizer tạo sự kiện với thông tin cơ bản, tự động sinh QR code
2. **User Participation**: User quét QR để xem event và chia sẻ ảnh/video
3. **Display Mode**: Chế độ trình chiếu trên màn hình lớn với slideshow

---

## Architecture

### Tech Stack (MVP - Demo)
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **State**: LocalStorage / IndexedDB
- **Storage**: Client-side (demo), Cloudflare R2 (production)

### Data Flow
```
User (Organizer)
    ↓ Create Event
LocalStorage/IndexedDB
    ↓ Generate QR
QR Code Display
    ↓ Scan QR
User (Guest)
    ↓ View/Upload
Gallery Display
    ↓ Display Mode
Big Screen Slideshow
```

---

## Component Breakdown

### 1. Event Creation (Organizer)

#### EventForm Component
| Field | Type | Required | Default |
|-------|------|----------|---------|
| eventName | text | Yes | - |
| description | text (500 char) | No | - |
| startDate | datetime | Yes | - |
| endDate | datetime | Yes | - |
| location | text | No | - |
| banner | image (multiple) | No | - |
| primaryColor | color picker | No | #6366f1 |
| requireInfo | boolean | No | false |
| infoFields | array | No | [] |

#### QRGenerator Component
- Auto-generate when event created
- URL format: `https://domain.com/event/{eventId}`
- Export: PNG + PDF
- Size: 300x300px (scalable)

#### Dashboard Component
- Event list management
- Stats: participants, media count, views
- Details: who uploaded what, timestamps
- Analytics: trends, popular content
- Export: ZIP (images + JSON metadata)

### 2. User Participation (Guest)

#### EventPage Component (3 tabs)
- **Tab 1 - Info**: Banner + event details
- **Tab 2 - Gallery**: Masonry layout, lazy load
- **Tab 3 - Upload**: Gallery picker + camera

#### UploadFlow
- Select from gallery OR capture camera
- Max file size: 200MB/event total
- Thumbnail generation (100KB each)
- Instant display (no moderation)

#### Entry Flow
```
Scan QR
    ↓
[Require Info?] → Yes → Form → Join Event
    ↓ No
Join Event → View Gallery
```

### 3. Display Mode (Big Screen)

#### DisplayView Component
- Fullscreen, landscape optimized
- Auto-refresh gallery every 10 seconds
- QR code + link in top-right corner
- Event info header (optional)

#### Slideshow Configuration
- Interval: 10 seconds
- Transition: Fade
- Order: Random
- Pause on hover (optional)

---

## Data Models

### Event
```typescript
interface Event {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  banners: string[]; // base64 or blob URLs
  primaryColor: string;
  requireInfo: boolean;
  infoFields: InfoField[];
  status: 'draft' | 'active' | 'ended';
  createdAt: string;
  updatedAt: string;
}
```

### Media
```typescript
interface Media {
  id: string;
  eventId: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  uploaderName?: string;
  uploadedAt: string;
}
```

### InfoField
```typescript
interface InfoField {
  id: string;
  label: string;
  required: boolean;
  type: 'text' | 'email' | 'phone';
}
```

---

## UI/UX Specifications

### Layout
- **Mobile**: 100% width, single column
- **Tablet**: 768px max-width
- **Desktop**: 1200px max-width

### Color System
- Primary: Customizable (organizer picks)
- Background: White (#ffffff)
- Text: Dark gray (#1f2937)
- Accent: Primary color

### Typography
- Font: System sans-serif
- Headings: 24px / 20px / 16px (h1/h2/h3)
- Body: 14px
- Small: 12px

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## Display Mode Specifications

### Layout
- Full viewport width/height
- 16:9 optimized
- QR in top-right: 150x150px
- Slideshow: center, object-fit contain
- Event info: top-left overlay

### Slideshow
- 10 second interval
- Fade transition: 500ms
- Random order
- Auto-loop

---

## Edge Cases

1. **No internet**: Show cached content, disable upload
2. **Storage full**: Warn user, prevent new uploads
3. **Large images**: Auto-resize to max 2MB before storing
4. **Event ended**: Disable upload, show "Event ended" message
5. **No banner**: Show placeholder with event name

---

## Implementation Priority

### Phase 1: Core (MVP)
1. Event form with basic fields
2. QR code generation
3. Event page with tabs
4. Gallery masonry display
5. Media upload (gallery + camera)
6. Basic dashboard

### Phase 2: Enhanced
1. Custom color picker
2. Display Mode
3. Slideshow
4. ZIP export
5. Stats/Analytics

### Phase 3: Polish
1. Dashboard details
2. Multiple banners
3. Rich gallery features
4. Performance optimization

---

## Open Questions

1. **URL routing**: Use hash routing or regular routing?
2. **ID generation**: UUID or short ID?
3. **Image compression quality**: 80% JPEG?
4. **Thumbnail size**: 300px width?

---

## Next Steps

1. Create implementation plan using writing-plans skill
2. Set up project structure
3. Build core components
4. Test with local storage
