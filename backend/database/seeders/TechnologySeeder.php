<?php

namespace Database\Seeders;

use App\Models\Technology;
use Illuminate\Database\Seeder;

class TechnologySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $technologies = [
            ['name' => 'Laravel', 'slug' => 'laravel', 'icon' => 'devicon-laravel-plain colored'],
            ['name' => 'Tailwind CSS', 'slug' => 'tailwind-css', 'icon' => 'devicon-tailwindcss-original colored'],
            ['name' => 'JavaScript', 'slug' => 'javascript', 'icon' => 'devicon-javascript-plain colored'],
            ['name' => 'MySQL', 'slug' => 'mysql', 'icon' => 'devicon-mysql-plain colored'],
            ['name' => 'Vite', 'slug' => 'vite', 'icon' => 'devicon-vite-original colored'],
            ['name' => 'Vue.js', 'slug' => 'vue-js', 'icon' => 'devicon-vuejs-plain colored'],
            ['name' => 'Flutter', 'slug' => 'flutter', 'icon' => 'devicon-flutter-plain colored'],
            ['name' => 'Docker', 'slug' => 'docker', 'icon' => 'devicon-docker-plain colored'],
            ['name' => 'Figma', 'slug' => 'figma', 'icon' => 'devicon-figma-plain colored'],
        ];

        foreach ($technologies as $tech) {
            Technology::updateOrCreate(
                ['slug' => $tech['slug']],
                $tech
            );
        }
    }
}
