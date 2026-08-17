<div align="center">

# 🛒 BluE-Commerce

### A modern, full-stack e-commerce platform built with architectural rigor, industry-standard testing, and security-first backend engineering.

![ADMIN PANEL](admin_panel.gif)
![BluE-Commerce Cart](cart.png)

<h3><a href="https://blue-commerce-frknecn3.vercel.app" target="_blank">🚀 CLICK HERE FOR LIVE DEMO</a></h3>
<br>

[![Next.js 14](https://img.shields.io/badge/Next.js%2014-App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20Strict-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tests](https://img.shields.io/badge/Tests-46%20Passing%20(Vitest)-22c55e?style=for-the-badge&logo=vitest)](https://vitest.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma%20ORM-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com)
[![Security](https://img.shields.io/badge/Security-OWASP%20Hardened-blue?style=for-the-badge&logo=shield)](https://owasp.org)

</div>

---

## 🏛️ The Architectural Decisions That Matter

### 1. Relational Migration: Firebase (NoSQL) ➔ PostgreSQL + Prisma (SQL)
E-commerce data models are fundamentally relational. An `Order` belongs to a `User`, consists of multiple `OrderItems`, and references specific `Products` tied to a `Category` and `Store`.
Migrating to PostgreSQL with Prisma solved architectural integrity at the schema level:
- **Referential Integrity & Foreign Keys**: Enforced by the engine, eliminating orphan cart/order records.
- **Atomic Transactions (`prisma.$transaction`)**: Guarantees payment event fulfillment and cart deletion succeed together or roll back completely.
- **Type-Safe Relational Queries**: Zero runtime type mismatches between frontend payloads and database records.

---

## ⚙️ Tech Stack & Architecture

| Layer | Technology | Key Capabilities |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Server Components (RSC), Server Actions, Streaming Suspense |
| **Language** | TypeScript 5.x | Strict mode, End-to-end type safety, Zod runtime validation |
| **Database** | PostgreSQL + Prisma ORM | Relational models, connection pooling, migration workflows |
| **Testing** | Vitest + React Testing Library | 46 Unit, Component, and API route integration tests |
| **Authentication** | NextAuth.js v4 + Bcrypt | JWT strategy, role-based access control (`ADMIN` / `USER`) |
| **Payments** | Stripe API | Server checkout sessions + cryptographic webhook verification |
| **State Management** | Redux Toolkit | Predictable client state for Cart, Wishlist, and UI drawers |
| **Styling & UI** | Tailwind CSS + Framer Motion | Light Blue design system, fluid responsive grids, micro-interactions |
| **Security** | Sliding Window Rate Limiting | IP-based brute-force & spam mitigation, OWASP HTTP headers |

---

## 🧪 Comprehensive Testing Suite (46 Tests Passing)

This repository enforces high code quality through an automated testing pyramid configured with **Vitest**, **React Testing Library**, and **Happy-DOM**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Core Logic & Unit Tests                                  │
│    ✓ Zod schema validation (passwords, CUID, product types) │
│    ✓ Redux Toolkit reducers (cartSlice, favoriteSlice, ui) │
│    ✓ Client price calculations & guest cart persistence     │
├─────────────────────────────────────────────────────────────┤
│ 2. Component & UI Interaction Tests                         │
│    ✓ ProductButtons quantity stepper & stock cap bounds     │
│    ✓ Race condition prevention on rapid double-click        │
│    ✓ LoginForm client-side validation & error outlines      │
│    ✓ CartModalProduct removal state with pending loader     │
├─────────────────────────────────────────────────────────────┤
│ 3. API Route & Backend Integration Tests                    │
│    ✓ POST /api/auth/check-email (validation & duplicates)   │
│    ✓ GET & POST /api/favorite (session guards & relations)  │
│    ✓ Sliding Window MemoryRateLimiter verification          │
└─────────────────────────────────────────────────────────────┘
```

### Running Tests Locally
```bash
# Run the entire test suite once
npm test

# Run tests in interactive watch mode
npm run test:watch

# Run a specific component or route test
npx vitest run src/components/__tests__/ProductButtons.test.tsx
```

---

## 🛡️ Security-First Backend Engineering

- **Password Hashing**: User credentials are encrypted with `bcrypt` (10 salt rounds) before database persistence.
- **Sliding Window Rate Limiting**: In-memory rate limiter protects sensitive endpoints (`/api/auth/register`, `/api/auth/check-email`) against bot registrations and enumeration attacks.
- **Cryptographic Webhook Verification**: Stripe webhooks parse raw payloads with `stripe.webhooks.constructEvent` to reject replay attacks and spoofing.
- **Hardened HTTP Response Headers**:
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options: SAMEORIGIN` (Clickjacking prevention)
  - `X-Content-Type-Options: nosniff` (MIME sniffing mitigation)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 🏗️ Core Application Modules

### 1. 💳 Stripe Server-Side Checkout & Webhook Fulfillment
Checkout sessions are generated strictly on the server. The client never touches Stripe secrets. Webhook events process order creation and cart clearing atomically inside a `prisma.$transaction`.

### 2. 🎛️ Protected Admin Management Hub (`/admin`)
- **Real-Time Platform Metrics**: Dynamic counters for total Products, Users, and Merchant Stores.
- **Catalog Management**: Live search, multi-column sorting, pagination, stock controls, and soft-delete/publish actions.
- **Sticky-Safe Layout**: Sub-header navigation with active route highlights and a collapsible sidebar drawer.

### 3. 🛍️ Enhanced Shopping Cart & Favorites
- **CartModal Popover**: Fast dropdown with click-outside dismissal, real-time total updates, and asynchronous removal state indicators.
- **Guest-to-User Cart Migration**: Guest carts saved in `localStorage` seamlessly synchronize to the user's database cart upon authentication.
- **Product Details & Race Condition Guard**: Dynamic quantity stepper capped at available stock, with state locking to prevent duplicate cart additions.

---

## 🗂️ Project Structure

```
blue-commerce/
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema with relational integrity
│   └── seed.ts                   # Database seed script (Faker.js)
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Authentication pages (login, register)
│   │   ├── (pages)/admin/        # Protected admin management suite
│   │   ├── (pages)/cart/         # Dedicated checkout & cart page
│   │   ├── (pages)/favorites/    # Wishlist grid with stock badges
│   │   └── api/                  # Route handlers (auth, cart, favorite, webhook)
│   ├── components/               # Reusable, accessible UI components
│   ├── lib/                      # Singletons (Prisma, Auth, Zod, RateLimiter)
│   ├── redux/                    # Redux Toolkit store, slices, and listeners
│   ├── test-utils/               # Test render helpers with Redux providers
│   └── utils/                    # Client and server utility functions
├── vitest.config.ts              # Vitest test runner configuration
└── package.json
```

---

## 🛠️ Local Setup Guide

**Prerequisites:** Node.js 18+, PostgreSQL database instance

```bash
# 1. Clone the repository
git clone https://github.com/frknecn3/blue-commerce.git
cd blue-commerce

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Configure: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, STRIPE_*, CLOUDINARY_*, EMAILJS_*

# 4. Generate Prisma Client and push database schema
npx prisma generate
npx prisma db push

# 5. (Optional) Seed test database
npm run seed

# 6. Execute test suite
npm test

# 7. Start development server
npm run dev
```

---

## 🌐 Environment Variables Reference

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URI |
| `NEXTAUTH_SECRET` | Secret key for JWT session signing |
| `NEXTAUTH_URL` | Base URL of the application (`http://localhost:3000`) |
| `STRIPE_SECRET_KEY` | Server-side Stripe API Secret Key |
| `STRIPE_WEBHOOK_SECRET` | Secret for verifying Stripe webhook signatures |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side publishable key |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Public key for EmailJS activation emails |
| `EMAILJS_PRIVATE_KEY` | Private key for EmailJS server-side sending |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary asset cloud name |

---

<div align="center">

Built with intentional architecture, type safety, and production-grade engineering standards.

**[Explore Live Demo →](https://blue-commerce-frknecn3.vercel.app)**

</div>
