# Railway Concession Mobile App - Design Guidelines

## 1. Brand Identity

**Purpose**: Digitize India's railway concession process for college students, reducing paperwork and processing time.

**Aesthetic Direction**: **Institutional Trustworthy** - Government-inspired with modern refinement. Clean, authoritative, accessible to non-tech-savvy users. Instills confidence through clarity and simplicity, not decoration.

**Memorable Element**: Bold orange accent (Indian Railways brand color) paired with crisp blues. Status tracking with clear visual hierarchy. Government-stamp-style approval indicators.

## 2. Navigation Architecture

**Root Navigation**: Tab Navigation (Students only)

### Student Flow
- **Tab Bar** (3 tabs):
  - Home (application form + active pass)
  - History (past applications)
  - Profile (settings, logout)

### Admin Flows (Stack-only)
- College Admin: Dashboard → Application Review → Approval Screen
- Railway Authority: Dashboard → Final Approval

### Auth Stack
- Login Selection → Mobile OTP / Email Login → Profile Setup

## 3. Screen-by-Screen Specifications

### AUTH SCREENS

**Login Selection**
- Header: None (full-screen onboarding)
- Layout: Scrollable with top illustration, centered card with two login options
- Components: App logo, welcome text, two primary buttons (Mobile OTP, College Email), language selector
- Safe area: top: insets.top + 40, bottom: insets.bottom + 24

**OTP Verification**
- Header: Back button only (transparent)
- Layout: Centered form
- Components: 6-digit OTP input, resend timer, verify button
- Safe area: top: headerHeight + 32, bottom: insets.bottom + 24

**Profile Setup** (first-time only)
- Header: "Complete Profile" title, skip button (right)
- Layout: Scrollable form
- Components: Text inputs (name, college, department, year, PRN), submit button below form
- Safe area: top: 24, bottom: insets.bottom + 24

### STUDENT SCREENS

**Home Tab**
- Header: Transparent, college name as title, notification bell (right)
- Layout: Scrollable
- Content Blocks:
  - Active Pass Card (if exists): QR code, validity, journey details, download button
  - OR "Apply New Concession" card with CTA
  - Quick Stats: Total applications, approved, pending
- Safe area: top: headerHeight + 16, bottom: tabBarHeight + 24

**Concession Application Form**
- Header: "New Application", cancel (left), submit (right, disabled until valid)
- Layout: Scrollable form
- Components: Station autocomplete fields (source, destination), class selector (1st/2nd segmented control), duration chips (Monthly/Quarterly), reason dropdown, ID upload zone (camera/gallery), preview submitted details
- Safe area: top: 24, bottom: insets.bottom + 24

**History Tab**
- Header: Transparent, "History" title, filter icon (right)
- Layout: List (FlatList)
- Components: Application cards with status badge, tap to view details
- Empty state: Illustration + "No applications yet" + "Apply Now" button
- Safe area: top: headerHeight + 16, bottom: tabBarHeight + 24

**Application Details** (modal)
- Header: "Application Details", close (left)
- Layout: Scrollable
- Components: Status timeline, journey details, uploaded ID thumbnail, rejection reason (if rejected), download PDF button (if approved)
- Safe area: top: 24, bottom: insets.bottom + 24

**Profile Tab**
- Header: Transparent, "Profile" title
- Layout: Scrollable
- Components: Avatar + name, student details list, language selector, logout button (destructive)
- Safe area: top: headerHeight + 16, bottom: tabBarHeight + 24

### ADMIN SCREENS

**College Admin Dashboard**
- Header: "Admin Dashboard", menu icon (left), logout (right)
- Layout: Scrollable
- Components: Stat cards (pending, approved today), pending applications list
- Safe area: top: 24, bottom: insets.bottom + 24

**Application Review** (College Admin)
- Header: "Review Application", back (left)
- Layout: Scrollable
- Components: Student details, journey info, uploaded ID (zoomable), remarks input, approve/reject buttons (floating at bottom)
- Floating buttons safe area: bottom: insets.bottom + 16

**Railway Dashboard**
- Header: "Railway Authority", logout (right)
- Layout: List
- Components: College-approved applications list, final approval action
- Safe area: top: 24, bottom: insets.bottom + 24

## 4. Color Palette

**Primary**: #FF6600 (Indian Railways Orange)
**Primary Dark**: #CC5200
**Secondary**: #1E3A8A (Trust Blue)
**Background**: #F8F9FA
**Surface**: #FFFFFF
**Border**: #E5E7EB
**Text Primary**: #1F2937
**Text Secondary**: #6B7280
**Success**: #059669
**Warning**: #F59E0B
**Error**: #DC2626
**Pending**: #3B82F6

## 5. Typography

**Font**: System fonts (SF Pro for iOS, Roboto for Android) for maximum readability across devices.

**Type Scale**:
- H1: 28px, Bold (screen titles)
- H2: 22px, SemiBold (section headers)
- H3: 18px, SemiBold (card titles)
- Body: 16px, Regular (main content)
- Caption: 14px, Regular (labels, metadata)
- Small: 12px, Regular (fine print)

## 6. Visual Design

- Use Feather icons from @expo/vector-icons
- Touchables: 8px border-radius, subtle scale feedback (0.98)
- Cards: 12px border-radius, 1px border (Border color), no shadow
- Floating buttons: 2px shadow (offset: {width: 0, height: 2}, opacity: 0.10, radius: 2)
- Status badges: 16px border-radius, colored background with white text
- Forms: 8px input border-radius, focus state with Primary color border

## 7. Assets to Generate

**icon.png** - App icon with orange railway track symbol on white background
**WHERE USED**: Device home screen

**splash-icon.png** - Simplified railway track icon
**WHERE USED**: App launch screen

**empty-history.png** - Illustration of empty ticket folder
**WHERE USED**: History tab when no applications exist

**empty-pending.png** - Illustration of approved checkmark
**WHERE USED**: Admin dashboard when no pending applications

**login-illustration.png** - Illustration of train with student travelers
**WHERE USED**: Login selection screen top section

**avatar-default.png** - Generic student avatar silhouette
**WHERE USED**: Profile tab, application cards