<?php

namespace Database\Seeders;

use App\Models\ForumThread;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ForumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $categories = ['general', 'technical', 'price', 'recommendation', 'other'];

        $threads = [
            [
                'title' => 'How to choose the right tech stack for my startup?',
                'body' => 'I am planning to build a new SaaS product but I am confused between Laravel and Node.js. Any suggestions?',
                'category' => 'technical',
                'replies' => [
                    'Laravel is great for rapid development and has a huge ecosystem. If you need speed of development, go for it.',
                    'Node.js is better if you have a lot of real-time requirements. Both are good choices!',
                ],
            ],
            [
                'title' => 'Average price for a professional landing page in 2026?',
                'body' => 'I am looking for a freelancer to build a high-converting landing page. What is the reasonable price range nowadays?',
                'category' => 'price',
                'replies' => [
                    'Usually ranges from 5jt to 15jt depending on the complexity and design requirements.',
                    'Don\'t forget to check their portfolio first!',
                ],
            ],
            [
                'title' => 'Best UI/UX practices for dashboard design',
                'body' => 'I want to improve my admin dashboard. What are the key things to consider?',
                'category' => 'recommendation',
                'replies' => [
                    'Keep it clean. Use white space effectively.',
                    'Information hierarchy is key. Make sure the most important data stands out.',
                ],
            ],
            [
                'title' => 'General discussion about freelance market in Indonesia',
                'body' => 'How is everyone doing? The market seems to be growing fast!',
                'category' => 'general',
                'replies' => [
                    'Yes, more businesses are going digital now.',
                ],
            ],
            [
                'title' => 'Troubleshooting Laravel 12 Vite integration',
                'body' => 'Has anyone encountered issues with the new Vite 6 in Laravel 12? My HMR is acting weird.',
                'category' => 'technical',
                'replies' => [
                    'Check your vite.config.js. There were some breaking changes in V6.',
                    'Try clearing your browser cache and restarting the dev server.',
                ],
            ],
        ];

        foreach ($threads as $t) {
            $thread = ForumThread::create([
                'user_id' => $users->random()->id,
                'title' => $t['title'],
                'slug' => Str::slug($t['title']),
                'body' => $t['body'],
                'category' => $t['category'],
                'replies_count' => count($t['replies']),
            ]);

            foreach ($t['replies'] as $r) {
                $thread->replies()->create([
                    'user_id' => $users->random()->id,
                    'body' => $r,
                ]);
            }
        }
    }
}
