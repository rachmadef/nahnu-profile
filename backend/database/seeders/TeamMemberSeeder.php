<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $members = [
            [
                'name' => 'Ahmad Fauzi',
                'slug' => 'ahmad-fauzi',
                'role' => 'Lead Backend Web Engineer',
                'bio' => 'Spesialis arsitektur backend website, RESTful API Laravel, optimasi database MySQL skala besar, dan deployment server web.',
                'photo' => null,
                'skills' => ['Laravel', 'PHP', 'MySQL', 'Docker', 'REST API', 'Redis'],
                'github_url' => 'https://github.com',
                'linkedin_url' => 'https://linkedin.com',
                'instagram_url' => 'https://instagram.com',
            ],
            [
                'name' => 'Rian Pratama',
                'slug' => 'rian-pratama',
                'role' => 'Lead Frontend Web Architect',
                'bio' => 'Berfokus pada rekayasa frontend website interaktif berkinerja tinggi, Tailwind CSS, animasi UI/UX modern, dan desain web adaptif.',
                'photo' => null,
                'skills' => ['Tailwind CSS', 'JavaScript', 'Vite', 'Vue.js', 'Figma', 'Web UX'],
                'github_url' => 'https://github.com',
                'linkedin_url' => 'https://linkedin.com',
                'instagram_url' => 'https://instagram.com',
            ],
            [
                'name' => 'Dimas Saputra',
                'slug' => 'dimas-saputra',
                'role' => 'Full Stack & Local Web Engineer',
                'bio' => 'Spesialis perancangan website terintegrasi, arsitektur website sekali pakai (single-event), serta implementasi web server lokal/intranet.',
                'photo' => null,
                'skills' => ['Laravel', 'JavaScript', 'Vue.js', 'MySQL', 'Intranet Systems', 'Git'],
                'github_url' => 'https://github.com',
                'linkedin_url' => 'https://linkedin.com',
                'instagram_url' => 'https://instagram.com',
            ],
        ];

        foreach ($members as $member) {
            TeamMember::updateOrCreate(
                ['slug' => $member['slug']],
                $member
            );
        }
    }
}
