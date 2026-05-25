# FREELANCE PORTO — MASTER AI CODING PROMPTS
## Professional Prompt Series · 13 Stages · Laravel 12 + Inertia.js + React

> **How to use:** Execute each prompt in sequence. Do NOT skip stages.  
> Each prompt is self-contained and tells the AI exactly what to build, what NOT to touch, and how to validate the output.

---

## GLOBAL CONTEXT (Include this in EVERY prompt session)

```
PROJECT: Freelance Portfolio & Service Platform
OWNER: Single freelancer (one admin), multi-client
STACK:
  - Backend : Laravel 12, PHP 8.3+
  - Frontend: React 19, TypeScript, Inertia.js v2
  - CSS     : Tailwind CSS v4, Radix UI, shadcn-style components
  - DB      : MySQL 8 (production) / SQLite (dev/testing)
  - Build   : Vite 6, Laravel Vite Plugin
  - Queue   : Laravel Queue (database driver)
  - Payment : Midtrans (Snap)

EXISTING FILES (DO NOT MODIFY UNLESS EXPLICITLY STATED):
  - app/Http/Controllers/Auth/*         ← All auth controllers
  - app/Http/Controllers/Settings/*     ← Settings controllers
  - app/Http/Middleware/HandleInertiaRequests.php
  - resources/js/pages/auth/*           ← Login, register, etc.
  - resources/js/pages/settings/*       ← Appearance, profile, password
  - resources/js/components/ui/*        ← Existing shadcn components
  - resources/js/layouts/*              ← app-layout, auth-layout, etc.
  - resources/js/hooks/*                ← Existing hooks
  - routes/auth.php                     ← Auth routes
  - routes/settings.php                 ← Settings routes
  - .env, composer.json, package.json   ← Config files

DESIGN SYSTEM:
  Colors  : Primary #6366F1 (Indigo), Secondary #0EA5E9 (Sky), Accent #8B5CF6 (Violet)
            Success #10B981, Error #EF4444, Warning #F59E0B
  Dark BG : #09090f (root), #111118 (surface), #1c1c28 (card)
  Border  : rgba(255,255,255,0.07) light / rgba(255,255,255,0.12) hover
  Radius  : 20px (large cards), 16px (medium cards), 12px (small), 8px (inputs)
  Theme   : Dark-first, Apple-style glassmorphism, Bento Grid layout

CODE STANDARDS:
  - PHP    : PSR-12, typed properties, return types on all methods
  - React  : Functional components only, no class components
  - Types  : TypeScript strict mode, no 'any' type
  - Naming : snake_case PHP, camelCase JS/TS, kebab-case files
  - Arch   : Thin controllers → Service layer → Repository (if complex)
  - No raw SQL → Use Eloquent ORM only
  - No hardcoded values → Use config() or .env
  - Always use database transactions for multi-table writes
  - Soft delete on: projects, services, orders, forum_threads, forum_replies
```

---

# STAGE 1 — DATABASE MIGRATIONS + SEEDERS

```
STAGE    : 1 of 13
GOAL     : Create all database migrations and seeders for the entire platform
DEPENDS  : Existing Laravel 12 project with users table (from auth scaffold)
OUTPUT   : 12 migration files + 6 seeder files + DatabaseSeeder.php update

══════════════════════════════════════════════════════════════════
TASK: Create the following migration files in order:
══════════════════════════════════════════════════════════════════

FILE 1: database/migrations/xxxx_add_role_avatar_locale_to_users_table.php
  Purpose: Extend the existing users table (DO NOT recreate it)
  Columns to ADD:
    - role        : ENUM('admin','client') NOT NULL DEFAULT 'client'
    - avatar      : VARCHAR(255) NULLABLE
    - locale      : VARCHAR(10) NOT NULL DEFAULT 'id'
    - is_banned   : BOOLEAN NOT NULL DEFAULT false
  No soft delete on users (handled by is_banned)

FILE 2: database/migrations/xxxx_create_skills_table.php
  Columns:
    - id          : BIGINT UNSIGNED PK AUTO_INCREMENT
    - name        : VARCHAR(100) NOT NULL
    - icon        : VARCHAR(100) NULLABLE  (lucide icon name)
    - category    : ENUM('frontend','backend','database','devops','other') NOT NULL
    - level       : TINYINT UNSIGNED NOT NULL DEFAULT 80  (0-100, proficiency %)
    - color       : VARCHAR(20) NULLABLE  (hex color for badge)
    - sort_order  : SMALLINT NOT NULL DEFAULT 0
    - created_at / updated_at

FILE 3: database/migrations/xxxx_create_projects_table.php
  Columns:
    - id          : BIGINT UNSIGNED PK AUTO_INCREMENT
    - title       : VARCHAR(255) NOT NULL
    - slug        : VARCHAR(255) UNIQUE NOT NULL
    - description : TEXT NOT NULL
    - long_description : LONGTEXT NULLABLE
    - tech_stack  : JSON NOT NULL  (array of tech names)
    - thumbnail   : VARCHAR(500) NULLABLE
    - images      : JSON NULLABLE  (array of image URLs)
    - price_from  : DECIMAL(15,2) NULLABLE
    - price_to    : DECIMAL(15,2) NULLABLE
    - duration_weeks : TINYINT UNSIGNED NULLABLE
    - live_url    : VARCHAR(500) NULLABLE
    - github_url  : VARCHAR(500) NULLABLE
    - category    : ENUM('web_app','landing_page','ecommerce','api','mobile','other') NOT NULL
    - status      : ENUM('draft','published','archived') NOT NULL DEFAULT 'draft'
    - is_featured : BOOLEAN NOT NULL DEFAULT false
    - views       : INT UNSIGNED NOT NULL DEFAULT 0
    - sort_order  : SMALLINT NOT NULL DEFAULT 0
    - created_at / updated_at / deleted_at (soft delete)

FILE 4: database/migrations/xxxx_create_project_skill_table.php (pivot)
  Columns:
    - project_id  : BIGINT UNSIGNED FK projects.id CASCADE DELETE
    - skill_id    : BIGINT UNSIGNED FK skills.id CASCADE DELETE
  Primary key: (project_id, skill_id)

FILE 5: database/migrations/xxxx_create_services_table.php
  Columns:
    - id          : BIGINT UNSIGNED PK AUTO_INCREMENT
    - name        : VARCHAR(255) NOT NULL
    - slug        : VARCHAR(255) UNIQUE NOT NULL
    - description : TEXT NOT NULL
    - icon        : VARCHAR(100) NULLABLE
    - is_active   : BOOLEAN NOT NULL DEFAULT true
    - sort_order  : SMALLINT NOT NULL DEFAULT 0
    - created_at / updated_at

FILE 6: database/migrations/xxxx_create_service_packages_table.php
  Columns:
    - id          : BIGINT UNSIGNED PK AUTO_INCREMENT
    - service_id  : BIGINT UNSIGNED FK services.id CASCADE DELETE
    - name        : VARCHAR(255) NOT NULL
    - description : TEXT NULLABLE
    - price_idr   : DECIMAL(15,2) NOT NULL
    - price_usd   : DECIMAL(10,2) NOT NULL
    - features    : JSON NOT NULL  (array of feature strings)
    - is_popular  : BOOLEAN NOT NULL DEFAULT false
    - is_active   : BOOLEAN NOT NULL DEFAULT true
    - sort_order  : SMALLINT NOT NULL DEFAULT 0
    - created_at / updated_at

FILE 7: database/migrations/xxxx_create_orders_table.php
  Columns:
    - id                     : BIGINT UNSIGNED PK AUTO_INCREMENT
    - user_id                : BIGINT UNSIGNED FK users.id RESTRICT
    - service_package_id     : BIGINT UNSIGNED FK service_packages.id RESTRICT
    - order_code             : VARCHAR(50) UNIQUE NOT NULL  (ORD-YYYYMMDD-XXXX)
    - requirements           : TEXT NULLABLE
    - notes_admin            : TEXT NULLABLE  (internal admin notes)
    - total_idr              : DECIMAL(15,2) NOT NULL
    - total_usd              : DECIMAL(10,2) NOT NULL
    - exchange_rate          : DECIMAL(10,4) NOT NULL DEFAULT 0  (USD/IDR rate at time of order)
    - status                 : ENUM('pending','paid','in_progress','completed','cancelled','expired') NOT NULL DEFAULT 'pending'
    - midtrans_order_id      : VARCHAR(255) UNIQUE NULLABLE
    - midtrans_transaction_id: VARCHAR(255) UNIQUE NULLABLE
    - midtrans_token         : TEXT NULLABLE  (snap token)
    - payment_type           : VARCHAR(50) NULLABLE  (bank_transfer/qris/credit_card/etc)
    - payment_url            : TEXT NULLABLE
    - paid_at                : TIMESTAMP NULLABLE
    - completed_at           : TIMESTAMP NULLABLE
    - expired_at             : TIMESTAMP NULLABLE
    - created_at / updated_at / deleted_at (soft delete)

FILE 8: database/migrations/xxxx_create_forum_threads_table.php
  Columns:
    - id          : BIGINT UNSIGNED PK AUTO_INCREMENT
    - user_id     : BIGINT UNSIGNED FK users.id RESTRICT
    - title       : VARCHAR(255) NOT NULL
    - slug        : VARCHAR(255) UNIQUE NOT NULL
    - body        : LONGTEXT NOT NULL
    - category    : ENUM('general','technical','price','recommendation','other') NOT NULL DEFAULT 'general'
    - is_pinned   : BOOLEAN NOT NULL DEFAULT false
    - is_locked   : BOOLEAN NOT NULL DEFAULT false
    - is_hidden   : BOOLEAN NOT NULL DEFAULT false  (soft-moderation)
    - views       : INT UNSIGNED NOT NULL DEFAULT 0
    - replies_count: INT UNSIGNED NOT NULL DEFAULT 0  (denormalized counter)
    - created_at / updated_at / deleted_at (soft delete)
  INDEXES: (is_hidden, created_at), (category, is_hidden), (user_id)

FILE 9: database/migrations/xxxx_create_forum_replies_table.php
  Columns:
    - id          : BIGINT UNSIGNED PK AUTO_INCREMENT
    - thread_id   : BIGINT UNSIGNED FK forum_threads.id CASCADE DELETE
    - user_id     : BIGINT UNSIGNED FK users.id RESTRICT
    - body        : LONGTEXT NOT NULL
    - is_hidden   : BOOLEAN NOT NULL DEFAULT false
    - is_best_answer : BOOLEAN NOT NULL DEFAULT false
    - created_at / updated_at / deleted_at (soft delete)
  INDEXES: (thread_id, is_hidden), (user_id)

FILE 10: database/migrations/xxxx_create_project_comments_table.php
  Columns:
    - id          : BIGINT UNSIGNED PK AUTO_INCREMENT
    - project_id  : BIGINT UNSIGNED FK projects.id CASCADE DELETE
    - user_id     : BIGINT UNSIGNED FK users.id RESTRICT
    - body        : TEXT NOT NULL
    - is_hidden   : BOOLEAN NOT NULL DEFAULT false
    - created_at / updated_at / deleted_at (soft delete)
  INDEXES: (project_id, is_hidden)

FILE 11: database/migrations/xxxx_create_ratings_table.php
  Columns:
    - id          : BIGINT UNSIGNED PK AUTO_INCREMENT
    - user_id     : BIGINT UNSIGNED FK users.id RESTRICT
    - order_id    : BIGINT UNSIGNED FK orders.id RESTRICT
    - score       : TINYINT UNSIGNED NOT NULL  (1-5)
    - review      : TEXT NULLABLE
    - is_visible  : BOOLEAN NOT NULL DEFAULT true
    - created_at / updated_at
  UNIQUE INDEX: (user_id, order_id)  ← prevent double rating

FILE 12: database/migrations/xxxx_create_calculator_configs_table.php
  Columns:
    - id           : BIGINT UNSIGNED PK AUTO_INCREMENT
    - project_type : VARCHAR(50) NOT NULL  (web_app, landing_page, ecommerce, etc.)
    - label        : VARCHAR(100) NOT NULL
    - base_price   : DECIMAL(15,2) NOT NULL  (IDR)
    - features     : JSON NOT NULL  (array of {key, label, price_add})
    - timeline_multipliers : JSON NOT NULL  (array of {weeks, label, multiplier})
    - is_active    : BOOLEAN NOT NULL DEFAULT true
    - created_at / updated_at

══════════════════════════════════════════════════════════════════
TASK: Create the following seeder files:
══════════════════════════════════════════════════════════════════

FILE 1: database/seeders/UserSeeder.php
  Create 2 users:
    Admin: name='Admin', email='admin@devporto.id', password=bcrypt('admin123'), role='admin'
    Client: name='Budi Santoso', email='budi@example.com', password=bcrypt('password'), role='client'

FILE 2: database/seeders/SkillSeeder.php
  Create 12 skills across categories:
    Frontend: React (95%), TypeScript (88%), Tailwind CSS (90%), Vue.js (75%)
    Backend : Laravel (95%), PHP (90%), Node.js (70%)
    Database: MySQL (88%), PostgreSQL (72%), Redis (65%)
    DevOps  : Docker (70%), Git (90%)
  Use lucide-react icon names for the icon field.

FILE 3: database/seeders/ProjectSeeder.php
  Create 6 projects with realistic Indonesian freelance project data.
  Status: 4 published, 1 draft, 1 archived.
  Mix of categories. Use realistic price ranges in IDR.
  tech_stack as JSON array. Attach 2-4 skills to each project via pivot.

FILE 4: database/seeders/ServiceSeeder.php
  Create 3 services, each with 2-3 packages:
    Service 1: "Web Development"
      Package 1: "Starter" - Landing Page - Rp 5.000.000 / $320
      Package 2: "Professional" - Web App - Rp 20.000.000 / $1280 (is_popular=true)
      Package 3: "Enterprise" - Custom System - Rp 50.000.000 / $3200
    Service 2: "UI/UX Design"
      Package 1: "Basic" - Wireframe - Rp 3.000.000 / $192
      Package 2: "Full Design" - Complete UI - Rp 8.000.000 / $512
    Service 3: "Maintenance & Support"
      Package 1: "Monthly Basic" - Rp 2.000.000 / $128
      Package 2: "Monthly Pro" - Rp 5.000.000 / $320

FILE 5: database/seeders/CalculatorConfigSeeder.php
  Create config for: web_app, landing_page, ecommerce, custom_api
  Each with 5-8 feature options and 3-4 timeline options.
  Realistic IDR price ranges for Indonesian market.

FILE 6: database/seeders/ForumSeeder.php
  Create 5 threads with 2-4 replies each. Use user_id from UserSeeder.
  Mix of categories. Pre-seed to avoid "empty forum" problem.

FILE 7: Update database/seeders/DatabaseSeeder.php
  Call all seeders in correct dependency order.

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST (verify before finishing):
══════════════════════════════════════════════════════════════════
  □ All migrations have both up() and down() methods
  □ All foreign keys have proper ON DELETE behavior
  □ JSON columns use ->json() not ->text()
  □ All ENUM values match what will be used in PHP Enums (Stage 2)
  □ deleted_at columns use ->softDeletes()
  □ php artisan migrate:fresh --seed runs without errors
  □ No migration modifies existing auth migrations
```

