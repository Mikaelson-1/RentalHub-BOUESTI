<div align="center">
  <img src="public/logo-export/logo-horizontal-color.svg" alt="RentalHub" width="260" />

  <p><strong>Verified off-campus accommodation for university students in Nigeria</strong></p>

  <p>
    <a href="https://rentalhub.mikaelsoninitiative.org" target="_blank">Live Site</a> ·
    <a href="#features">Features</a> ·
    <a href="#architecture">Architecture</a> ·
    <a href="#tech-stack">Tech Stack</a> ·
    <a href="#getting-started">Getting Started</a>
  </p>

  ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
  ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
  ![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
</div>

---

## Overview

RentalHub is a verified student housing platform that connects Nigerian university students with landlords near their campus. The platform covers the full lifecycle — listing discovery and inspection requests through to secure booking, escrow payment, and move-in confirmation.

**Currently live for BOUESTI (Bamidele Olumilua University of Education, Science & Technology, Ikere-Ekiti)** — multi-school architecture is ready to expand to additional institutions.

Key design principles:

- **Trust & Safety** — Every listing is manually reviewed by our admin team before going live. Landlords submit a government ID, selfie, and proof of ownership before they can publish.
- **Inspector network** — Campus inspectors (registered students) visit properties on request and submit photo reports so remote students know exactly what they're paying for.
- **Secure Payments** — Students pay via Paystack. Funds are held in escrow until the student confirms move-in, then released to the landlord by an admin.
- **Zero agent fees** — Students pay only rent. No agent commissions, no hidden charges.

This repository is the **frontend** application. The backend API (Prisma 6 + Neon PostgreSQL) is a separate service deployed at `rentalhub-backend-blue.vercel.app`.

---

## Features

### For Students
- Browse and search verified off-campus properties — filter by location, price, and campus
- Request a property inspection from a campus inspector before committing to a booking
- Book directly from the listing page and pay securely into escrow via Paystack
- Sign a tenancy agreement before payment is processed
- Set a move-in date and confirm move-in to trigger the landlord payout
- Track all bookings and download payment receipts from a personal dashboard

### For Landlords
- Create and manage listings with photo uploads (Cloudinary + Vercel Blob)
- Step-by-step identity and ownership verification flow
- Register a bank account for automatic payout after tenant move-in confirmation
- Dashboard with listing status, booking activity, earnings overview, and verification status

### For Inspectors
- Accept and fulfil inspection jobs for properties near your campus
- Submit photo reports and condition assessments via the inspector dashboard
- Track inspection history and earnings from a dedicated dashboard
- Apply to become an inspector through the public `/inspector-signup` page

### For Admins
- Multi-school dashboard — filter all data by university
- Review and approve or reject listings, with notes sent back to the landlord
- Review landlord verification submissions — approve or reject
- Manage users — suspend, unsuspend, change roles
- Pending Payouts panel — receives a notification when a student confirms move-in and manually marks the bank transfer as paid
- Monitor inspector network and manage applications

### Platform-wide
- ISR public pages — property listings and property detail pages are server-rendered with a 5-minute cache
- Full SEO: per-page metadata, Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`
- In-app notification system with bell icon and mark-as-read
- Responsive — mobile-first design across all pages
- `httpOnly` role cookie for secure, server-readable role state

---

## Architecture

### Frontend ↔ Backend

The frontend is a Next.js 15 App Router application. It communicates with a separate backend API service for all data operations. On public pages, server components fetch directly from the backend at build/revalidation time using ISR — no client-side waterfall on initial load.

```
Browser  ──→  Next.js Frontend (Vercel)
                  │
                  ├── RSC (ISR, revalidate: 300s)  ──→  Backend API
                  ├── Client fetch (campus change, auth)  ──→  Backend API
                  └── /api/auth/set-session  (httpOnly role cookie)
```

### Auth

Auth uses a custom JWT (HS256, 2-hour expiry) issued by the backend. On login the token and user object are stored in `localStorage` under the key `rh_auth = { token, user }`. The role is also written to an `httpOnly` cookie via `/api/auth/set-session` for server-readable access. Google OAuth is supported via `@react-oauth/google` and is scoped to the `(auth)` layout only.

### Payment & Escrow Flow

```
Student pays via Paystack
        ↓
  Payment verified → booking marked PAID
        ↓
  Student signs tenancy agreement
        ↓
  Student sets move-in date → clicks "Confirm move-in"
        ↓
  Admin receives notification with landlord bank details
        ↓
  Admin manually transfers funds to landlord's bank
        ↓
  Admin clicks "Mark as Paid" → both parties notified
```

### Directory Structure

```
src/
├── app/
│   ├── (auth)/               # Login, register, Google OAuth, verify-email, forgot/reset password
│   ├── (public)/             # Home, /properties, /properties/[id], /about, /help, /safety, /privacy, /terms
│   ├── (dashboards)/
│   │   ├── admin/            # Admin dashboard — listings, users, verifications, bookings, payouts
│   │   ├── landlord/         # Landlord dashboard, add/edit listing, verification, earnings
│   │   ├── student/          # Student dashboard, booking management, receipt
│   │   └── inspector/        # Inspector dashboard, job board, inspection reports
│   └── api/
│       └── auth/set-session/ # POST/DELETE — writes httpOnly rh_role cookie
├── components/rh/
│   ├── app.tsx               # AppProvider, useApp, useViewport — auth state, campus, navigation
│   └── ui.tsx                # Design system: Button, Card, PropertyCard, PublicNav, Footer, …
└── lib/rh/
    ├── api.ts                # Client-side API helpers (fetch with JWT)
    ├── server-api.ts         # Server-only ISR fetchers (properties, locations)
    └── theme.ts              # Tokens (T), icon helpers (I)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React Server Components, ISR) |
| UI | React 19.2 |
| Language | TypeScript 5 (strict mode) |
| Styling | Inline styles with a shared token system (`lib/rh/theme.ts`) |
| Auth | Custom JWT HS256 (2-hour expiry) + Google OAuth (`@react-oauth/google`) |
| Payments | Paystack (REST API) |
| Image Optimisation | `next/image` — Cloudinary + Vercel Blob (property photos) |
| Inspector Documents | Cloudflare R2 |
| Rate Limiting | Upstash Redis |
| Error Monitoring | Sentry (`withSentryConfig`) |
| Email | Resend API |
| Deployment | Vercel — `rentalhub.mikaelsoninitiative.org` |

---

## Public Routes

| Route | Description |
|---|---|
| `/` | Home — hero, how it works, featured properties |
| `/properties` | Property search — ISR with client campus filter |
| `/properties/[id]` | Property detail — ISR, booking CTA, inspection request |
| `/about` | About RentalHub — our story, values, team |
| `/help` | Help Centre — accordion FAQ, contact options |
| `/safety` | Safety & Trust — four-layer protection model |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A running instance of the RentalHub backend API (or the deployed backend URL)
- A Paystack account (test keys)
- A Google OAuth client ID (for Google login)
- Upstash Redis (for rate limiting)
- Sentry DSN (for error monitoring)

### 1. Clone and install

```bash
git clone https://github.com/Mikaelson-1/RentalHub-Nigeria.git
cd RentalHub-Frontend
npm install
```

### 2. Configure environment variables

Create `.env.local`:

```env
# Backend API
NEXT_PUBLIC_API_BASE="https://rentalhub-backend-blue.vercel.app"

# Auth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."

# Rate limiting
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Monitoring
NEXT_PUBLIC_SENTRY_DSN="https://..."
SENTRY_AUTH_TOKEN="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Run

```bash
npm run dev
```

---

## Deployment

The application is deployed on Vercel at **rentalhub.mikaelsoninitiative.org**.

```bash
npx vercel --prod
```

---

## License

This project is **private and proprietary**. All rights reserved © 2026 The Mikaelson Initiative. Unauthorised copying, distribution, or use of any part of this codebase is strictly prohibited.
