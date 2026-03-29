# Frontend Components & UI

<cite>
**Referenced Files in This Document**
- [layout.tsx](file://src/app/layout.tsx)
- [page.tsx](file://src/app/page.tsx)
- [globals.css](file://src/app/globals.css)
- [login/page.tsx](file://src/app/login/page.tsx)
- [register/page.tsx](file://src/app/register/page.tsx)
- [unauthorized/page.tsx](file://src/app/unauthorized/page.tsx)
- [auth.ts](file://src/lib/auth.ts)
- [middleware.ts](file://src/middleware.ts)
- [auth/route.ts](file://src/app/api/auth/[...nextauth]/route.ts)
- [auth/register/route.ts](file://src/app/api/auth/register/route.ts)
- [properties/route.ts](file://src/app/api/properties/route.ts)
- [utils.ts](file://src/lib/utils.ts)
- [tailwind.config.ts](file://tailwind.config.ts)
- [package.json](file://package.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes the RentalHub-BOUESTI frontend components and user interface. It covers the application layout, home page, property browsing interface, registration and login forms, and unauthorized access handling. It explains the Tailwind CSS styling approach, responsive design, component composition patterns, form validation and error handling, user feedback mechanisms, accessibility considerations, component hierarchy, state management patterns, and integration with backend APIs. It also addresses mobile responsiveness and cross-browser compatibility.

## Project Structure
The frontend is built with Next.js App Router. Pages are organized under src/app with dedicated routes for the home page, login, registration, and unauthorized access. Global styles and Tailwind configuration define the design system. Authentication is handled via NextAuth.js with a credentials provider and protected routes via middleware. API routes under src/app/api implement backend integration for authentication, property listings, and related operations.

```mermaid
graph TB
subgraph "App Router"
L["layout.tsx"]
H["page.tsx (Home)"]
LG["login/page.tsx"]
RG["register/page.tsx"]
UA["unauthorized/page.tsx"]
end
subgraph "Lib"
AU["lib/auth.ts"]
UT["lib/utils.ts"]
end
subgraph "Middleware"
MW["middleware.ts"]
end
subgraph "API Routes"
AR["api/auth/[...nextauth]/route.ts"]
RR["api/auth/register/route.ts"]
PR["api/properties/route.ts"]
end
subgraph "Styling"
GC["app/globals.css"]
TW["tailwind.config.ts"]
end
L --> H
L --> LG
L --> RG
L --> UA
LG --> AR
RG --> RR
H --> PR
AU --> AR
MW --> LG
MW --> RG
MW --> UA
GC --> H
GC --> LG
GC --> RG
GC --> UA
TW --> GC
```

**Diagram sources**
- [layout.tsx](file://src/app/layout.tsx)
- [page.tsx](file://src/app/page.tsx)
- [login/page.tsx](file://src/app/login/page.tsx)
- [register/page.tsx](file://src/app/register/page.tsx)
- [unauthorized/page.tsx](file://src/app/unauthorized/page.tsx)
- [auth.ts](file://src/lib/auth.ts)
- [middleware.ts](file://src/middleware.ts)
- [auth/route.ts](file://src/app/api/auth/[...nextauth]/route.ts)
- [auth/register/route.ts](file://src/app/api/auth/register/route.ts)
- [properties/route.ts](file://src/app/api/properties/route.ts)
- [globals.css](file://src/app/globals.css)
- [tailwind.config.ts](file://tailwind.config.ts)

**Section sources**
- [layout.tsx](file://src/app/layout.tsx)
- [page.tsx](file://src/app/page.tsx)
- [login/page.tsx](file://src/app/login/page.tsx)
- [register/page.tsx](file://src/app/register/page.tsx)
- [unauthorized/page.tsx](file://src/app/unauthorized/page.tsx)
- [globals.css](file://src/app/globals.css)
- [tailwind.config.ts](file://tailwind.config.ts)

## Core Components
- Application shell and metadata: The root layout sets metadata, fonts, and global styles, ensuring consistent branding and typography across pages.
- Home page: Features hero content, area cards, and a call-to-action for landlords, with responsive grid layouts and gradient backgrounds.
- Login page: A glass-morphism card with styled inputs and a submit button, integrating with NextAuth credentials provider.
- Registration page: Role selection (student/landlord), form fields, and submission to the registration API endpoint.
- Unauthorized page: Access denied messaging with navigation options to home or login.
- Utilities: Shared helpers for class merging, currency formatting, dates, truncation, parsing arrays, initials, slugs, and safe search param building.

Key styling and composition patterns:
- Tailwind utilities and custom components/classes (buttons, cards, inputs, badges, skeletons) defined in global CSS.
- Responsive breakpoints (sm, lg) drive layout changes across devices.
- Gradient backgrounds and backdrop filters create depth and visual appeal.
- Animation utilities (fade-in, slide-in, pulse) enhance perceived performance and UX.

**Section sources**
- [layout.tsx](file://src/app/layout.tsx)
- [page.tsx](file://src/app/page.tsx)
- [login/page.tsx](file://src/app/login/page.tsx)
- [register/page.tsx](file://src/app/register/page.tsx)
- [unauthorized/page.tsx](file://src/app/unauthorized/page.tsx)
- [globals.css](file://src/app/globals.css)
- [utils.ts](file://src/lib/utils.ts)

## Architecture Overview
The frontend integrates tightly with NextAuth for authentication and with API routes for data operations. Middleware enforces role-based access control and redirects to unauthorized when necessary. The design system is centralized in Tailwind configuration and global CSS.

```mermaid
sequenceDiagram
participant U as "User"
participant PG as "Next.js Page"
participant NA as "NextAuth Handler"
participant AP as "API Route"
participant DB as "Prisma"
U->>PG : "Submit login form"
PG->>NA : "POST credentials"
NA->>DB : "Lookup user by email"
DB-->>NA : "User record"
NA->>NA : "Verify password and status"
NA-->>PG : "Session/JWT"
PG-->>U : "Redirect to dashboard/home"
U->>PG : "Submit registration"
PG->>AP : "POST /api/auth/register"
AP->>DB : "Create user with hashed password"
DB-->>AP : "New user"
AP-->>PG : "201 Created"
PG-->>U : "Success feedback"
```

**Diagram sources**
- [login/page.tsx](file://src/app/login/page.tsx)
- [auth/route.ts](file://src/app/api/auth/[...nextauth]/route.ts)
- [auth/register/route.ts](file://src/app/api/auth/register/route.ts)
- [auth.ts](file://src/lib/auth.ts)

**Section sources**
- [auth.ts](file://src/lib/auth.ts)
- [auth/route.ts](file://src/app/api/auth/[...nextauth]/route.ts)
- [auth/register/route.ts](file://src/app/api/auth/register/route.ts)
- [middleware.ts](file://src/middleware.ts)

## Detailed Component Analysis

### Application Layout and Global Styles
- Root layout defines metadata, Open Graph tags, and font preloads. The body applies anti-aliasing for crisp rendering.
- Global CSS establishes:
  - CSS custom properties for brand colors and shadows.
  - Base resets and typography.
  - Utility classes for buttons, cards, inputs, badges, containers, gradients, and animations.
  - Scrollbar customization for webkit-based browsers.
- Tailwind configuration extends color palettes for brand and primary, sets font families, and enables gradients.

Responsive design:
- Grids and flex utilities adapt columns and alignment at small and large screens.
- Max widths and horizontal paddings ensure content remains readable on wide screens.

Accessibility:
- Proper contrast ratios for text and backgrounds.
- Focus-visible states via Tailwind utilities.
- Semantic HTML and ARIA-free markup relying on native semantics.

**Section sources**
- [layout.tsx](file://src/app/layout.tsx)
- [globals.css](file://src/app/globals.css)
- [tailwind.config.ts](file://tailwind.config.ts)

### Home Page Components
- Hero section: Full-screen background gradient, animated decorative blobs, and a centered call-to-action block with two CTAs.
- Stats bar: Semi-transparent backdrop-filter bar with three metrics.
- Areas section: Responsive grid of clickable area cards linking to filtered property lists.
- Landlord CTA: Dark-themed section encouraging landlords to list properties.

Composition patterns:
- Reusable animation utilities for staggered entrance.
- Utility classes for button and card elevation.
- Dynamic links with encoded query parameters.

**Section sources**
- [page.tsx](file://src/app/page.tsx)

### Login Form
- Glass-morphism card with backdrop blur and subtle borders.
- Styled inputs with dark theme and focus states.
- Submit button with gradient and hover effects.
- Navigation to registration page.

Integration with backend:
- Form posts to NextAuth credentials provider endpoint.
- On success, NextAuth manages session and redirects per configured pages.

Validation and feedback:
- HTML5 required attributes on inputs.
- Backend validation errors surfaced by NextAuth pages (handled by NextAuth UI).

**Section sources**
- [login/page.tsx](file://src/app/login/page.tsx)
- [auth/route.ts](file://src/app/api/auth/[...nextauth]/route.ts)
- [auth.ts](file://src/lib/auth.ts)

### Registration Form
- Role selector with radio inputs styled as bordered cards with checked state.
- Fields for full name, email, and password with minimum length requirement.
- Submission to the registration API endpoint.

Backend integration:
- API validates presence, role, password length, and uniqueness.
- Hashes passwords and creates a user with unverified status.
- Returns structured success/error responses.

Form validation and error handling:
- Client-side: required fields and minlength.
- Server-side: explicit checks and appropriate HTTP status codes.
- Error messages returned as JSON for potential client-side display.

**Section sources**
- [register/page.tsx](file://src/app/register/page.tsx)
- [auth/register/route.ts](file://src/app/api/auth/register/route.ts)

### Unauthorized Access Handling
- Dedicated page with lock icon, descriptive message, and navigation to home or login.
- Triggered by middleware when role-based access is denied.

Middleware enforcement:
- Redirects unauthenticated users to login.
- Guards admin, landlord, and student dashboards based on JWT token claims.
- Redirects to unauthorized when roles mismatch.

**Section sources**
- [unauthorized/page.tsx](file://src/app/unauthorized/page.tsx)
- [middleware.ts](file://src/middleware.ts)

### Property Browsing Interface
- The home page’s area cards link to property listings with location filters.
- API route supports filtering by location, status, price range, pagination, sorting, and ordering.
- Responses include items, totals, and pagination metadata.

Composition patterns:
- Search params building via shared utilities.
- Consistent badge and card components for property entries.

**Section sources**
- [page.tsx](file://src/app/page.tsx)
- [properties/route.ts](file://src/app/api/properties/route.ts)
- [utils.ts](file://src/lib/utils.ts)

### Tailwind CSS Styling Approach and Responsive Design
- Centralized design tokens via CSS variables and Tailwind theme extensions.
- Utility-first approach with custom component classes for buttons, cards, inputs, and badges.
- Responsive utilities (sm, lg) ensure appropriate spacing and layout scaling.
- Animations and transitions provide subtle motion feedback.

Cross-browser compatibility:
- Webkit scrollbar customization for Chromium-based browsers.
- Font loading via Google Fonts and system-ui fallbacks.
- CSS custom properties supported across modern browsers; gradients and backdrop filters widely supported.

Mobile responsiveness:
- Flexible grids and padding scale across breakpoints.
- Touch-friendly button sizes and spacing.
- Minimal horizontal scrolling with constrained max widths.

**Section sources**
- [globals.css](file://src/app/globals.css)
- [tailwind.config.ts](file://tailwind.config.ts)
- [page.tsx](file://src/app/page.tsx)

### Component Composition Patterns
- Utility-first composition: combine base utilities with variant modifiers.
- Reusable component classes (buttons, cards, inputs) encapsulate common styles.
- Animation utilities enable staggered and entrance effects.
- Container utilities centralize max-width and padding.

State management patterns:
- Client-side: NextAuth manages authentication state via JWT and session storage.
- Server-side: API routes handle validation, persistence, and response formatting.
- Utilities centralize shared transformations and formatting.

**Section sources**
- [globals.css](file://src/app/globals.css)
- [auth.ts](file://src/lib/auth.ts)
- [utils.ts](file://src/lib/utils.ts)

### Accessibility Considerations
- Sufficient color contrast for text and interactive elements against backgrounds.
- Focus-visible indicators via default browser styles.
- Semantic structure with headings and labels aligned with form controls.
- Text alternatives implicit via labels and button text; no missing alt attributes observed.

**Section sources**
- [globals.css](file://src/app/globals.css)
- [login/page.tsx](file://src/app/login/page.tsx)
- [register/page.tsx](file://src/app/register/page.tsx)

## Dependency Analysis
The frontend depends on Next.js App Router, NextAuth for authentication, and Prisma for database operations. Tailwind CSS and PostCSS provide styling. Middleware enforces route protection.

```mermaid
graph LR
P["package.json"]
TWC["tailwind.config.ts"]
GCSS["globals.css"]
LYT["layout.tsx"]
HP["page.tsx"]
LGN["login/page.tsx"]
REG["register/page.tsx"]
UN["unauthorized/page.tsx"]
MID["middleware.ts"]
AUTH["lib/auth.ts"]
ARH["api/auth/[...nextauth]/route.ts"]
RRG["api/auth/register/route.ts"]
PRP["api/properties/route.ts"]
P --> TWC
TWC --> GCSS
GCSS --> LYT
LYT --> HP
LYT --> LGN
LYT --> REG
LYT --> UN
MID --> LGN
MID --> REG
MID --> UN
AUTH --> ARH
LGN --> ARH
REG --> RRG
HP --> PRP
```

**Diagram sources**
- [package.json](file://package.json)
- [tailwind.config.ts](file://tailwind.config.ts)
- [globals.css](file://src/app/globals.css)
- [layout.tsx](file://src/app/layout.tsx)
- [page.tsx](file://src/app/page.tsx)
- [login/page.tsx](file://src/app/login/page.tsx)
- [register/page.tsx](file://src/app/register/page.tsx)
- [unauthorized/page.tsx](file://src/app/unauthorized/page.tsx)
- [middleware.ts](file://src/middleware.ts)
- [auth.ts](file://src/lib/auth.ts)
- [auth/route.ts](file://src/app/api/auth/[...nextauth]/route.ts)
- [auth/register/route.ts](file://src/app/api/auth/register/route.ts)
- [properties/route.ts](file://src/app/api/properties/route.ts)

**Section sources**
- [package.json](file://package.json)
- [tailwind.config.ts](file://tailwind.config.ts)
- [globals.css](file://src/app/globals.css)
- [layout.tsx](file://src/app/layout.tsx)
- [page.tsx](file://src/app/page.tsx)
- [login/page.tsx](file://src/app/login/page.tsx)
- [register/page.tsx](file://src/app/register/page.tsx)
- [unauthorized/page.tsx](file://src/app/unauthorized/page.tsx)
- [middleware.ts](file://src/middleware.ts)
- [auth.ts](file://src/lib/auth.ts)
- [auth/route.ts](file://src/app/api/auth/[...nextauth]/route.ts)
- [auth/register/route.ts](file://src/app/api/auth/register/route.ts)
- [properties/route.ts](file://src/app/api/properties/route.ts)

## Performance Considerations
- CSS animations and transitions are lightweight and scoped to UI feedback.
- Images are not rendered in the provided pages; when used, lazy-loading and modern formats should be considered.
- Minimizing re-renders by leveraging server-rendered pages and client-side navigation.
- Tailwind purging is configured via content globs to reduce bundle size.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Authentication failures:
  - Verify NEXTAUTH_SECRET is set and consistent.
  - Check Prisma user records and password hashing.
  - Inspect NextAuth callback token/session propagation.
- Registration errors:
  - Confirm email uniqueness and password length constraints.
  - Review API error responses for validation messages.
- Access denied:
  - Ensure JWT token contains correct role claims.
  - Verify middleware matchers and redirect logic.

**Section sources**
- [auth.ts](file://src/lib/auth.ts)
- [auth/register/route.ts](file://src/app/api/auth/register/route.ts)
- [middleware.ts](file://src/middleware.ts)

## Conclusion
RentalHub-BOUESTI’s frontend employs a clean, utility-driven design system with Tailwind CSS and a cohesive global stylesheet. The layout, home page, and forms are responsive and accessible, with clear composition patterns. Authentication is integrated via NextAuth with robust middleware protection and API-backed registration. The property browsing interface leverages server-side filtering and pagination. Together, these components deliver a consistent, user-friendly experience across devices.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### API Definitions
- POST /api/auth/register
  - Method: POST
  - Body: { name: string, email: string, password: string, role?: "STUDENT" | "LANDLORD" }
  - Success: 201 Created with user data
  - Errors: 400 Bad Request (validation), 409 Conflict (duplicate email), 500 Internal Server Error

- GET /api/properties
  - Query: location, status, minPrice, maxPrice, page, pageSize, sortBy, sortOrder
  - Success: 200 OK with items, total, page, pageSize, totalPages
  - Errors: 500 Internal Server Error

- POST /api/properties
  - Body: { title: string, description: string, price: number, locationId: string, distanceToCampus?: number, amenities?: string[], images?: string[] }
  - Success: 201 Created with property data
  - Errors: 400 Bad Request (validation), 401 Unauthorized (not authenticated), 403 Forbidden (role mismatch), 500 Internal Server Error

- NextAuth Credentials Provider
  - Endpoint: /api/auth/[...nextauth]
  - Behavior: Validates credentials, checks verification status, returns JWT/session

**Section sources**
- [auth/register/route.ts](file://src/app/api/auth/register/route.ts)
- [properties/route.ts](file://src/app/api/properties/route.ts)
- [auth/route.ts](file://src/app/api/auth/[...nextauth]/route.ts)
- [auth.ts](file://src/lib/auth.ts)