# Rail Concession App

## Overview

A React Native mobile application built with Expo that digitizes India's railway concession process for college students. The app streamlines the application workflow from submission through college approval to railway authority final approval, reducing paperwork and processing time.

The system supports three user roles:
- **Students** - Submit concession applications, track status, view approved passes
- **College Admins** - Review and approve/reject student applications
- **Railway Admins** - Final approval of college-verified applications

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React Native/Expo)
- **Framework**: Expo SDK 54 with React Native 0.81
- **Navigation**: React Navigation v7 with native stack and bottom tabs
- **State Management**: TanStack React Query for server state, React Context for auth
- **Styling**: StyleSheet API with centralized theme constants (no styled-components)
- **Animations**: React Native Reanimated for micro-interactions

### Navigation Structure
- Auth Stack: Login → Phone/Email → OTP Verify → Profile Setup
- Student Tab Navigator: Home, History, Profile tabs (each with nested stack)
- Admin flows use modal stack screens from root navigator

### Backend (Express)
- Node.js with Express 5
- TypeScript with ESM modules
- Routes prefixed with `/api`
- CORS configured for Replit domains and localhost

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Located in `shared/schema.ts` (shared between client/server)
- **Validation**: Zod schemas generated via drizzle-zod
- **Current Storage**: In-memory storage class (`MemStorage`) - designed for easy swap to database

### Authentication Pattern
- OTP-based login for students (phone number)
- Email/password for admin users
- Token storage via expo-secure-store (native) or AsyncStorage (web)
- Auth state managed in React Context with persistent storage

### Project Structure
```
client/           # React Native app code
  components/     # Reusable UI components
  screens/        # Screen components
  navigation/     # Navigator configurations
  context/        # React Context providers
  hooks/          # Custom hooks
  lib/            # Utilities (storage, query client)
  constants/      # Theme, colors, typography
  types/          # TypeScript interfaces
server/           # Express backend
  routes.ts       # API route registration
  storage.ts      # Data access layer
  templates/      # HTML templates for web landing
shared/           # Shared code (schema, types)
```

## External Dependencies

### Core Services
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Expo Services**: expo-secure-store, expo-image-picker, expo-haptics

### Key npm Packages
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `@tanstack/react-query` - Data fetching and caching
- `react-native-reanimated` - Animation library
- `expo-image-picker` - Camera/photo library access for college ID upload

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `EXPO_PUBLIC_DOMAIN` - API server domain for client requests
- `REPLIT_DEV_DOMAIN` - Development domain (auto-set by Replit)

### Build Commands
- `npm run expo:dev` - Start Expo development server
- `npm run server:dev` - Start Express backend in development
- `npm run db:push` - Push schema changes to database