<div align="center">
  <img src="public/logo.png" alt="RentalHub NG Logo" width="160" />

  <h1>RentalHub NG</h1>
  <p><strong>Verified off-campus accommodation for Nigerian university students</strong></p>

  <p>
    <a href="https://rentalhub.ng" target="_blank">🌐 Live Site</a> ·
    <a href="#features">Features</a> ·
    <a href="#tech-stack">Tech Stack</a> ·
    <a href="#getting-started">Getting Started</a> ·
    <a href="#project-structure">Project Structure</a>
  </p>

  ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
  ![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss)
  ![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
</div>

---

## Overview

RentalHub NG is a full-stack rental housing platform built for Nigerian university students. It connects students seeking off-campus accommodation with verified landlords and property agents near their campus.

The platform was initially launched for **BOUESTI (Bamidele Olumilua University of Education, Science & Technology) in Ikere-Ekiti** and is being expanded to serve multiple Nigerian universities including UNILAG, OAU, UI, UNIBEN, FUTA, UNILORIN, ABU, UNN, and Covenant University.

Key design principles:

- **Trust & Safety** — Landlords go through a document-based verification process before listings go live.
- **Accessibility** — Students and young landlords (many not tech-savvy) can navigate the platform with ease.
- **Fraud Prevention** — Perceptual image hashing automatically detects duplicate or AI-generated listing photos.
- **Multi-school** — Admins can filter the entire dashboard by institution, allowing one platform to serve many universities.

---

## Features

### For Students
- Browse and search verified off-campus properties filtered by location, price, and distance to campus
- Book a property directly from the listing page
- Track bookings from a personal dashboard
- Fully responsive — works on mobile and low-bandwidth connections

### For Landlords
- Create and manage property listings with photo uploads
- Step-by-step identity and ownership verification flow (government ID, selfie, proof of ownership)
- Dashboard with listing status, booking activity, and a verification status banner
- Support for young people acting on behalf of older landlords (with landlord consent declaration)

### For Admins
- Multi-school dashboard — filter all stats and data by university
- Review and approve/reject property listings with notes
- Review landlord verification submissions with approve/reject controls
- View platform-wide users, bookings, and property metrics

### Platform-wide
- Full SEO: Open Graph, Twitter cards, per-page metadata, `sitemap.xml`, `robots.txt`
- Fraud detection: perceptual hashing (aHash) + Hamming distance to flag duplicate or AI-generated images
- Role-based access control enforced at middleware level
- Password reset via email (Nodemailer)
- Clean `/unauthorized` page for access violations instead of silent redirects

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL via [Neon](https://neon.tech/) (serverless) |
| ORM | [Prisma 5](https://www.prisma.io/) |
| Auth | [NextAuth.js v4](https://next-auth.js.org/) + bcryptjs |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| Forms | React Hook Form + Zod |
| Email | Nodemailer |
| Image Processing | Sharp (perceptual hashing) |
| Deployment | [Vercel](https://vercel.com/) |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/               # Login, register, forgot/reset password
│   ├── (public)/             # Homepage, property listings, property detail
│   ├── (dashboards)/
│   │   ├── admin/            # Admin dashboard + property review
│   │   ├── landlord/         # Landlord dashboard, add listing, verification
│   │   └── student/          # Student dashboard
│   ├── api/
│   │   ├── auth/             # NextAuth + register + password reset
│   │   ├── properties/       # CRUD + status updates
│   │   ├── bookings/         # Booking creation and management
│   │   ├── uploads/          # File uploads with image analysis
│   │   ├── locations/        # Location lookup
│   │   ├── admin/            # summary, users, landlords, bookings
│   │   └── landlord/         # Verification submission
│   ├── unauthorized/         # Access denied page
│   ├── robots.ts             # SEO robots
│   ├── sitemap.ts            # Dynamic sitemap
│   └── icon.png              # Favicon (auto-resolved by Next.js)
├── components/               # Shared UI components
├── lib/
│   ├── auth.ts               # NextAuth config + authOptions
│   ├── prisma.ts             # Prisma client singleton
│   ├── image-analysis.ts     # Perceptual hashing & AI image detection
│   ├── schools.ts            # School → location keyword mapping
│   ├── email.ts              # Email templates + transporter
│   ├── rate-limit.ts         # Simple rate limiting
│   └── sanitize.ts           # Input sanitization
├── middleware.ts              # JWT-based route protection (role-aware)
└── types/                    # Shared TypeScript types
```

---

## Data Models

```
User
  ├── role: STUDENT | LANDLORD | ADMIN
  ├── verificationStatus: UNVERIFIED | UNDER_REVIEW | VERIFIED | REJECTED | SUSPENDED
  ├── governmentIdUrl, selfieUrl, ownershipProofUrl
  ├── isDirectOwner, landlordAware
  └── verificationNote, verificationSubmittedAt

Property
  ├── status: PENDING | APPROVED | REJECTED
  ├── price (NGN), distanceToCampus
  ├── amenities (JSON), images (JSON)
  └── → Location, landlord (User), bookings

Booking
  ├── status: PENDING | CONFIRMED | CANCELLED
  └── → student (User), property

Location
  └── name, classification

ImageHash
  ├── hash (64-bit aHash string)
  ├── flagged, flagReason
  └── → uploadedBy (User)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech/) PostgreSQL database
- An SMTP email provider (Gmail, SendGrid, etc.)

### 1. Clone the repository

```bash
git clone https://github.com/Mikaelson-1/RentalHub-Nigeria.git
cd RentalHub-Nigeria
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."        # Pooled connection for app
DIRECT_URL="postgresql://..."          # Direct connection (only needed for migrate dev)

# NextAuth
NEXTAUTH_SECRET="your-secret-here"    # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="RentalHub NG"

# Email (Nodemailer)
EMAIL_HOST="smtp.example.com"
EMAIL_PORT="587"
EMAIL_USER="you@example.com"
EMAIL_PASS="your-email-password"
EMAIL_FROM="RentalHub NG <noreply@rentalhub.ng>"
```

### 4. Push the database schema

```bash
npm run db:push
```

### 5. (Optional) Seed with demo data

```bash
npm run db:demo
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Push schema + generate Prisma + Next.js build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to DB (no migration files) |
| `npm run db:migrate` | Run Prisma migrations (interactive, dev only) |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed basic data |
| `npm run db:demo` | Seed demo data |

---

## User Roles & Flows

### Student
1. Register → Email verified → Browse properties
2. Click **Book Now** on a listing → Booking confirmed
3. View booking history on student dashboard

### Landlord
1. Register → Redirected to dashboard
2. Prompted by **verification banner** to complete identity & ownership verification
3. Submit: government ID photo, selfie, ownership proof, direct-owner declaration, landlord consent
4. Admin reviews documents → status moves to **VERIFIED**
5. Add property listings → Admin approves → Listing goes live

### Admin
1. Log in → Admin dashboard
2. Select a school from the dropdown to scope all stats and data
3. Review pending property listings → Approve or Reject (with note)
4. Review landlord verification submissions → Approve or Reject
5. Monitor users, bookings, and platform health

---

## Fraud Detection

The platform runs two automated checks on every uploaded image:

### 1. Perceptual Duplicate Detection
Uses **average hash (aHash)** via the `sharp` library:
- Resize image to 8×8 grayscale → compute mean pixel value
- Each pixel above mean = `1`, below = `0` → 64-bit hash string
- Hamming distance ≤ 8 bits between any two hashes → flagged as duplicate
- Prevents the same property photos being reused across multiple listings

### 2. AI / Synthetic Image Detection
5-signal heuristic (requires 2+ signals to flag):
- Missing or empty EXIF metadata
- Perfect-square dimensions (common AI output: 512×512, 1024×1024)
- Power-of-2 PNG widths without camera metadata
- AI-pattern filenames (`generated_`, `midjourney_`, `dalle_`, etc.)
- Unusually high resolution with no camera make/model in EXIF

Flagged images are rejected at upload time with a reason shown to the uploader.

---

## Multi-School Support

The admin dashboard supports filtering by institution via the `SCHOOL_LOCATION_KEYWORDS` map in `src/lib/schools.ts`. Each school maps to an array of nearby area names used to query properties by location.

Currently supported schools:

| School | Key Locations |
|--------|--------------|
| BOUESTI – Ikere-Ekiti | Uro, Afao, Odo Oja, Ajebandele, Amoye |
| UNILAG | Akoka, Yaba, Bariga, Surulere |
| OAU | Ile-Ife, Modakeke |
| UI | Ibadan, Bodija, Agbowo, Sango |
| UNIBEN | Benin, Ugbowo, Ekosodin |
| FUTA | Akure, Oba-Ile, Aule |
| UNILORIN | Ilorin, Tanke, Oke-Odo |
| ABU | Zaria, Samaru, Kongo |
| UNN | Nsukka, Odenigwe |
| Covenant University | Ota, Canaanland, Iyana-Iyesi |

To add a new school, add an entry to both `SCHOOL_OPTIONS` and `SCHOOL_LOCATION_KEYWORDS` in `src/lib/schools.ts`.

---

## Deployment

The app is deployed on **Vercel** at [rentalhub.ng](https://rentalhub.ng).

The build command runs schema sync before every deploy:

```bash
prisma db push --accept-data-loss && prisma generate && next build
```

This ensures the production database schema stays in sync with `prisma/schema.prisma` on every Vercel deployment without requiring interactive migration prompts.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes
4. Push and open a pull request

Please follow the existing code style (TypeScript strict mode, Zod validation on all API inputs, server components where possible).

---

## License

This project is private and proprietary. All rights reserved © 2025 The Mikaelson Initiative.
