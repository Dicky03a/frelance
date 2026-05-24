<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Web Development',
                'description' => 'Custom website and web application development.',
                'icon' => 'code',
                'packages' => [
                    [
                        'name' => 'Starter',
                        'description' => 'Perfect for landing pages and simple sites.',
                        'price_idr' => 5000000,
                        'price_usd' => 320,
                        'features' => ['1-5 Pages', 'Responsive Design', 'Basic SEO', '1 Month Support'],
                        'is_popular' => false,
                    ],
                    [
                        'name' => 'Professional',
                        'description' => 'Robust web application with custom logic.',
                        'price_idr' => 20000000,
                        'price_usd' => 1280,
                        'features' => ['Unlimited Pages', 'Custom Dashboard', 'API Integration', '3 Months Support', 'Advanced SEO'],
                        'is_popular' => true,
                    ],
                    [
                        'name' => 'Enterprise',
                        'description' => 'Large scale systems for big organizations.',
                        'price_idr' => 50000000,
                        'price_usd' => 3200,
                        'features' => ['Microservices Architecture', 'High Security', '24/7 Priority Support', 'Dedicated Project Manager'],
                        'is_popular' => false,
                    ],
                ],
            ],
            [
                'name' => 'UI/UX Design',
                'description' => 'User-centric design for digital products.',
                'icon' => 'layout',
                'packages' => [
                    [
                        'name' => 'Basic',
                        'description' => 'Wireframes and basic layout design.',
                        'price_idr' => 3000000,
                        'price_usd' => 192,
                        'features' => ['Wireframing', 'User Flow', '5 Screens'],
                        'is_popular' => false,
                    ],
                    [
                        'name' => 'Full Design',
                        'description' => 'Complete UI design with interactive prototype.',
                        'price_idr' => 8000000,
                        'price_usd' => 512,
                        'features' => ['High-Fidelity UI', 'Interactive Prototype', 'Design System', 'Unlimited Screens'],
                        'is_popular' => true,
                    ],
                ],
            ],
            [
                'name' => 'Maintenance & Support',
                'description' => 'Keep your website running smoothly.',
                'icon' => 'settings',
                'packages' => [
                    [
                        'name' => 'Monthly Basic',
                        'description' => 'Essential maintenance and updates.',
                        'price_idr' => 2000000,
                        'price_usd' => 128,
                        'features' => ['Security Updates', 'Weekly Backups', '2 Hours Small Tasks'],
                        'is_popular' => false,
                    ],
                    [
                        'name' => 'Monthly Pro',
                        'description' => 'Comprehensive support for growing businesses.',
                        'price_idr' => 5000000,
                        'price_usd' => 320,
                        'features' => ['Priority Support', 'Daily Backups', 'Uptime Monitoring', '8 Hours Tasks'],
                        'is_popular' => true,
                    ],
                ],
            ],
        ];

        foreach ($services as $s) {
            $service = Service::create([
                'name' => $s['name'],
                'slug' => Str::slug($s['name']),
                'description' => $s['description'],
                'icon' => $s['icon'],
            ]);

            foreach ($s['packages'] as $p) {
                $service->packages()->create($p);
            }
        }
    }
}