---

# STAGE 2 — MODELS, ENUMS & RELATIONSHIPS

```
STAGE    : 2 of 13
GOAL     : Create all Eloquent Models, PHP Enums, and define all relationships
DEPENDS  : Stage 1 complete (all migrations and tables exist)
OUTPUT   : 11 model files + 5 enum files

══════════════════════════════════════════════════════════════════
TASK: Create PHP Enums in app/Enums/
══════════════════════════════════════════════════════════════════

FILE: app/Enums/UserRole.php
  enum UserRole: string
    case ADMIN  = 'admin'
    case CLIENT = 'client'
  Add helper: isAdmin(): bool

FILE: app/Enums/OrderStatus.php
  enum OrderStatus: string
    case PENDING     = 'pending'
    case PAID        = 'paid'
    case IN_PROGRESS = 'in_progress'
    case COMPLETED   = 'completed'
    case CANCELLED   = 'cancelled'
    case EXPIRED     = 'expired'
  Add helpers:
    - label(): string  (human readable)
    - color(): string  (tailwind color class for badge)
    - canTransitionTo(OrderStatus $new): bool

FILE: app/Enums/ProjectStatus.php
  enum ProjectStatus: string
    case DRAFT     = 'draft'
    case PUBLISHED = 'published'
    case ARCHIVED  = 'archived'

FILE: app/Enums/ProjectCategory.php
  enum ProjectCategory: string
    case WEB_APP      = 'web_app'
    case LANDING_PAGE = 'landing_page'
    case ECOMMERCE    = 'ecommerce'
    case API          = 'api'
    case MOBILE       = 'mobile'
    case OTHER        = 'other'
  Add helper: label(): string

FILE: app/Enums/SkillCategory.php
  enum SkillCategory: string
    case FRONTEND = 'frontend'
    case BACKEND  = 'backend'
    case DATABASE = 'database'
    case DEVOPS   = 'devops'
    case OTHER    = 'other'

FILE: app/Enums/ForumCategory.php
  enum ForumCategory: string
    case GENERAL        = 'general'
    case TECHNICAL      = 'technical'
    case PRICE          = 'price'
    case RECOMMENDATION = 'recommendation'
    case OTHER          = 'other'

══════════════════════════════════════════════════════════════════
TASK: Modify existing app/Models/User.php (extend, do not replace)
══════════════════════════════════════════════════════════════════
  ADD to $fillable: role, avatar, locale, is_banned
  ADD $casts: role => UserRole::class, is_banned => 'boolean'
  ADD relationships:
    - orders(): HasMany Order
    - forumThreads(): HasMany ForumThread
    - forumReplies(): HasMany ForumReply
    - projectComments(): HasMany ProjectComment
    - ratings(): HasMany Rating
  ADD helper methods:
    - isAdmin(): bool  { return $this->role === UserRole::ADMIN; }
    - getAvatarUrlAttribute(): string  (return avatar or generate initials URL)

══════════════════════════════════════════════════════════════════
TASK: Create new model files in app/Models/
══════════════════════════════════════════════════════════════════

FILE: app/Models/Skill.php
  $fillable: name, icon, category, level, color, sort_order
  $casts: category => SkillCategory::class
  Relationship: projects() BelongsToMany Project

FILE: app/Models/Project.php
  $fillable: title, slug, description, long_description, tech_stack, thumbnail,
             images, price_from, price_to, duration_weeks, live_url, github_url,
             category, status, is_featured, views, sort_order
  $casts: tech_stack => 'array', images => 'array',
          category => ProjectCategory::class, status => ProjectStatus::class,
          price_from => 'decimal:2', price_to => 'decimal:2',
          is_featured => 'boolean'
  Use SoftDeletes trait
  Relationships:
    - skills() BelongsToMany Skill
    - comments() HasMany ProjectComment
    - ratings() HasMany Rating
  Scopes:
    - scopePublished(Builder $query): Builder
    - scopeFeatured(Builder $query): Builder
  Accessor: getPriceRangeAttribute(): string  (formatted IDR range)
  Boot: auto-generate slug from title using Str::slug()

FILE: app/Models/Service.php
  $fillable: name, slug, description, icon, is_active, sort_order
  $casts: is_active => 'boolean'
  Relationship: packages() HasMany ServicePackage
  Scope: scopeActive()

FILE: app/Models/ServicePackage.php
  $fillable: service_id, name, description, price_idr, price_usd,
             features, is_popular, is_active, sort_order
  $casts: features => 'array', is_popular => 'boolean',
          is_active => 'boolean', price_idr => 'decimal:2', price_usd => 'decimal:2'
  Relationship: service() BelongsTo Service, orders() HasMany Order

FILE: app/Models/Order.php
  $fillable: ALL order columns (list all explicitly)
  $casts: status => OrderStatus::class, paid_at => 'datetime',
          completed_at => 'datetime', expired_at => 'datetime',
          total_idr => 'decimal:2', total_usd => 'decimal:2'
  Use SoftDeletes trait
  Relationships:
    - user() BelongsTo User
    - servicePackage() BelongsTo ServicePackage
    - rating() HasOne Rating
  Boot: auto-generate order_code in format ORD-YYYYMMDD-XXXX (4 random alphanumeric)
  Scope: scopeForUser(Builder $query, int $userId): Builder

FILE: app/Models/ForumThread.php
  $fillable: user_id, title, slug, body, category, is_pinned, is_locked,
             is_hidden, views, replies_count
  $casts: category => ForumCategory::class, is_pinned => 'boolean',
          is_locked => 'boolean', is_hidden => 'boolean'
  Use SoftDeletes trait
  Relationships:
    - user() BelongsTo User
    - replies() HasMany ForumReply (ordered by created_at ASC)
    - visibleReplies() HasMany ForumReply where is_hidden = false
  Scopes:
    - scopeVisible(Builder $query): Builder  (is_hidden = false)
    - scopePinned(Builder $query): Builder
  Boot: auto-generate slug from title

FILE: app/Models/ForumReply.php
  $fillable: thread_id, user_id, body, is_hidden, is_best_answer
  $casts: is_hidden => 'boolean', is_best_answer => 'boolean'
  Use SoftDeletes trait
  Relationships: thread() BelongsTo ForumThread, user() BelongsTo User
  After creating: increment thread.replies_count
  After deleting: decrement thread.replies_count (use DB transaction)

FILE: app/Models/ProjectComment.php
  $fillable: project_id, user_id, body, is_hidden
  $casts: is_hidden => 'boolean'
  Use SoftDeletes trait
  Relationships: project() BelongsTo Project, user() BelongsTo User

FILE: app/Models/Rating.php
  $fillable: user_id, order_id, score, review, is_visible
  $casts: is_visible => 'boolean', score => 'integer'
  Relationships: user() BelongsTo User, order() BelongsTo Order

FILE: app/Models/CalculatorConfig.php
  $fillable: project_type, label, base_price, features, timeline_multipliers, is_active
  $casts: features => 'array', timeline_multipliers => 'array',
          base_price => 'decimal:2', is_active => 'boolean'
  Scope: scopeActive()

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST:
══════════════════════════════════════════════════════════════════
  □ All models have explicit $fillable (no $guarded = [])
  □ All Enums implement proper BackedEnum interface
  □ All foreign key relationships exist bidirectionally
  □ SoftDeletes imported and used on: Project, Order, ForumThread, ForumReply, ProjectComment
  □ No model uses ->all() without scope - always use scopes
  □ Run php artisan ide-helper:generate (if installed) to verify
  □ Verify ForumReply observer correctly increments/decrements counter
```

---

# STAGE 3 — MIDDLEWARE, POLICIES & SERVICE LAYER

