<?php

namespace Database\Seeders;

use App\Models\CalculatorConfig;
use Illuminate\Database\Seeder;

class CalculatorConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $configs = [
            [
                'project_type' => 'landing_page',
                'label' => 'Landing Page Development',
                'base_price' => 3000000,
                'features' => [
                    ['key' => 'design_custom', 'label' => 'Custom UI Design', 'price_add' => 2000000],
                    ['key' => 'responsive', 'label' => 'Responsive Design', 'price_add' => 0],
                    ['key' => 'seo', 'label' => 'SEO Optimization', 'price_add' => 1000000],
                    ['key' => 'contact_form', 'label' => 'Advanced Contact Form', 'price_add' => 500000],
                    ['key' => 'animation', 'label' => 'Lottie Animations', 'price_add' => 1500000],
                ],
                'timeline_multipliers' => [
                    ['weeks' => 1, 'label' => 'Express (1 week)', 'multiplier' => 1.5],
                    ['weeks' => 2, 'label' => 'Standard (2 weeks)', 'multiplier' => 1.0],
                    ['weeks' => 4, 'label' => 'Relaxed (4 weeks)', 'multiplier' => 0.9],
                ],
            ],
            [
                'project_type' => 'web_app',
                'label' => 'Web Application (SaaS/Dashboard)',
                'base_price' => 15000000,
                'features' => [
                    ['key' => 'auth', 'label' => 'User Authentication', 'price_add' => 3000000],
                    ['key' => 'payments', 'label' => 'Payment Integration', 'price_add' => 5000000],
                    ['key' => 'roles', 'label' => 'RBAC (Roles & Permissions)', 'price_add' => 4000000],
                    ['key' => 'export', 'label' => 'PDF/Excel Export', 'price_add' => 2000000],
                    ['key' => 'charts', 'label' => 'Interactive Charts', 'price_add' => 3000000],
                    ['key' => 'realtime', 'label' => 'Real-time Notifications', 'price_add' => 4500000],
                ],
                'timeline_multipliers' => [
                    ['weeks' => 4, 'label' => 'Express (4 weeks)', 'multiplier' => 1.4],
                    ['weeks' => 8, 'label' => 'Standard (8 weeks)', 'multiplier' => 1.0],
                    ['weeks' => 12, 'label' => 'Relaxed (12 weeks)', 'multiplier' => 0.85],
                ],
            ],
            [
                'project_type' => 'ecommerce',
                'label' => 'E-Commerce Platform',
                'base_price' => 10000000,
                'features' => [
                    ['key' => 'inventory', 'label' => 'Inventory Management', 'price_add' => 4000000],
                    ['key' => 'coupons', 'label' => 'Coupon & Discount System', 'price_add' => 2500000],
                    ['key' => 'reviews', 'label' => 'Product Reviews', 'price_add' => 1500000],
                    ['key' => 'shipping', 'label' => 'RajaOngkir Integration', 'price_add' => 3000000],
                    ['key' => 'multivendor', 'label' => 'Multi-Vendor Support', 'price_add' => 15000000],
                ],
                'timeline_multipliers' => [
                    ['weeks' => 6, 'label' => 'Express (6 weeks)', 'multiplier' => 1.3],
                    ['weeks' => 10, 'label' => 'Standard (10 weeks)', 'multiplier' => 1.0],
                    ['weeks' => 16, 'label' => 'Relaxed (16 weeks)', 'multiplier' => 0.9],
                ],
            ],
            [
                'project_type' => 'custom_api',
                'label' => 'Custom API Development',
                'base_price' => 8000000,
                'features' => [
                    ['key' => 'documentation', 'label' => 'Swagger/OpenAPI Documentation', 'price_add' => 2000000],
                    ['key' => 'caching', 'label' => 'Redis Caching', 'price_add' => 3000000],
                    ['key' => 'webhooks', 'label' => 'Webhook System', 'price_add' => 4000000],
                    ['key' => 'security', 'label' => 'OAuth2 / JWT', 'price_add' => 3500000],
                ],
                'timeline_multipliers' => [
                    ['weeks' => 3, 'label' => 'Express (3 weeks)', 'multiplier' => 1.25],
                    ['weeks' => 6, 'label' => 'Standard (6 weeks)', 'multiplier' => 1.0],
                    ['weeks' => 10, 'label' => 'Relaxed (10 weeks)', 'multiplier' => 0.9],
                ],
            ],
        ];

        foreach ($configs as $config) {
            CalculatorConfig::create($config);
        }
    }
}
