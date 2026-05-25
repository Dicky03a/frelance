export type UserRole = 'admin' | 'client';
export type OrderStatus = 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'expired';
export type ProjectStatus = 'draft' | 'published' | 'archived';
export type ProjectCategory = 'web_app' | 'landing_page' | 'ecommerce' | 'api' | 'mobile' | 'other';
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'other';
export type ForumCategory = 'general' | 'technical' | 'price' | 'recommendation' | 'other';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar: string | null;
    locale: string;
    is_banned: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Skill {
    id: number;
    name: string;
    icon: string | null;
    category: SkillCategory;
    level: number;
    color: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    title: string;
    slug: string;
    description: string;
    long_description: string | null;
    tech_stack: string[];
    thumbnail: string | null;
    images: string[] | null;
    price_from: number | null;
    price_to: number | null;
    duration_weeks: number | null;
    live_url: string | null;
    github_url: string | null;
    category: ProjectCategory;
    status: ProjectStatus;
    is_featured: boolean;
    views: number;
    sort_order: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    skills?: Skill[];
    comments?: ProjectComment[];
    ratings?: Rating[];
}

export interface Service {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    packages?: ServicePackage[];
}

export interface ServicePackage {
    id: number;
    service_id: number;
    name: string;
    description: string | null;
    price_idr: number;
    price_usd: number;
    features: string[];
    is_popular: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    service?: Service;
}

export interface Order {
    id: number;
    user_id: number;
    service_package_id: number;
    order_code: string;
    requirements: string | null;
    notes_admin: string | null;
    total_idr: number;
    total_usd: number;
    exchange_rate: number;
    status: OrderStatus;
    midtrans_order_id: string | null;
    midtrans_transaction_id: string | null;
    midtrans_token: string | null;
    payment_type: string | null;
    payment_url: string | null;
    paid_at: string | null;
    completed_at: string | null;
    expired_at: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    service_package?: ServicePackage;
    rating?: Rating;
}

export interface ForumThread {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    body: string;
    category: ForumCategory;
    is_pinned: boolean;
    is_locked: boolean;
    is_hidden: boolean;
    views: number;
    replies_count: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    replies?: ForumReply[];
}

export interface ForumReply {
    id: number;
    thread_id: number;
    user_id: number;
    body: string;
    is_hidden: boolean;
    is_best_answer: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    thread?: ForumThread;
}

export interface ProjectComment {
    id: number;
    project_id: number;
    user_id: number;
    body: string;
    is_hidden: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    project?: Project;
}

export interface Rating {
    id: number;
    user_id: number | null;
    order_id: number | null;
    project_id: number | null;
    score: number;
    review: string | null;
    manual_client_name: string | null;
    manual_project_name: string | null;
    is_visible: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
    order?: Order;
    project?: Project;
}

export interface CalculatorConfig {
    id: number;
    project_type: string;
    label: string;
    base_price: number;
    features: Array<{ key: string; label: string; price_add: number }>;
    timeline_multipliers: Array<{ weeks: number; label: string; multiplier: number }>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
