# Auraveda Herbal - Architecture & File System Guide

Welcome to the Auraveda Herbal project! This document serves as a guide for new developers to understand the project structure, technology stack, and how the file system is organized.

## Technology Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router paradigm)
- **Language:** TypeScript
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** Tailwind CSS (implied via PostCSS)
- **Deployment:** Nginx (via `nginx-production.conf` and `deploy.sh`)

## High-Level Directory Structure

The project follows standard Next.js conventions with a few custom directories for specific features.

```text
auraveda-herbal/
├── app/                  # Next.js App Router root (Pages, Layouts, API Routes)
├── components/           # Reusable React components (UI pieces)
├── lib/                  # Shared utilities and configurations
├── prisma/               # Database schema and migrations
├── data/                 # Static or mock data files
├── hooks/                # Custom React hooks
├── public/               # Static assets (images, fonts, etc.)
├── .env                  # Environment variables (DO NOT COMMIT)
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
└── prisma.config.ts      # Prisma-specific configuration
```

## Detailed Breakdown

### 1. The `app/` Directory (Core Application logic)
This directory uses Next.js file-system-based routing.
- `app/api/`: Contains all backend RESTful endpoints.
  - `admin/`: Secure routes for dashboard management.
  - `checkout/`, `products/`, `customer/`: Endpoints handling business logic.
- `app/portal-secure-entry/`: The administrative dashboard UI. Secure routes for managing the store.
- `app/(customer-facing)`: Folders like `checkout/`, `product/`, `category/`, `account/`, `login/` represent the public website pages.
- `app/layout.tsx` & `app/globals.css`: The root layout wrapper and global CSS/Tailwind imports.

### 2. The `components/` Directory (UI Elements)
Contains modular React components.
- **Layout Components:** `Header.tsx`, `Footer.tsx`, `CartDrawer.tsx`.
- **Page Sections:** `Hero.tsx`, `ProductsSection.tsx`, `BannerSection.tsx`, `ReviewsSection.tsx`, `FAQSection.tsx`.
- Keep components "dumb" where possible, passing data to them via props from the `app/` directory pages.

### 3. The `lib/` Directory (Utilities)
Shared logic that doesn't belong in a specific UI component or page.
- `prisma.ts`: Initializes and exports the singleton Prisma Client instance for database interactions.
- `admin-auth.ts`: Helper functions for verifying admin sessions/tokens.
- `image-compression.ts`: Logic to compress and optimize images (likely used during admin product uploads).
- `india-post-config.ts`: Configuration or helpers for shipping API integrations.

### 4. The `prisma/` Directory (Database)
- `schema.prisma`: The most critical file for understanding the data model. It defines all database tables (Models) like Products, Orders, Users, etc., and their relationships. 
- When changing the database, you update this file and run `npx prisma db push` or `npx prisma migrate`.

### 5. Deployment & Configs
- `deploy.sh`: A shell script used for deploying updates to the production server.
- `nginx-production.conf`: The Nginx configuration used on the production server to route traffic to this Next.js app.

## Getting Started

1. **Environment Setup:** Copy `.env.example` to `.env` and fill in the required database connection strings and API keys.
2. **Install Dependencies:** `npm install`
3. **Database Setup:** `npx prisma generate` (to generate the Prisma client) and `npx prisma db push` (to sync your local database with the schema).
4. **Run Dev Server:** `npm run dev`
