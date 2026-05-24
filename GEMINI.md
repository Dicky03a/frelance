# Gemini Project Instructions: frelance-porto

This project is a Freelance Portfolio & Service Platform built with Laravel 12 and Inertia.js (React 19).

## Project Overview

-   **Backend:** Laravel 12 (PHP 8.3+)
-   **Frontend:** React 19 with Inertia.js 2.0
-   **Language:** TypeScript (Strict Mode)
-   **Styling:** Tailwind CSS 4.0, Radix UI, shadcn-style components.
-   **Architecture:** Thin controllers -> Service layer -> Repository (if complex).
-   **Database:** MySQL 8 (Production) / SQLite (Dev/Testing). Eloquent ORM only (no raw SQL).
-   **Payment:** Midtrans (Snap).
-   **Queue:** Laravel Queue (database driver).
-   **Theme:** Dark-first, Apple-style glassmorphism, Bento Grid layout.

## Design System

-   **Colors:**
    -   Primary: #6366F1 (Indigo)
    -   Secondary: #0EA5E9 (Sky)
    -   Accent: #8B5CF6 (Violet)
    -   Status: Success (#10B981), Error (#EF4444), Warning (#F59E0B)
-   **Dark Mode:** Root (#09090f), Surface (#111118), Card (#1c1c28).
-   **Borders:** `rgba(255,255,255,0.07)` (light), `rgba(255,255,255,0.12)` (hover).
-   **Radius:** 20px (large cards), 16px (medium cards), 12px (small), 8px (inputs).

## Directory Structure

-   `app/`: Core Laravel application logic.
-   `app/Models/`: Eloquent models (Soft deletes required for key entities).
-   `resources/js/`: Frontend source code (React 19 + TypeScript).
-   `resources/js/components/ui/`: UI components (shadcn-style).
-   `routes/`: `web.php`, `auth.php`, `settings.php`, etc.

## Building and Running

### Development
```bash
composer dev
```

### Production Build
```bash
npm run build
```

### Testing
```bash
php artisan test
```

## Coding Standards

### PHP / Laravel
-   **Style:** PSR-12, Laravel Pint for formatting.
-   **Typing:** Use typed properties and explicit return types on ALL methods.
-   **Database:** Always use database transactions for multi-table writes.
-   **Soft Deletes:** Mandatory for: `projects`, `services`, `orders`, `forum_threads`, `forum_replies`.

### TypeScript / React
-   **Components:** Functional components only.
-   **Typing:** No `any` type. Strict mode.
-   **Naming:** camelCase for JS/TS, kebab-case for filenames.
