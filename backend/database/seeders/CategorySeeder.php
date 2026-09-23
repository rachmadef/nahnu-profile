<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Website Terpublikasi', 'slug' => 'website-terpublikasi'],
            ['name' => 'Website Sekali Pakai / Lokal', 'slug' => 'website-sekali-pakai-lokal'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                ['name' => $category['name']]
            );
        }

        // Clean up any old non-website categories
        Category::whereNotIn('slug', array_column($categories, 'slug'))->delete();
    }
}