```
STAGE    : 3 of 13
GOAL     : Create IsAdmin middleware, all Laravel Policies, and Service class skeletons
DEPENDS  : Stage 2 complete (Models and Enums exist)
OUTPUT   : 1 middleware, 5 policies, 4 service classes, route files update

══════════════════════════════════════════════════════════════════
TASK: Create app/Http/Middleware/IsAdmin.php
══════════════════════════════════════════════════════════════════
  Logic:
    - If not authenticated → redirect to route('login')
    - If authenticated but role !== admin → abort(403, 'Unauthorized')
    - If admin → pass through
  Register in bootstrap/app.php as alias 'admin'

══════════════════════════════════════════════════════════════════
TASK: Create app/Http/Middleware/SetLocale.php
══════════════════════════════════════════════════════════════════
  Logic:
    - Read locale from: 1) request query ?lang=, 2) session 'locale', 3) user->locale, 4) default 'id'
    - Validate locale is in ['id', 'en']
    - Store in session, call App::setLocale()
    - If auth user and locale changed, update user->locale in DB
  Register as middleware in bootstrap/app.php (global web middleware)

══════════════════════════════════════════════════════════════════
TASK: Create Policy files in app/Policies/
══════════════════════════════════════════════════════════════════

FILE: app/Policies/OrderPolicy.php
  - viewAny(User $user): bool → user->isAdmin()
  - view(User $user, Order $order): bool → $user->id === $order->user_id || $user->isAdmin()
  - update(User $user, Order $order): bool → $user->isAdmin()
  - delete(User $user, Order $order): bool → $user->isAdmin()

FILE: app/Policies/ForumThreadPolicy.php
  - viewAny(User $user): bool → true (public but authed)
  - create(?User $user): bool → auth()->check()
  - update(User $user, ForumThread $thread): bool → $user->id === $thread->user_id || $user->isAdmin()
  - delete(User $user, ForumThread $thread): bool → $user->id === $thread->user_id || $user->isAdmin()
  - moderate(User $user): bool → $user->isAdmin()  (hide/pin/lock)

FILE: app/Policies/ForumReplyPolicy.php
  - create(?User $user): bool → auth()->check()
  - update(User $user, ForumReply $reply): bool → $user->id === $reply->user_id || $user->isAdmin()
  - delete(User $user, ForumReply $reply): bool → $user->id === $reply->user_id || $user->isAdmin()

FILE: app/Policies/ProjectCommentPolicy.php
  - create(?User $user): bool → auth()->check()
  - update(User $user, ProjectComment $comment): bool → $user->id === $comment->user_id || $user->isAdmin()
  - delete(User $user, ProjectComment $comment): bool → $user->id === $comment->user_id || $user->isAdmin()

FILE: app/Policies/RatingPolicy.php
  - create(User $user, Order $order): bool
    → $user->id === $order->user_id
      && $order->status === OrderStatus::COMPLETED
      && $order->rating === null  (has not rated yet)

Register all policies in app/Providers/AppServiceProvider.php using Gate::policy()

══════════════════════════════════════════════════════════════════
TASK: Create Service classes in app/Services/
══════════════════════════════════════════════════════════════════

FILE: app/Services/MidtransService.php
  Constructor: reads MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION from config
  Methods:
    - createSnapToken(Order $order): string
        → Call Midtrans\Snap::getSnapToken() with order details
        → item_details: package name, price, qty=1
        → customer_details: user name, email
        → Return snap_token string
        → On failure: throw \RuntimeException with message
    - verifyWebhookSignature(array $payload): bool
        → hash('sha512', $payload['order_id'].$payload['status_code'].$payload['gross_amount'].config('midtrans.server_key'))
        → Compare with $payload['signature_key']
        → Return bool
    - mapPaymentStatus(string $transactionStatus, string $fraudStatus): OrderStatus
        → Map Midtrans status to OrderStatus enum

FILE: app/Services/PriceCalculatorService.php
  Methods:
    - getConfig(string $projectType): ?CalculatorConfig
    - calculate(string $projectType, array $selectedFeatures, int $timelineWeeks): array
        Returns: ['min' => float, 'max' => float, 'currency' => 'IDR', 'breakdown' => array]
    - formatForDisplay(array $result, string $currency = 'IDR'): array
        Returns formatted strings like "Rp 15.000.000"

FILE: app/Services/CurrencyService.php
  Methods:
    - getRate(string $from = 'USD', string $to = 'IDR'): float
        → Check cache('currency_rate_USD_IDR') TTL 60 minutes
        → If miss: fetch from https://api.exchangerate-api.com/v4/latest/USD
        → Store in cache, return rate
        → On API fail: return fallback rate from config('currency.fallback_rate')
    - convert(float $amount, string $from, string $to): float
    - format(float $amount, string $currency): string  (Rp 15.000.000 or $950)

FILE: app/Services/RecommendationService.php
  Methods:
    - getForUser(User $user, int $limit = 3): Collection
        Logic (rule-based):
        1. If user has completed orders → recommend next tier package
        2. If user has pending/active order → recommend maintenance package
        3. If no orders → recommend most popular package
        Returns Collection of ServicePackage with 'reason' appended

══════════════════════════════════════════════════════════════════
TASK: Update route files
══════════════════════════════════════════════════════════════════

FILE: routes/web.php
  Add public routes group (no auth middleware):
    GET  /                       → Public\HomeController@index       [name: home]
    GET  /projects               → Public\ProjectController@index    [name: projects.index]
    GET  /projects/{project:slug}→ Public\ProjectController@show     [name: projects.show]
    GET  /services               → Public\ServiceController@index    [name: services.index]
    GET  /forum                  → Public\ForumController@index      [name: forum.index]
    GET  /forum/{thread:slug}    → Public\ForumController@show       [name: forum.show]
    POST /calculator/estimate    → Public\CalculatorController@estimate [name: calculator.estimate]

  Add client routes (auth middleware):
    POST /orders                         → Client\OrderController@store
    GET  /orders/{order}                 → Client\OrderController@show [name: orders.show]
    GET  /orders/{order}/payment         → Client\OrderController@payment
    POST /forum/threads                  → Client\ForumController@storeThread
    PUT  /forum/threads/{thread}         → Client\ForumController@updateThread
    DELETE /forum/threads/{thread}       → Client\ForumController@destroyThread
    POST /forum/{thread:slug}/replies    → Client\ForumController@storeReply
    PUT  /forum/replies/{reply}          → Client\ForumController@updateReply
    DELETE /forum/replies/{reply}        → Client\ForumController@destroyReply
    POST /projects/{project}/comments    → Client\ReviewController@storeComment
    POST /projects/{project}/ratings     → Client\ReviewController@storeRating

FILE: routes/webhook.php  (NEW FILE, no CSRF)
  POST /webhook/midtrans → Webhook\MidtransController@handle [name: webhook.midtrans]
  Register in bootstrap/app.php: exclude from CSRF and include in 'web' group

FILE: routes/admin.php  (NEW FILE)
  All routes use ['middleware' => ['auth', 'admin'], 'prefix' => 'admin', 'as' => 'admin.']
    GET    /                        → Admin\DashboardController@index      [name: dashboard]
    Resources (index,create,store,show,edit,update,destroy):
      /projects                     → Admin\ProjectController
      /services                     → Admin\ServiceController
      /services/{service}/packages  → Admin\ServicePackageController
      /orders                       → Admin\OrderController (no create/store)
      /forum/threads                → Admin\ForumThreadController (no create/store)
      /forum/replies/{reply}/hide   → Admin\ForumReplyController@hide  (POST)
      /skills                       → Admin\SkillController
      /users                        → Admin\UserController (index, show, destroy, ban)
      /calculator-configs           → Admin\CalculatorConfigController

  Register routes/admin.php in bootstrap/app.php

══════════════════════════════════════════════════════════════════
TASK: Add config file config/midtrans.php
══════════════════════════════════════════════════════════════════
  Return array with:
    'server_key'     => env('MIDTRANS_SERVER_KEY', ''),
    'client_key'     => env('MIDTRANS_CLIENT_KEY', ''),
    'is_production'  => env('MIDTRANS_IS_PRODUCTION', false),
    'snap_url'       => env('MIDTRANS_IS_PRODUCTION', false)
                        ? 'https://app.midtrans.com/snap/snap.js'
                        : 'https://app.sandbox.midtrans.com/snap/snap.js'

Add to .env.example:
  MIDTRANS_SERVER_KEY=
  MIDTRANS_CLIENT_KEY=
  MIDTRANS_IS_PRODUCTION=false

TASK: Add config/currency.php
  Return: ['fallback_rate' => 15800, 'supported' => ['IDR', 'USD']]

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST:
══════════════════════════════════════════════════════════════════
  □ php artisan route:list shows all routes without errors
  □ IsAdmin middleware returns 403 (not 302) for authenticated non-admin
  □ All policies registered in AppServiceProvider
  □ Webhook route excluded from CSRF verification
  □ MidtransService constructor throws clear exception if server_key is empty
  □ CurrencyService has working fallback when API is unreachable
  □ No service class uses dependency injection of another service (keep flat)
```

---

# STAGE 4 — ADMIN DASHBOARD (Backend + Frontend)

