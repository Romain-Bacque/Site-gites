# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Holiday rental (gites) booking website with a monorepo structure: `/client` (Next.js 16 frontend) and `/server` (Express backend with MongoDB).

## Common Commands

### Client (from `/client`)
```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Jest tests
```

### Server (from `/server`)
```bash
npm run dev          # Start with nodemon + debug logs
npm run build        # TypeScript compile + copy email templates
npm run start        # Production server
```

## Architecture

### Frontend (`/client`)
- **Next.js 16** with App Router and `[locale]` dynamic segments for i18n (next-intl)
- **State**: Redux Toolkit for auth/menu/loading state, React Query for server data
- **API layer**: Axios instance in `/app/lib/api.tsx` with CSRF token handling
- **Styling**: Tailwind CSS v4, CSS Modules, MUI components
- **Route groups**: `(auth)` for login/profile/password-reset, `(admin)` for bookings management

### Backend (`/server`)
- **Express** with TypeScript
- **MongoDB/Mongoose** models: User, Shelter, Booking, Image, Rate
- **Auth**: JWT in httpOnly cookies, bcrypt hashing, email verification flow
- **Routers**: authRouter, shelterRouter, adminRouter
- **Middleware**: `checkLogged` (admin only), `checkAuthenticated` (any user), CSRF protection

### Key Patterns

**Authentication flow:**
1. Register with email verification
2. JWT token (24h) stored in httpOnly secure cookie
3. CSRF token fetched via `/createCSRF` and sent in `x-csrf-token` header
4. Password reset via email token links

**API requests:**
- All state-changing requests require CSRF token
- Credentials included (`withCredentials: true`)
- Error handling via React Query's `onError` callbacks

**Form validation:**
- Client: `useInput` hook with type-based validation (email, password strength, phone)
- Server: Joi schemas with joi-password extension for password rules

## Environment Variables

### Client (`.env`)
- `NEXT_PUBLIC_API_BASE_URL` - Backend URL
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA public key

### Server (`.env`)
- `DB_URL` - MongoDB connection string
- `ACCESS_TOKEN_SECRET` - JWT signing secret
- `CORS_ORIGIN` - Allowed frontend origin
- `CLOUDINARY_*` - Image storage credentials
- `RESEND_*` - Email service credentials

## File Organization

```
client/app/
├── [locale]/           # i18n routes (fr, en)
│   ├── (auth)/         # Auth pages: login, profile, reset-password
│   └── (admin)/        # Admin pages: bookings
├── components/
│   ├── Layout/         # Feature components (Booking, Gallery, Header)
│   └── UI/             # Reusable components (Card, Button, Modal)
├── hooks/              # Custom hooks (use-input, use-query, use-store)
├── lib/api.tsx         # Axios instance + all API functions
└── store/              # Redux slices (auth, menu, loading)

server/app/
├── controllers/        # Route handlers
├── models/             # Mongoose schemas
├── router/             # Express routers
├── validation/         # Joi schemas
├── middlewares.ts      # Auth + CSRF middleware
└── utilities/          # Email handlers, Cloudinary, error handling
```

## Internationalization

- Primary language: French (fr)
- Translations in `/client/public/messages/{locale}.json`
- All user-facing strings use `useTranslations()` hook from next-intl
