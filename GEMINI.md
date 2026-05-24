# Gemini Project Instructions: frelance-porto

This project is a modern web application built with Laravel 12 and Inertia.js using React and TypeScript. It leverages Tailwind CSS 4 for styling and Radix UI for accessible components.

## Project Overview

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 19 with Inertia.js 2.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0
- **UI Components:** Radix UI primitives, Lucide React icons.
- **Routing:** Laravel Routes with Ziggy for frontend route handling.
- **Testing:** Pest PHP.
- **Build Tool:** Vite 6.0

## Directory Structure

- `app/`: Core Laravel application logic (Models, Controllers, Middleware).
- `resources/js/`: Frontend source code.
    - `pages/`: Inertia page components (mapped to routes).
    - `components/`: Reusable React components (Radix UI based).
    - `hooks/`: Custom React hooks.
    - `layouts/`: Shared page layouts.
    - `lib/`: Utility functions and shared logic.
- `resources/css/`: Global styles and Tailwind configuration.
- `routes/`: Application routes (web.php, auth.php, settings.php).
- `database/`: Migrations, factories, and seeders.
- `tests/`: Pest tests (Feature and Unit).

## Building and Running

### Development

To start the development environment (runs Laravel server, Vite, and workers):

```bash
composer dev
```

Alternatively, run them separately:

- **Backend:** php artisan serve
- **Frontend:** npm run dev

### Production Build

```bash
npm run build
```

### Testing

Run the Pest test suite:

```bash
php artisan test
# or
./vendor/bin/pest
```

## Development Conventions

### PHP / Laravel
- **Code Style:** Follow PSR-12. Use composer lint (Laravel Pint) for automatic formatting.
- **Architecture:** Use standard Laravel patterns. Controllers should handle Inertia responses.
- **Testing:** Use Pest for functional and unit testing.

### TypeScript / React
- **Code Style:** Use ESLint and Prettier. Run npm run lint and npm run format.
- **Components:** Prefer functional components with hooks. Use Radix UI primitives for complex UI elements.
- **Types:** Strict TypeScript is enabled. Ensure all components and functions are properly typed.
- **Inertia:** Use usePage and router from @inertiajs/react for state and navigation.

### Styling
- **Tailwind CSS 4:** Configuration is handled via CSS variables and the @theme directive in resources/css/app.css. Avoid old tailwind.config.js patterns unless necessary.