```
STAGE    : 4 of 13
GOAL     : Build the complete Admin Dashboard — overview stats + full CRUD for Projects, Services, Skills
DEPENDS  : Stage 3 complete (middleware, policies, routes registered)
OUTPUT   : Admin controllers, Form Requests, Inertia pages (React/TSX), shared type definitions

══════════════════════════════════════════════════════════════════
CONTEXT: Admin Layout
══════════════════════════════════════════════════════════════════
  The admin section uses the EXISTING app-layout.tsx with sidebar.
  Admin sidebar navigation must be added to the existing nav-main.tsx
  DO NOT create a new layout — extend the existing one.
  Admin routes are prefixed with /admin.
  The sidebar must show different nav items when user is admin.

══════════════════════════════════════════════════════════════════
TASK: Create TypeScript types in resources/js/types/
══════════════════════════════════════════════════════════════════

FILE: resources/js/types/models.ts
  Export interfaces for ALL models (use exact DB column names):
    User, Skill, Project, Service, ServicePackage,
    Order, ForumThread, ForumReply, ProjectComment, Rating, CalculatorConfig

  Export type aliases:
    UserRole = 'admin' | 'client'
    OrderStatus = 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'expired'
    ProjectStatus = 'draft' | 'published' | 'archived'
    ProjectCategory = 'web_app' | 'landing_page' | 'ecommerce' | 'api' | 'mobile' | 'other'
    SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'other'
    ForumCategory = 'general' | 'technical' | 'price' | 'recommendation' | 'other'

FILE: resources/js/types/pagination.ts
  Export interface PaginatedResponse<T>:
    data: T[]
    links: { first:string, last:string, prev:string|null, next:string|null }
    meta: { current_page, from, last_page, per_page, to, total }

FILE: resources/js/types/inertia.ts
  Export interface SharedProps (extends Inertia PageProps):
    auth: { user: User | null }
    locale: 'id' | 'en'
    currency: 'IDR' | 'USD'
    exchange_rate: number
    flash: { success?: string, error?: string, warning?: string }

══════════════════════════════════════════════════════════════════
TASK: Update HandleInertiaRequests middleware
══════════════════════════════════════════════════════════════════
  In the share() method, ADD:
    'locale'        => App::getLocale(),
    'currency'      => session('currency', 'IDR'),
    'exchange_rate' => app(CurrencyService::class)->getRate(),
    'flash'         => ['success' => session('success'), 'error' => session('error')],

══════════════════════════════════════════════════════════════════
TASK: Create Form Request classes in app/Http/Requests/Admin/
══════════════════════════════════════════════════════════════════

FILE: StoreProjectRequest.php / UpdateProjectRequest.php
  Rules:
    title        : required|string|max:255
    description  : required|string|min:50
    long_description: nullable|string
    tech_stack   : required|array|min:1
    tech_stack.* : string|max:50
    category     : required|in:(ProjectCategory enum values)
    status       : required|in:(ProjectStatus enum values)
    price_from   : nullable|numeric|min:0
    price_to     : nullable|numeric|gte:price_from
    duration_weeks: nullable|integer|min:1|max:52
    live_url     : nullable|url|max:500
    github_url   : nullable|url|max:500
    is_featured  : boolean
    thumbnail    : nullable|image|max:5120|mimes:jpg,jpeg,png,webp (on store)
    skill_ids    : nullable|array
    skill_ids.*  : exists:skills,id

FILE: StoreSkillRequest.php / UpdateSkillRequest.php
  Rules: name(required,max:100), category(required,enum), level(required,int,0-100),
         icon(nullable,max:100), color(nullable,max:20,regex:/^#[0-9A-Fa-f]{6}$/)

FILE: StoreServiceRequest.php / UpdateServiceRequest.php
FILE: StoreServicePackageRequest.php / UpdateServicePackageRequest.php
  Validate features as array of strings.

══════════════════════════════════════════════════════════════════
TASK: Create Admin Controllers in app/Http/Controllers/Admin/
══════════════════════════════════════════════════════════════════

FILE: DashboardController.php
  index(): InertiaResponse
    Gather and pass to 'Admin/Dashboard':
      total_revenue_idr: sum of orders where status=paid|in_progress|completed
      total_orders: count all orders
      orders_this_month: count orders created this month
      new_clients_this_month: count users (role=client) created this month
      pending_orders: Order::pending()->with('user','servicePackage')->latest()->take(5)->get()
      recent_threads: ForumThread::visible()->with('user')->latest()->take(5)->get()
      monthly_revenue: array of last 6 months revenue grouped by month (for chart)
        Format: [['month' => 'Jan', 'revenue' => 15000000], ...]
      top_services: ServicePackage::withCount('orders')->orderByDesc('orders_count')->take(3)->get()

FILE: ProjectController.php  (full CRUD)
  index(): Paginate 15, with('skills'), searchable by title, filterable by status/category
  create(): Pass skills list and enums to 'Admin/Projects/Create'
  store(StoreProjectRequest): 
    - DB::transaction()
    - Create project
    - Handle thumbnail upload: store in storage/app/public/projects/thumbnails/
    - Sync skill_ids via $project->skills()->sync()
    - Return redirect with success flash
  show(): Pass project with skills, comments, ratings
  edit(): Pass project with skills, all skills list
  update(UpdateProjectRequest):
    - DB::transaction()
    - Update project
    - If new thumbnail uploaded: delete old, store new
    - Sync skills
  destroy(): SoftDelete, return redirect

FILE: SkillController.php  (full CRUD, no images)
  Paginate 20, ordered by sort_order

FILE: ServiceController.php + ServicePackageController.php
  ServicePackageController nested under service.

FILE: OrderController.php  (no create/store — orders come from clients)
  index(): Paginate 15, with('user','servicePackage.service'), filterable by status, searchable
  show(): Full order detail with user, package, payment info, rating
  update(): Only allow updating status (with OrderStatus::canTransitionTo() validation)
             and notes_admin
  Separate action: markAsCompleted(Order $order) — sets status=completed, completed_at=now()

FILE: SkillController.php
  Standard CRUD. Support drag-to-reorder via updateOrder(Request) endpoint
  that accepts array of {id, sort_order} and bulk updates.

══════════════════════════════════════════════════════════════════
TASK: Create React/TSX pages in resources/js/pages/Admin/
══════════════════════════════════════════════════════════════════

DESIGN RULES FOR ALL ADMIN PAGES:
  - Use the EXISTING app-layout.tsx as layout wrapper
  - Dark theme: bg-[#09090f], card bg-[#1c1c28], border border-white/7
  - All cards: rounded-[20px] border border-white/7 bg-[#1c1c28]
  - Text: text-white (primary), text-white/50 (secondary), text-white/30 (muted)
  - Accent: text-indigo-400, bg-indigo-500, border-indigo-500/30
  - Buttons: Use existing ui/button.tsx component
  - Tables: Use existing ui/table.tsx component (or create if not exists)
  - Forms: Use existing ui/input.tsx, ui/label.tsx, ui/select.tsx
  - Always show loading states and empty states
  - Flash messages from shared props must be displayed as toast

FILE: Admin/Dashboard.tsx
  Sections:
    1. Stats row: 4 metric cards (Total Revenue, Total Orders, New Clients, Pending Orders)
       Each card: icon + number + label + trend indicator
    2. Revenue Chart: Simple bar chart using recharts BarChart
       Data: monthly_revenue from props
       X-axis: month names, Y-axis: formatted IDR
    3. Two columns:
       Left: "Pesanan Terbaru" table (order_code, client, package, status badge, amount)
       Right: "Thread Forum Terbaru" list with avatar, title, time

FILE: Admin/Projects/Index.tsx
  - Search bar + category filter tabs + status filter
  - Data table: thumbnail, title, category badge, status badge, views, created_at, actions
  - Actions: Edit (link), Publish/Unpublish toggle, Delete (confirm dialog)
  - "Tambah Proyek" button → link to /admin/projects/create
  - Pagination

FILE: Admin/Projects/Create.tsx + Edit.tsx  (shared form component)
  Form sections:
    1. Basic Info: title, category (select), status (select), is_featured (checkbox)
    2. Description: textarea for description (min 50 chars), rich textarea for long_description
    3. Pricing: price_from, price_to (IDR), duration_weeks
    4. Technical: tech_stack (tag input — type and press Enter to add), skill_ids (multi-select checkboxes)
    5. Links: live_url, github_url
    6. Media: thumbnail upload with preview
  Show validation errors inline below each field using existing input-error.tsx

FILE: Admin/Skills/Index.tsx
  Grid view (not table): 4 columns of skill cards
  Each card: icon, name, category badge, level bar, edit/delete actions
  "Tambah Skill" button

FILE: Admin/Orders/Index.tsx
  Table with: order_code, client name, package, service, total IDR, status badge, paid_at, actions
  Status filter tabs: All | Pending | Paid | In Progress | Completed
  Click row → /admin/orders/{id}

FILE: Admin/Orders/Show.tsx
  Order detail card + client info card side by side
  Payment info section (midtrans details)
  Status update dropdown (only valid transitions)
  Admin notes textarea with save button
  If status=completed: show Rating details if exists

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST:
══════════════════════════════════════════════════════════════════
  □ All admin routes return 403 for non-admin user
  □ File uploads stored in storage/app/public (not public/), symlinked via php artisan storage:link
  □ All forms show server-side validation errors
  □ Dashboard revenue chart renders without errors when no data
  □ Order status transitions are enforced (can't go PENDING → COMPLETED directly)
  □ All tables have empty state ("Belum ada data")
  □ Flash success/error messages appear after create/update/delete
```

---

# STAGE 5 — PUBLIC HOMEPAGE (Dashboard-Style)

```
STAGE    : 5 of 13
GOAL     : Build the public-facing homepage with dashboard layout
DEPENDS  : Stage 4 complete (Admin works, data exists from seeders)
OUTPUT   : HomeController + Home.tsx + all public layout components

══════════════════════════════════════════════════════════════════
CONTEXT: Public Layout Architecture
══════════════════════════════════════════════════════════════════
  The public pages use a NEW layout: resources/js/layouts/public-layout.tsx
  This is separate from the existing app-layout.tsx (client/admin layout).
  The public layout has:
    - Fixed top navbar (translucent dark glass)
    - LEFT sidebar (collapsible on mobile)
    - Main scrollable content area
  This layout wraps ALL public pages: Home, Projects, Services, Forum, etc.

══════════════════════════════════════════════════════════════════
TASK: Create app/Http/Controllers/Public/HomeController.php
══════════════════════════════════════════════════════════════════
  index(): InertiaResponse 'Public/Home'
  Pass to page:
    stats:
      projects_count : Project::published()->count()
      clients_count  : User::where('role','client')->count()
      years_experience: 3  (from config or hardcoded)
      satisfaction_rate: 98  (configurable)
    featured_projects: Project::published()->featured()->with('skills')->take(3)->get()
    skills_by_category: Skill::all()->groupBy('category')
    service_packages: ServicePackage::with('service')
                        ->where('is_active', true)
                        ->orderBy('sort_order')
                        ->get()
    forum_preview: ForumThread::visible()->with('user')
                    ->withCount('visibleReplies')
                    ->latest()->take(3)->get()
    calculator_types: CalculatorConfig::active()->get(['project_type', 'label'])

══════════════════════════════════════════════════════════════════
TASK: Create resources/js/layouts/public-layout.tsx
══════════════════════════════════════════════════════════════════
  Structure:
    <div className="min-h-screen bg-[#09090f] flex flex-col">
      <PublicNavbar />  {/* fixed top */}
      <div className="flex flex-1 pt-14">  {/* pt-14 = navbar height */}
        <PublicSidebar />  {/* fixed left, w-52 */}
        <main className="flex-1 ml-52 overflow-auto">
          {children}
        </main>
      </div>
    </div>

  Sidebar items:
    Section "Overview": Dashboard (ti-layout-dashboard), Projects (ti-folder), Services (ti-package)
    Section "Tools": Calculator (ti-calculator), Forum (ti-messages + reply count badge), Reviews (ti-star)
    Section "Info": About Me (ti-user), Skills (ti-code), Contact (ti-mail)

  Navbar items:
    Left: Logo + site name
    Center: nav links (hidden on mobile, shown in sidebar)
    Right: Language toggle (EN/ID), Currency toggle (Rp/$), Login button (if not auth), User menu (if auth)

  Active state: detect from route name using usePage().url

  Responsive: sidebar collapses to icon-only on md, hidden on mobile with hamburger toggle

══════════════════════════════════════════════════════════════════
TASK: Create resources/js/pages/Public/Home.tsx
══════════════════════════════════════════════════════════════════
  Layout: use PublicLayout (public-layout.tsx)
  Main content sections in order:

  SECTION 1 — HERO BENTO ROW
    Grid: grid-cols-3, gap-3
    Card A (col-span-2): bg-[#1c1c28] rounded-[20px] border border-white/7 p-6
      - "Available for projects" badge (green dot + text)
      - Large name heading: "Arif Pratama" (or from config)
      - Subtitle: "Full Stack Web Developer"
      - Two CTA buttons: primary "Hire Me" → /services, ghost "View Projects" → /projects
      - Subtle decorative circle in top-right corner (CSS only)
    Card B (col-span-1): Two stacked mini stat cards
      - Projects Done: stat_num (animated counter on mount)
      - Average Rating: 4.9 ⭐

  SECTION 2 — STATS ROW
    Grid: grid-cols-4, gap-3
    4 stat cards: Projects Done, Clients Served, Years Experience, Satisfaction Rate
    Each: icon in colored circle, number, label

  SECTION 3 — RECENT PROJECTS
    Section header with "See all →" link
    Filter chips: All, Web App, E-Commerce, Landing Page (client-side filter, not page reload)
    Grid: grid-cols-3, gap-3
    ProjectCard component (see below)
    Empty state if no published projects

  SECTION 4 — PRICE CALCULATOR
    Full-width card (or 2/3 width)
    Title with calculator icon
    Wizard steps UI (3 steps shown as pills: active/inactive)
    Step 1: Project type selection (radio cards from calculator_types prop)
    Step 2: Feature checkboxes (loaded via fetch to /calculator/estimate when type selected)
    Step 3: Timeline selector (radio cards: Fast/Normal/Extended)
    Live result display: "Estimasi: Rp 15jt – Rp 30jt" (updates on every selection change)
    CTA buttons: "Hubungi Saya" (link to contact), "Pesan Sekarang" (link to /services)

  SECTION 5 — SERVICE PACKAGES
    3 cards side by side
    Popular package: highlighted border (border-indigo-500/35)
    Each card: badge, name, price (IDR or USD based on currency shared prop), features list, CTA

  SECTION 6 — FORUM PREVIEW
    Card with forum icon header + "Lihat semua →" link
    List of 3 recent threads: avatar, title, category badge, reply count, time ago

══════════════════════════════════════════════════════════════════
TASK: Create shared public components in resources/js/components/public/
══════════════════════════════════════════════════════════════════

FILE: project-card.tsx
  Props: project: Project
  Show: thumbnail (or placeholder gradient), title, category badge, tech_stack pills (max 3 + "+N more"), price range, "Lihat Detail" button
  Hover: subtle border highlight
  Click: Link to /projects/{slug}

FILE: stat-card.tsx
  Props: icon, value, label, color ('indigo'|'emerald'|'sky'|'violet'|'amber'|'rose')
  Animated counter on mount using useEffect + requestAnimationFrame

FILE: service-package-card.tsx
  Props: pkg: ServicePackage, currency: 'IDR'|'USD'
  Show price based on currency prop
  Highlight if is_popular

FILE: forum-preview-item.tsx
  Props: thread: ForumThread
  Show avatar initials, title, category badge, reply count, relative time (using date-fns formatDistanceToNow)

══════════════════════════════════════════════════════════════════
TASK: Create Public Projects page
══════════════════════════════════════════════════════════════════

FILE: app/Http/Controllers/Public/ProjectController.php
  index(): Paginate 12, filterable by category, with('skills')
           Inertia 'Public/Projects/Index'
  show(): Increment views, load with skills, comments.user, ratings.user
          Inertia 'Public/Projects/Show'

FILE: resources/js/pages/Public/Projects/Index.tsx
  Filter bar at top (All + categories from ProjectCategory enum)
  Grid layout same as homepage but full-page
  Pagination

FILE: resources/js/pages/Public/Projects/Show.tsx
  Left column (2/3): thumbnail, description, long_description, tech_stack cloud, gallery images
  Right column (1/3): sticky card with: price range, duration, links, "Pesan Layanan" CTA
  Below: Comments section (list + form if auth, login prompt if not)
  Below: Ratings section (stars display, avg, list of reviews)

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST:
══════════════════════════════════════════════════════════════════
  □ Calculator updates price estimate WITHOUT page reload (pure frontend state)
  □ Calculator calls POST /calculator/estimate via Inertia.router.post or axios only for initial config load
  □ Project category filter works client-side (no page reload)
  □ Public pages accessible WITHOUT authentication
  □ Stat counter animation only runs once (not on every re-render)
  □ All images use Laravel storage URL (asset(Storage::url(...)))
  □ Missing thumbnail shows a gradient placeholder (CSS only, no broken img)
  □ Mobile: sidebar collapses, layout still works on 375px width
```

---

# STAGE 6 — PAYMENT INTEGRATION (MIDTRANS)

```
STAGE    : 6 of 13
GOAL     : Full Midtrans Snap payment flow — create order, checkout, webhook handling, order status page
DEPENDS  : Stage 5 complete (public pages done, MidtransService exists)
OUTPUT   : Order flow controllers, checkout page, webhook handler, email notifications

══════════════════════════════════════════════════════════════════
TASK: Install required packages
══════════════════════════════════════════════════════════════════
  Run: composer require midtrans/midtrans-php
  Run: composer require laravel/mail  (if not already)
  Ensure QUEUE_CONNECTION=database in .env for local dev

══════════════════════════════════════════════════════════════════
TASK: Create app/Http/Controllers/Client/OrderController.php
══════════════════════════════════════════════════════════════════

store(StoreOrderRequest $request):
  Validation:
    service_package_id : required|exists:service_packages,id
    requirements       : required|string|min:20|max:2000

  Logic (use DB::transaction()):
    1. Load ServicePackage (abort 404 if not found or not active)
    2. Check user has < 3 pending orders (return error if exceeded)
    3. Get current exchange_rate from CurrencyService
    4. Create Order:
         user_id             = auth()->id()
         service_package_id  = validated
         requirements        = validated
         total_idr           = package->price_idr
         total_usd           = package->price_usd
         exchange_rate       = current rate
         status              = OrderStatus::PENDING
         expired_at          = now()->addHours(24)
    5. Create Midtrans snap token via MidtransService::createSnapToken($order)
    6. Update order with midtrans_order_id and midtrans_token
    7. Return Inertia redirect to route('orders.payment', $order)

payment(Order $order):
  Gate::authorize('view', $order)
  If order->status !== PENDING → redirect to orders.show
  Return Inertia 'Client/Orders/Payment' with:
    order: $order->load('servicePackage.service')
    snap_token: $order->midtrans_token
    client_key: config('midtrans.client_key')
    snap_url: config('midtrans.snap_url')

show(Order $order):
  Gate::authorize('view', $order)
  Return Inertia 'Client/Orders/Show' with:
    order: $order->load('user', 'servicePackage.service', 'rating')

══════════════════════════════════════════════════════════════════
TASK: Create Form Request app/Http/Requests/StoreOrderRequest.php
══════════════════════════════════════════════════════════════════
  Extend FormRequest, authorize(): return auth()->check()
  rules() as above

══════════════════════════════════════════════════════════════════
TASK: Create app/Http/Controllers/Webhook/MidtransController.php
══════════════════════════════════════════════════════════════════
  handle(Request $request):
    IMPORTANT: This controller MUST NOT use CSRF middleware

    Step 1: Verify signature
      $valid = app(MidtransService::class)->verifyWebhookSignature($request->all())
      If !$valid → return response()->json(['message' => 'Invalid signature'], 403)

    Step 2: Find order
      $order = Order::where('midtrans_order_id', $request->order_id)->first()
      If !$order → return response()->json(['message' => 'Order not found'], 404)

    Step 3: Prevent duplicate processing (idempotency)
      If $order->midtrans_transaction_id === $request->transaction_id → return 200 OK

    Step 4: Determine new status
      $newStatus = app(MidtransService::class)->mapPaymentStatus(
        $request->transaction_status,
        $request->fraud_status ?? 'accept'
      )

    Step 5: Update order (DB::transaction)
      $order->update([
        'status'                  => $newStatus,
        'midtrans_transaction_id' => $request->transaction_id,
        'payment_type'            => $request->payment_type,
        'paid_at'                 => $newStatus === OrderStatus::PAID ? now() : null,
      ])

    Step 6: If status is PAID:
      Dispatch: SendOrderConfirmationJob::dispatch($order)
      (job sends email to client AND admin)

    Return response()->json(['message' => 'OK'], 200)

══════════════════════════════════════════════════════════════════
TASK: Create Jobs in app/Jobs/
══════════════════════════════════════════════════════════════════

FILE: app/Jobs/SendOrderConfirmationJob.php
  Constructor: Order $order (stored as $this->order)
  handle(): 
    Load $order with user, servicePackage.service
    Send Mail::to($order->user->email)->send(new OrderConfirmedMail($order))
    If admin email configured: Mail::to(config('mail.admin_email'))->send(new NewOrderAdminMail($order))

FILE: app/Mail/OrderConfirmedMail.php
  Constructor: Order $order
  envelope(): subject 'Pesanan Dikonfirmasi - ' . $order->order_code
  content(): return Content(view: 'mail.order-confirmed')
  Pass to view: $order with relationships loaded

FILE: resources/views/mail/order-confirmed.blade.php
  Simple HTML email template:
    - Thank you message
    - Order code + package name
    - Total amount (IDR)
    - Requirements summary
    - Link to view order
    - Contact info

══════════════════════════════════════════════════════════════════
TASK: Create React/TSX pages
══════════════════════════════════════════════════════════════════

FILE: resources/js/pages/Client/Orders/Payment.tsx
  Layout: Use public-layout or minimal centered layout
  Show:
    - Order summary card (left): package name, service, amount, requirements preview
    - Payment area (right): loading state then Midtrans Snap iframe/popup
  Logic:
    - On mount: load Midtrans Snap JS from snap_url prop (dynamic script tag)
    - Call window.snap.pay(snap_token, {
        onSuccess: (result) => router.visit(route('orders.show', order.id)),
        onPending: (result) => router.visit(route('orders.show', order.id)),
        onError:   (result) => setError(result.status_message),
        onClose:   ()       => setShowCancelWarning(true)
      })
    - Show "Hubungi kami jika ada masalah" fallback

FILE: resources/js/pages/Client/Orders/Show.tsx
  Layout: public-layout (logged in user)
  Show:
    - Status banner at top: color-coded based on OrderStatus
    - Order detail: order_code, created_at, package, service, requirements
    - Payment detail: payment_type, paid_at, total IDR
    - Progress section: visual step indicator (Pending → Paid → In Progress → Completed)
    - If status=COMPLETED and no rating: Show "Beri Rating" form (stars 1-5 + review textarea)
    - If status=COMPLETED and has rating: Show submitted rating

FILE: resources/js/pages/Public/Services/Index.tsx
  List all active services with packages
  Each service section has its packages as cards
  "Pesan Sekarang" button opens order form modal (not new page)
  Order form modal: textarea for requirements + submit
  If not auth: redirect to login with intended URL preserved

══════════════════════════════════════════════════════════════════
TASK: Update Public HomeController to pass additional data
══════════════════════════════════════════════════════════════════
  (Add after Stage 5 HomeController):
  Pass 'auth_user' to Home.tsx so the CTA buttons know to show login flow

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST:
══════════════════════════════════════════════════════════════════
  □ Midtrans webhook URL added to Midtrans dashboard in sandbox settings
  □ Webhook signature verification tested with test payload
  □ Order created → midtrans_order_id stored → webhook updates status (test with Midtrans simulator)
  □ Duplicate webhook calls do not create duplicate state changes
  □ User with 3+ pending orders cannot create new order (return error message)
  □ Snap JS only loaded on Payment page, not globally
  □ Job dispatched to queue (not run synchronously)
  □ php artisan queue:work processes SendOrderConfirmationJob without error
  □ Email rendered correctly in browser (Mailtrap or similar)
```

---

# STAGE 7 — FORUM SYSTEM

```
STAGE    : 7 of 13
GOAL     : Build complete forum system — public thread listing, thread detail with replies, create thread, comment on projects
DEPENDS  : Stage 5 + Stage 6 complete
OUTPUT   : Forum controllers (public + client + admin), Forum TSX pages, comment system

══════════════════════════════════════════════════════════════════
TASK: Create app/Http/Controllers/Public/ForumController.php
══════════════════════════════════════════════════════════════════

index():
  $threads = ForumThread::visible()
    ->with('user')
    ->withCount('visibleReplies')
    ->when($request->category, fn($q) => $q->where('category', $request->category))
    ->when($request->search, fn($q) => $q->where('title', 'LIKE', "%{$request->search}%"))
    ->orderByDesc('is_pinned')
    ->latest()
    ->paginate(15)
  Inertia 'Public/Forum/Index' with: threads(paginated), categories(ForumCategory enum values), current filters

show(ForumThread $thread):
  Gate: if thread->is_hidden → abort(404) unless admin
  $thread->increment('views')
  $replies = $thread->visibleReplies()->with('user')->paginate(20)
  Inertia 'Public/Forum/Thread' with: thread(loaded with user), replies(paginated)

══════════════════════════════════════════════════════════════════
TASK: Create app/Http/Controllers/Client/ForumController.php
══════════════════════════════════════════════════════════════════

storeThread(Request $request):
  Validate:
    title    : required|string|min:10|max:255
    body     : required|string|min:20
    category : required|in:ForumCategory values
  Rate limit: throttle(5,1) via middleware on route
  DB::transaction():
    $thread = ForumThread::create([
      'user_id'  => auth()->id(),
      'title'    => $request->title,
      'slug'     => Str::slug($request->title) + unique suffix if collision
      'body'     => strip_tags($request->body, '<p><br><strong><em><ul><li><ol>')  ← sanitize
      'category' => $request->category,
    ])
  Return redirect to route('forum.show', $thread->slug) with success flash

updateThread(Request $request, ForumThread $thread):
  Gate::authorize('update', $thread)
  If thread->is_locked → return back()->withErrors(['body' => 'Thread terkunci'])
  Validate title, body, category
  $thread->update([...])
  Return redirect back with success

destroyThread(ForumThread $thread):
  Gate::authorize('delete', $thread)
  $thread->delete()  ← softDelete
  Return redirect to route('forum.index') with success

storeReply(Request $request, ForumThread $thread):
  If thread->is_locked → return back()->withErrors(['body' => 'Thread terkunci'])
  Validate body: required|string|min:5
  Sanitize body
  DB::transaction():
    ForumReply::create(['thread_id' => $thread->id, 'user_id' => auth()->id(), 'body' => $body])
    (ForumReply observer handles replies_count increment)
  Return redirect back with success + fragment #reply-{$reply->id}

updateReply(Request $request, ForumReply $reply):
  Gate::authorize('update', $reply)
  Validate body
  $reply->update(['body' => $body])
  Return back with success

destroyReply(ForumReply $reply):
  Gate::authorize('delete', $reply)
  $reply->delete()  (observer decrements count)
  Return back with success

══════════════════════════════════════════════════════════════════
TASK: Admin Forum Moderation
══════════════════════════════════════════════════════════════════

FILE: app/Http/Controllers/Admin/ForumController.php  (moderation actions)
  index(): List all threads including hidden, with user, reply count, status
  hide(ForumThread $thread): Toggle is_hidden, return back with flash
  pin(ForumThread $thread): Toggle is_pinned, return back with flash
  lock(ForumThread $thread): Toggle is_locked, return back with flash
  destroy(ForumThread $thread): HARD delete (admin force delete for spam)

FILE: app/Http/Controllers/Admin/ForumReplyController.php
  hide(ForumReply $reply): Toggle is_hidden
  destroy(ForumReply $reply): Hard delete

══════════════════════════════════════════════════════════════════
TASK: Create Project Comment Controller
══════════════════════════════════════════════════════════════════

FILE: app/Http/Controllers/Client/ReviewController.php
  storeComment(Request $request, Project $project):
    Validate body: required|string|min:5|max:1000
    Auth required
    Sanitize, create, redirect back

  storeRating(Request $request, Project $project):
    Find the user's completed order for this service (any service, since rating is on order)
    Actually: rating is on Order, not Project. Rethink:
    
    Correct logic:
      POST /orders/{order}/rating
      Auth required, Gate check via RatingPolicy::create(user, order)
      Validate: score(required,int,1-5), review(nullable,string,max:500)
      Create Rating, update order if needed
      Return back with success
    
    IMPORTANT: Fix route in Stage 3 — change route to:
      POST /orders/{order}/rating → Client\ReviewController@storeRating

══════════════════════════════════════════════════════════════════
TASK: Create TSX pages
══════════════════════════════════════════════════════════════════

FILE: resources/js/pages/Public/Forum/Index.tsx
  Layout: public-layout
  Top section: "Forum Diskusi" heading + search input + category filter tabs
  "Buat Thread Baru" button (shows modal form if auth, redirects to login if not)
  Thread list: pinned threads first (with 📌 indicator), then latest
  Each thread item:
    - User avatar (initials circle)
    - Title (clickable)
    - Category badge
    - Reply count + view count
    - Relative time (date-fns)
    - "Terkunci" badge if is_locked
  Pagination
  New thread modal: title input, category select, body textarea, submit

FILE: resources/js/pages/Public/Forum/Thread.tsx
  Layout: public-layout
  Thread header: title, category, user info, created time, view count
  Thread body: render HTML (use dangerouslySetInnerHTML with DOMPurify)
  Admin actions (if auth.user.role === 'admin'): Pin, Lock, Hide, Delete buttons
  Reply list:
    Each reply: user avatar, body (HTML), time, edit/delete (own replies), hide (admin)
    Best answer highlighted (gold border)
  Reply form at bottom (if auth):
    Textarea, Submit button
    If thread is_locked: show "Thread terkunci, tidak bisa dibalas" instead
  Login prompt if not auth

  IMPORTANT: All user-generated HTML MUST go through DOMPurify.sanitize() before dangerouslySetInnerHTML
  Install: npm install dompurify @types/dompurify

══════════════════════════════════════════════════════════════════
TASK: Add Admin Forum page
══════════════════════════════════════════════════════════════════

FILE: resources/js/pages/Admin/Forum/Index.tsx
  Table: all threads including hidden
  Columns: user, title, category, replies, status (visible/hidden/locked/pinned), actions
  Actions: Hide/Show, Pin/Unpin, Lock/Unlock, Force Delete
  Filter: Show Hidden Only toggle

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST:
══════════════════════════════════════════════════════════════════
  □ DOMPurify installed and used on ALL dangerouslySetInnerHTML in forum
  □ Locked threads show reply form as disabled, not hidden
  □ Thread slug auto-generated with unique collision handling
  □ replies_count stays accurate after soft-delete of replies
  □ Admin can see hidden threads; regular users get 404
  □ Rate limiting on storeThread (5/minute) returns clear error message
  □ Forum Index loads with pagination working
  □ Thread show increments views exactly once per page load (not on reply)
```

---

# STAGE 8 — MULTI-LANGUAGE & CURRENCY

```
STAGE    : 8 of 13
GOAL     : Implement full bilingual support (ID/EN) for all public pages + currency display toggle
DEPENDS  : Stage 7 complete
OUTPUT   : Laravel lang files, React i18n setup, language/currency switcher components

══════════════════════════════════════════════════════════════════
TASK: Install packages
══════════════════════════════════════════════════════════════════
  npm install react-i18next i18next i18next-http-backend
  (Do NOT install i18next-browser-languagedetector — we control locale from Laravel session)

══════════════════════════════════════════════════════════════════
TASK: Create Laravel translation files
══════════════════════════════════════════════════════════════════

DIRECTORY STRUCTURE:
  lang/
    id/
      home.php    ← Home page strings
      nav.php     ← Navigation strings
      forum.php   ← Forum strings
      orders.php  ← Order strings
      common.php  ← Shared strings (buttons, labels, etc)
    en/
      (same files)

CONTENT GUIDELINES:
  - Indonesian (id): casual but professional, use "Anda" form
  - English (en): friendly professional
  - Keys must be identical in both languages
  - Include ALL visible text strings from public pages

EXAMPLE lang/en/home.php:
  return [
    'hero_badge'    => 'Available for projects',
    'hero_name'     => 'Arif Pratama',
    'hero_subtitle' => 'Full Stack Web Developer · Laravel & React Specialist',
    'hire_me'       => 'Hire Me',
    'view_projects' => 'View Projects',
    'stats_projects'=> 'Projects Done',
    'stats_clients' => 'Clients Served',
    'stats_years'   => 'Years Experience',
    'stats_sat'     => 'Satisfaction Rate',
    'calc_title'    => 'Project Price Estimator',
    'calc_cta_contact' => 'Contact Me',
    'calc_cta_order'   => 'Order Now',
    ...
  ]

══════════════════════════════════════════════════════════════════
TASK: Pass translations from Laravel to Inertia/React
══════════════════════════════════════════════════════════════════

APPROACH: Include translations in Inertia shared props (NOT HTTP requests from React)
  This avoids additional HTTP round-trips.

In HandleInertiaRequests.php share() method, ADD:
  'translations' => [
    'home'   => __('home'),  // returns entire array from lang/XX/home.php
    'nav'    => __('nav'),
    'forum'  => __('forum'),
    'orders' => __('orders'),
    'common' => __('common'),
  ],

In resources/js/types/inertia.ts SharedProps, ADD:
  translations: Record<string, Record<string, string>>

In resources/js/lib/i18n.ts:
  Create a simple wrapper (no i18next needed since we load from props):
    export function useTranslation(namespace: string) {
      const { translations } = usePage<SharedProps>().props
      return {
        t: (key: string, params?: Record<string,string>): string => {
          let str = translations[namespace]?.[key] ?? key
          if (params) {
            Object.entries(params).forEach(([k,v]) => { str = str.replace(`:${k}`, v) })
          }
          return str
        }
      }
    }

NOTE: Only use react-i18next if the above approach creates issues.
Prefer the simpler Inertia-shared-props approach.

══════════════════════════════════════════════════════════════════
TASK: Create Language and Currency switcher
══════════════════════════════════════════════════════════════════

FILE: resources/js/components/public/language-switcher.tsx
  Show: "EN" / "ID" toggle pill buttons
  On click: router.get(route('locale.set', {lang: 'en'}), {}, {preserveState: true, preserveScroll: true})

FILE: resources/js/components/public/currency-switcher.tsx
  Show: "Rp" / "$" toggle pill buttons
  On click: router.get(route('currency.set', {currency: 'USD'}), {}, {preserveState: true, preserveScroll: true})

FILE: app/Http/Controllers/LocaleController.php
  set(Request $request):
    $locale = in_array($request->lang, ['id', 'en']) ? $request->lang : 'id'
    session(['locale' => $locale])
    if (auth()->check()) auth()->user()->update(['locale' => $locale])
    return back()

FILE: app/Http/Controllers/CurrencyController.php
  set(Request $request):
    $currency = in_array($request->currency, ['IDR', 'USD']) ? $request->currency : 'IDR'
    session(['currency' => $currency])
    return back()

Add routes in routes/web.php:
  GET /locale/{lang}   → LocaleController@set   [name: locale.set]
  GET /currency/{currency} → CurrencyController@set [name: currency.set]

══════════════════════════════════════════════════════════════════
TASK: Currency display in React components
══════════════════════════════════════════════════════════════════

FILE: resources/js/lib/currency.ts
  Create helper:
    formatCurrency(amount: number, currency: 'IDR' | 'USD', exchangeRate: number): string
      if IDR: return new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0}).format(amount)
      if USD: return new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(amount / exchangeRate)

  Export hook:
    useCurrency(): { format: (amountIDR: number) => string, currency: string }
      Uses usePage().props.currency and usePage().props.exchange_rate

Update all price displays in:
  - service-package-card.tsx
  - project-card.tsx
  - Home.tsx (calculator result)
  - Orders/Show.tsx

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST:
══════════════════════════════════════════════════════════════════
  □ Switching EN→ID updates ALL visible text on current page without full reload
  □ Language preference persists across page navigation
  □ Logged-in user's locale saved to DB (survives browser restart)
  □ Switching IDR→USD updates all price displays (calculator, packages, projects)
  □ Exchange rate fallback works when API unreachable (use config fallback)
  □ Translation keys with missing values show key name (not crash)
  □ Both lang/id/ and lang/en/ files have identical key sets
```

---

# STAGE 9 — USER DASHBOARD (CLIENT AREA)

```
STAGE    : 9 of 13
GOAL     : Build the authenticated client dashboard showing their orders, activity, and recommendations
DEPENDS  : Stage 6 (orders), Stage 7 (forum), Stage 8 (i18n)
OUTPUT   : Client dashboard controller + TSX pages + activity tracking

══════════════════════════════════════════════════════════════════
TASK: Create app/Http/Controllers/Client/DashboardController.php
══════════════════════════════════════════════════════════════════

index():
  $user = auth()->user()
  Return Inertia 'Client/Dashboard' with:
    stats:
      active_orders   : $user->orders()->whereIn('status', ['pending','paid','in_progress'])->count()
      completed_orders: $user->orders()->where('status','completed')->count()
      forum_posts     : $user->forumThreads()->count() + $user->forumReplies()->count()
      reviews_given   : $user->ratings()->count()
    recent_orders: $user->orders()
                         ->with('servicePackage.service')
                         ->latest()
                         ->take(3)
                         ->get()
    forum_activity: $user->forumThreads()
                          ->with(['replies' => fn($q) => $q->latest()->take(1)])
                          ->latest()
                          ->take(3)
                          ->get()
    recommendations: app(RecommendationService::class)->getForUser($user)
    has_unrated_orders: $user->orders()
                               ->where('status', 'completed')
                               ->doesntHave('rating')
                               ->exists()

══════════════════════════════════════════════════════════════════
TASK: Add Client route group to routes/web.php
══════════════════════════════════════════════════════════════════
  Auth + verified middleware group, prefix /dashboard (or /client), as 'client.':
    GET /dashboard → Client\DashboardController@index [name: client.dashboard]
    GET /my-orders  → Client\OrderController@myOrders  [name: client.orders]

══════════════════════════════════════════════════════════════════
TASK: Create TSX pages
══════════════════════════════════════════════════════════════════

FILE: resources/js/pages/Client/Dashboard.tsx
  Layout: Use public-layout.tsx (same layout as public pages, sidebar shows client menu when auth)
  Sidebar behavior when logged in:
    Add "Client Area" section to the public sidebar with:
      Dashboard, My Orders, Forum (with post count), Settings

  Page content:
    Greeting header: "Selamat datang, {user.name}" + subtitle
    Stats row (4 cards): Active Orders, Completed, Forum Posts, Reviews Given
    Two-column layout:
      Left (2/3):
        "Pesanan Aktif" section: list of recent_orders as order cards
          Each card: service name, package, status badge, progress bar, order code, price, date
          Link to full order detail
          "Lihat semua pesanan →" link
        "Aktivitas Forum" section: recent threads user participated in
      Right (1/3):
        "Rekomendasi Untukmu" section: recommendation cards from RecommendationService
          Each card: package name + reason string + "Pesan Sekarang" CTA
        If has_unrated_orders: Banner prompt "Beri review untuk pesanan selesai kamu →"

IMPORTANT SIDEBAR MODIFICATION:
  Update public-layout.tsx to conditionally show:
    - If NOT auth: public nav items only
    - If auth AND role=client: add "Client Area" section
    - If auth AND role=admin: show admin quick-links section

══════════════════════════════════════════════════════════════════
TASK: Create My Orders list page
══════════════════════════════════════════════════════════════════

FILE: app/Http/Controllers/Client/OrderController.php  (add myOrders method)
  myOrders():
    $orders = auth()->user()->orders()
                     ->with('servicePackage.service', 'rating')
                     ->latest()
                     ->paginate(10)
    Return Inertia 'Client/Orders/Index' with: orders (paginated)

FILE: resources/js/pages/Client/Orders/Index.tsx
  Layout: public-layout
  Filter tabs: All | Active | Completed | Cancelled
  Order list table/cards:
    Columns: Order Code, Service+Package, Amount, Status, Date, Actions
    Actions: View Detail, Pay Now (if pending + has token), Rate (if completed, no rating)
  Empty state: "Belum ada pesanan. Mulai proyek pertamamu →"

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST:
══════════════════════════════════════════════════════════════════
  □ Client dashboard only accessible to authenticated users (redirect to login)
  □ Client CANNOT see other users' orders
  □ Recommendation logic works for all 3 scenarios (new, active, completed user)
  □ "Pay Now" button only shows for PENDING orders with valid midtrans_token
  □ Stats counters are accurate (test by creating orders and posting forum threads)
  □ Sidebar shows correct sections based on auth state
```

---

# STAGE 10 — REVIEWS, RATINGS & RECOMMENDATIONS

```
STAGE    : 10 of 13
GOAL     : Complete rating submission, display, and refine recommendation engine
DEPENDS  : Stage 9 complete
OUTPUT   : Rating flow (fixed from Stage 7), rating display on projects, RecommendationService refined

══════════════════════════════════════════════════════════════════
TASK: Fix and finalize app/Http/Controllers/Client/ReviewController.php
══════════════════════════════════════════════════════════════════

storeRating(Request $request, Order $order):
  Gate::authorize('create', [Rating::class, $order])  → uses RatingPolicy
  Validate:
    score  : required|integer|min:1|max:5
    review : nullable|string|max:500
  DB::transaction():
    Rating::create([
      'user_id'  => auth()->id(),
      'order_id' => $order->id,
      'score'    => $request->score,
      'review'   => $request->review,
      'is_visible' => true,
    ])
  Return back()->with('success', 'Terima kasih! Rating kamu telah disimpan.')

══════════════════════════════════════════════════════════════════
TASK: Display ratings on Project show page
══════════════════════════════════════════════════════════════════

In ProjectController@show (Stage 5), ALSO load:
  $ratingsData = [
    'average' => $project->ratings()->where('is_visible', true)->avg('score') ?? 0,
    'count'   => $project->ratings()->where('is_visible', true)->count(),
    'items'   => $project->ratings()
                          ->where('is_visible', true)
                          ->with('user', 'order.servicePackage')
                          ->latest()
                          ->take(5)
                          ->get(),
  ]

In Projects/Show.tsx, add rating section:
  Star display (average out of 5, filled/empty SVG stars)
  Count label: "4.8 dari 5 · 12 ulasan"
  List of reviews: user avatar, star score, review text, date, package name

FILE: resources/js/components/public/star-rating.tsx
  Props: value (0-5 float), size ('sm'|'md'|'lg'), interactive (bool)
  If interactive=true: clickable stars → onChange callback
  Show half-stars for averages (e.g., 4.5 = 4 full + 1 half)
  No emoji — use SVG star path

══════════════════════════════════════════════════════════════════
TASK: Admin Rating Management
══════════════════════════════════════════════════════════════════

FILE: app/Http/Controllers/Admin/RatingController.php
  index(): All ratings with user, order, project info. Paginated.
  toggleVisibility(Rating $rating): Toggle is_visible, return back with flash.

FILE: resources/js/pages/Admin/Reviews/Index.tsx
  Table: user, project, score (star display), review excerpt, visible toggle, date
  Toggle visibility with optimistic UI update

══════════════════════════════════════════════════════════════════
TASK: Refine RecommendationService.php
══════════════════════════════════════════════════════════════════

Enhanced logic:
  1. Load user's order history (package names, categories, statuses)
  2. Rule: IF has_completed_order → find next tier in same service + reason = "Upgrade dari {prev_package}"
     Rule: IF active_order_nearing_complete (days < 14) → maintenance packages + reason = "Siapkan maintenance"
     Rule: IF has_forum_posts_about_ecommerce → ecommerce packages + reason = "Cocok untuk kebutuhan kamu"
     Rule: FALLBACK → most popular packages by order count + reason = "Dipilih banyak klien"
  3. Filter out packages user already has active order for
  4. Limit to 3 recommendations
  5. Append 'reason' string to each ServicePackage result (not in DB — added in PHP)

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST:
══════════════════════════════════════════════════════════════════
  □ User can only rate once per order (unique constraint enforced at DB + Policy level)
  □ Rating form only visible if order.status === 'completed' AND no existing rating
  □ Star rating component handles 0, 0.5, 1.0, 1.5, ... 5.0 correctly
  □ Average rating recalculated correctly after new rating (no caching issues)
  □ Admin hide rating → not shown on project page immediately
  □ Recommendation never recommends a package user has an active pending order for
```

---

# STAGE 11 — ADMIN USER MANAGEMENT & SECURITY HARDENING

```
STAGE    : 11 of 13
GOAL     : Admin user management (list, ban, delete) + full security audit implementation
DEPENDS  : Stage 10 complete
OUTPUT   : UserController (admin), User management page, security implementations

══════════════════════════════════════════════════════════════════
TASK: Create app/Http/Controllers/Admin/UserController.php
══════════════════════════════════════════════════════════════════

index():
  $users = User::where('role', 'client')
               ->withCount(['orders', 'forumThreads', 'forumReplies', 'ratings'])
               ->latest()
               ->paginate(20)
  Inertia 'Admin/Users/Index' with: users

show(User $user):
  Load user with all counts + recent orders + recent forum activity
  Inertia 'Admin/Users/Show'

ban(User $user):
  If $user->isAdmin() → abort(403, 'Cannot ban admin')
  $user->update(['is_banned' => !$user->is_banned])
  Return back with flash

destroy(User $user):
  If $user->isAdmin() → abort(403)
  If $user->orders()->whereIn('status',['paid','in_progress'])->exists():
    Return back()->withErrors(['user' => 'Cannot delete user with active paid orders'])
  DB::transaction():
    $user->forumReplies()->delete()  ← soft delete
    $user->forumThreads()->delete()  ← soft delete
    $user->delete()
  Return redirect to route('admin.users') with success

══════════════════════════════════════════════════════════════════
TASK: Implement Banned User Middleware
══════════════════════════════════════════════════════════════════

FILE: app/Http/Middleware/CheckBanned.php
  If auth()->check() && auth()->user()->is_banned:
    auth()->logout()
    session()->invalidate()
    Return redirect to route('login')->withErrors(['email' => 'Akun Anda telah dinonaktifkan.'])

Register in bootstrap/app.php for 'web' middleware group (AFTER auth middleware)

══════════════════════════════════════════════════════════════════
TASK: Security Implementations
══════════════════════════════════════════════════════════════════

1. RATE LIMITING (in routes/web.php or AppServiceProvider):
   RateLimiter::for('forum-post', function (Request $request) {
     return Limit::perMinute(5)->by($request->user()?->id ?: $request->ip())
   });
   RateLimiter::for('order-create', function (Request $request) {
     return Limit::perHour(10)->by($request->user()?->id)
   });
   Apply to forum storeThread/storeReply and order store routes.

2. FILE UPLOAD SECURITY (in ProjectController@store/update):
   - Validate mimes:jpg,jpeg,png,webp explicitly
   - Use $file->hashName() for stored filename (not original name)
   - Store in storage/app/public/projects/ (never in public/)
   - Max 5MB enforced at validation
   - After storing: call Image::make()->resize(1200, null, fn => ...)->save() for thumbnail resize
     (requires intervention/image: composer require intervention/image)

3. XSS PROTECTION in Forum:
   - Backend: Strip dangerous tags when storing (use strip_tags with allowed list)
   - Frontend: DOMPurify.sanitize() before all dangerouslySetInnerHTML (verify from Stage 7)

4. IDOR PROTECTION (verify existing):
   - Review all OrderPolicy usages — add gate check to every order-related route
   - Run: php artisan route:list and verify all routes have auth middleware where needed

5. Add security headers in bootstrap/app.php via middleware:
   X-Frame-Options: SAMEORIGIN
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: geolocation=(), camera=()

══════════════════════════════════════════════════════════════════
TASK: Create Admin Users page
══════════════════════════════════════════════════════════════════

FILE: resources/js/pages/Admin/Users/Index.tsx
  Table: avatar, name, email, orders count, joined date, banned status, actions
  Actions: View, Ban/Unban (toggle), Delete (confirm dialog)
  Banned users: row highlighted with red tint
  Search by name/email

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST:
══════════════════════════════════════════════════════════════════
  □ Banned user is immediately logged out on next request
  □ Admin cannot ban self or delete self
  □ File upload rejects .php, .exe, .svg disguised as image (test with content-type spoofing)
  □ All forum HTML output passes through DOMPurify in browser
  □ Rate limiter returns 429 with clear error message (not 500)
  □ All security headers present in production response (check via curl -I)
  □ No route returns 500 on unauthenticated access (should be 401 or redirect)
```

---

# STAGE 12 — CALCULATOR CONFIG (ADMIN CRUD)

```
STAGE    : 12 of 13
GOAL     : Admin UI to manage price calculator configuration (project types, features, pricing)
DEPENDS  : Stage 11 complete
OUTPUT   : CalculatorConfigController (admin), Calculator Config TSX page, refined public calculator

══════════════════════════════════════════════════════════════════
TASK: Create app/Http/Controllers/Admin/CalculatorConfigController.php
══════════════════════════════════════════════════════════════════

index(): All configs with status. Inertia 'Admin/Calculator/Index'.

store(Request $request):
  Validate:
    project_type : required|string|unique:calculator_configs,project_type
    label        : required|string|max:100
    base_price   : required|numeric|min:0
    features     : required|array|min:1
    features.*.key        : required|string
    features.*.label      : required|string
    features.*.price_add  : required|numeric|min:0
    timeline_multipliers  : required|array|min:1
    timeline_multipliers.*.weeks      : required|integer|min:1
    timeline_multipliers.*.label      : required|string
    timeline_multipliers.*.multiplier : required|numeric|min:0.5|max:3
  Create record, return redirect with success

update(Request $request, CalculatorConfig $config):
  Same validation (unique rule: ignore current config)
  Update, return redirect with success

destroy(CalculatorConfig $config): Delete, return redirect

══════════════════════════════════════════════════════════════════
TASK: Refine Public CalculatorController
══════════════════════════════════════════════════════════════════

FILE: app/Http/Controllers/Public/CalculatorController.php

estimate(Request $request):
  Validate:
    project_type      : required|string|exists:calculator_configs,project_type
    selected_features : nullable|array
    selected_features.*: string
    timeline_weeks    : required|integer|min:1
  
  $result = app(PriceCalculatorService::class)->calculate(
    $request->project_type,
    $request->selected_features ?? [],
    $request->timeline_weeks
  )
  
  Return response()->json($result)

IMPORTANT: This endpoint returns JSON (not Inertia), called from React via axios/fetch.

══════════════════════════════════════════════════════════════════
TASK: Refine PriceCalculatorService
══════════════════════════════════════════════════════════════════

calculate(string $projectType, array $selectedFeatures, int $timelineWeeks): array
  1. $config = CalculatorConfig::active()->where('project_type', $projectType)->first()
     If !$config → return ['error' => 'Invalid project type']
  2. $basePrice = $config->base_price
  3. $featuresTotal = sum of features where key in $selectedFeatures → price_add
  4. Find timeline multiplier closest to $timelineWeeks
  5. $min = ($basePrice + $featuresTotal) * $multiplier * 0.9  ← 10% lower bound
     $max = ($basePrice + $featuresTotal) * $multiplier * 1.1  ← 10% upper bound
  6. Return:
    [
      'project_type'     => $projectType,
      'base_price'       => $basePrice,
      'features_total'   => $featuresTotal,
      'multiplier'       => $multiplier,
      'timeline_label'   => $timelineLabel,
      'min'              => round($min, -5),  ← round to nearest 100k
      'max'              => round($max, -5),
      'currency'         => 'IDR',
      'formatted_min'    => 'Rp ' . number_format($min, 0, ',', '.'),
      'formatted_max'    => 'Rp ' . number_format($max, 0, ',', '.'),
    ]

══════════════════════════════════════════════════════════════════
TASK: Update Home.tsx calculator section to use real API
══════════════════════════════════════════════════════════════════

In Home.tsx PriceCalculator section:
  State: selectedType, selectedFeatures (Set), selectedTimeline, estimate (null | object), loading
  
  When selectedType changes:
    - Load config for that type from calculator_types prop (passed from Laravel, includes features array)
    - This means HomeController must also pass feature options per type
    
    Update HomeController:
      calculator_configs: CalculatorConfig::active()->get()
      Pass full config objects (not just types) so React has features without extra API call
  
  When ANY selection changes AND all 3 steps are complete:
    Debounce 300ms then:
    fetch('/calculator/estimate', {method:'POST', body: JSON.stringify({...}), headers: {'X-CSRF-TOKEN': ...}})
    .then(res => res.json())
    .then(data => setEstimate(data))
    .catch(() => setEstimate(null))
  
  Show loading spinner in result area during fetch

══════════════════════════════════════════════════════════════════
TASK: Admin Calculator Config page
══════════════════════════════════════════════════════════════════

FILE: resources/js/pages/Admin/Calculator/Index.tsx
  List: project types with base price, feature count, active status
  "Tambah Config" button
  Each row: Edit, Delete, Toggle Active

FILE: resources/js/pages/Admin/Calculator/Form.tsx  (Create + Edit)
  Fields:
    Project Type: text input (e.g., "web_app")
    Label: text input (e.g., "Web Application")
    Base Price: number input (IDR)
    Active: toggle
    Features: dynamic list
      Each row: Key input | Label input | Price Add input | Remove button
      "+ Tambah Fitur" button to add row
    Timeline Multipliers: dynamic list
      Each row: Weeks input | Label input | Multiplier input | Remove button
      "+ Tambah Timeline" button

══════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST:
══════════════════════════════════════════════════════════════════
  □ Calculator returns estimate within 500ms (no complex queries)
  □ Rounding to nearest 100k looks correct (Rp 15.000.000 not Rp 14.987.234)
  □ CSRF token sent correctly in calculator fetch (not blocked by Laravel)
  □ Admin can add/remove features and timeline options dynamically
  □ Disabling a config type → not shown in public calculator
  □ Calculator works with 0 selected features (base price only scenario)
```

---

# STAGE 13 — QA, POLISH & PRODUCTION READINESS

```
STAGE    : 13 of 13
GOAL     : Final quality assurance, performance optimization, and production deployment prep
DEPENDS  : All stages 1-12 complete and working
OUTPUT   : Bug fixes, performance improvements, .env.production template, deployment checklist

══════════════════════════════════════════════════════════════════
TASK: Performance Optimizations
══════════════════════════════════════════════════════════════════

1. EAGER LOADING AUDIT — Find and fix N+1 queries:
   Review ALL controllers with paginated results.
   Use Laravel Debugbar (composer require barryvdh/laravel-debugbar --dev) to find N+1.
   Fix every N+1 with ->with() or ->withCount().

2. DATABASE QUERY OPTIMIZATION:
   Add composite indexes that are missing:
   - orders: (user_id, status) for client dashboard
   - forum_threads: (is_hidden, is_pinned, created_at) for forum listing
   Run EXPLAIN on the 3 most complex queries and verify indexes are used.

3. CACHING:
   Cache homepage stats (project count, etc.) for 30 minutes:
     Cache::remember('homepage_stats', 1800, fn() => [...])
   Cache calculator config for 1 hour.
   Clear relevant cache on admin CRUD operations (use Model observers or direct Cache::forget).

4. IMAGE OPTIMIZATION:
   Ensure all uploaded project thumbnails resized to max 1200px wide.
   Add lazy loading attribute to all project card images: <img loading="lazy" ...>

5. FRONTEND BUNDLE ANALYSIS:
   Run: npm run build
   Check dist/ folder — main bundle should be < 500KB gzipped.
   If larger: check for accidental import of large libraries.

══════════════════════════════════════════════════════════════════
TASK: Global Error Handling
══════════════════════════════════════════════════════════════════

1. Create resources/js/components/flash-toast.tsx
   Read flash.success / flash.error / flash.warning from SharedProps
   Show toast notification (using sonner or custom) on every page load if flash exists
   Import and use in public-layout.tsx AND app-layout.tsx

2. Create resources/js/pages/Error.tsx (or update existing)
   Handle 403, 404, 500 from Inertia:
   Create resources/views/errors/403.blade.php, 404.blade.php, 500.blade.php
   Each renders an Inertia page with appropriate message in dark theme

3. Global Inertia error handler in resources/js/app.tsx:
   router.on('error', (event) => {
     console.error('Inertia navigation error:', event)
   })

══════════════════════════════════════════════════════════════════
TASK: Final Security Checklist Implementation
══════════════════════════════════════════════════════════════════

Verify and implement ALL of the following:

  [ ] APP_DEBUG=false in production .env
  [ ] APP_ENV=production in production .env
  [ ] HTTPS enforced (add to AppServiceProvider for production):
        if (app()->isProduction()) URL::forceScheme('https');
  [ ] Remove debugbar from production (conditional require)
  [ ] All storage symlinks created: php artisan storage:link
  [ ] Config cached: php artisan config:cache
  [ ] Routes cached: php artisan route:cache
  [ ] Views cached: php artisan view:cache
  [ ] Queue worker configured (supervisor or cron)
  [ ] Midtrans webhook URL points to production domain in Midtrans dashboard
  [ ] Exchange rate API key set (if using paid tier)
  [ ] Admin user has strong password (not 'admin123' in production)
  [ ] .env NOT committed to git (.gitignore check)

══════════════════════════════════════════════════════════════════
TASK: Create .env.production.example
══════════════════════════════════════════════════════════════════

  APP_NAME="DevPorto"
  APP_ENV=production
  APP_DEBUG=false
  APP_URL=https://yourdomain.com
  
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=freelance_porto
  DB_USERNAME=your_db_user
  DB_PASSWORD=your_strong_password
  
  CACHE_DRIVER=file
  QUEUE_CONNECTION=database
  SESSION_DRIVER=file
  
  MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx   ← Change to live key for production
  MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
  MIDTRANS_IS_PRODUCTION=true
  
  MAIL_MAILER=smtp
  MAIL_HOST=smtp.yourmail.com
  MAIL_PORT=587
  MAIL_USERNAME=hello@yourdomain.com
  MAIL_PASSWORD=your_mail_password
  MAIL_ENCRYPTION=tls
  MAIL_FROM_ADDRESS=hello@yourdomain.com
  MAIL_ADMIN_EMAIL=admin@yourdomain.com
  
  EXCHANGE_RATE_API_KEY=your_key_here

══════════════════════════════════════════════════════════════════
TASK: Create deployment script deploy.sh
══════════════════════════════════════════════════════════════════

  #!/bin/bash
  set -e
  
  echo "=== Deploying Freelance Porto ==="
  
  git pull origin main
  
  composer install --optimize-autoloader --no-dev
  npm ci
  npm run build
  
  php artisan down --secret="your-maintenance-bypass-secret"
  
  php artisan migrate --force
  
  php artisan config:clear
  php artisan config:cache
  php artisan route:clear
  php artisan route:cache
  php artisan view:clear
  php artisan view:cache
  
  php artisan storage:link
  
  php artisan queue:restart
  
  php artisan up
  
  echo "=== Deploy complete ==="

══════════════════════════════════════════════════════════════════
TASK: Final Functional Testing Checklist
══════════════════════════════════════════════════════════════════

Test each flow end-to-end:

  [ ] Visitor: Open homepage → see all sections → change language → change currency
  [ ] Visitor: Browse projects → filter by category → open project detail
  [ ] Visitor: Use calculator → select all 3 steps → see price estimate
  [ ] Visitor: Click "Pesan Sekarang" → redirected to login → after login, back to services
  [ ] Client: Register → verify email (if enabled) → login → see dashboard
  [ ] Client: Order a service → complete Midtrans payment (sandbox) → see order status update
  [ ] Client: Post in forum → reply to thread → edit own reply
  [ ] Client: Rate a completed order → see rating on project page
  [ ] Admin: Login → see dashboard stats
  [ ] Admin: Create a new project → publish it → verify on public homepage
  [ ] Admin: View order → update status to in_progress → update to completed
  [ ] Admin: Moderate forum → hide a thread → verify hidden from public
  [ ] Admin: Ban a user → verify user is logged out
  [ ] Webhook: Use Midtrans payment notification simulator → verify order status updates

══════════════════════════════════════════════════════════════════
FINAL NOTES FOR AI CODING MODEL
══════════════════════════════════════════════════════════════════

  1. NEVER modify files in the "DO NOT MODIFY" list from the Global Context section
  2. ALWAYS use DB::transaction() for multi-table writes
  3. ALWAYS add ->with() for relationships before passing to Inertia
  4. ALWAYS validate input in FormRequest classes, not in controllers
  5. ALWAYS use TypeScript types — never use 'any'
  6. ALWAYS sanitize forum HTML with strip_tags (backend) AND DOMPurify (frontend)
  7. ALWAYS check OrderPolicy before any order operation
  8. NEVER store files in public/ — always use storage/ with symlink
  9. NEVER hardcode currency rates, prices, or API keys
  10. After each stage, run: php artisan test && npm run lint before proceeding
```

---

## QUICK REFERENCE — COMMAND CHEATSHEET

```bash
# After each stage — run these to verify:
php artisan migrate:fresh --seed   # Rebuild DB from scratch
php artisan route:list             # Verify all routes registered
php artisan test                   # Run test suite
npm run lint                       # Check TS/ESLint errors
npm run build                      # Verify frontend compiles

# Development:
php artisan serve                  # Start Laravel dev server
npm run dev                        # Start Vite HMR
php artisan queue:work             # Process background jobs

# Debugging:
php artisan tinker                 # Test models/services interactively
php artisan telescope:install      # Install Telescope for request debugging (dev only)
```

---

*Document version: 1.0 · Freelance Porto · 13 Stages · ~8 weeks*


cloudflared tunnel --url http://localhost:8000

php artisan serve --port=8000