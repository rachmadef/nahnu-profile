<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Project;
use App\Models\TeamMember;
use App\Models\Technology;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $publishedCat = Category::where('slug', 'website-terpublikasi')->first();
        $localCat = Category::where('slug', 'website-sekali-pakai-lokal')->first();

        $laravel = Technology::where('slug', 'laravel')->first();
        $tailwind = Technology::where('slug', 'tailwind-css')->first();
        $js = Technology::where('slug', 'javascript')->first();
        $mysql = Technology::where('slug', 'mysql')->first();
        $vite = Technology::where('slug', 'vite')->first();
        $figma = Technology::where('slug', 'figma')->first();

        $fauzi = TeamMember::where('slug', 'ahmad-fauzi')->first();
        $rian = TeamMember::where('slug', 'rian-pratama')->first();
        $dimas = TeamMember::where('slug', 'dimas-saputra')->first();

        // Project 1: NAHNU Collective Space (Website Terpublikasi)
        $project1 = Project::updateOrCreate(
            ['slug' => 'nahnu-portfolio-platform'],
            [
                'category_id' => $publishedCat?->id,
                'title' => 'NAHNU — Digital Collective Space',
                'short_description' => 'Platform portfolio kolaboratif 3 developer dengan headless frontend Vite + Tailwind CSS 4 dan REST API Laravel 13.',
                'description' => '<p><strong>NAHNU</strong> adalah wadah digital terpadu untuk menampilkan keahlian, teknologi, dan portfolio kolaboratif dari tiga pengembang perangkat lunak.</p><p>Dibangun menggunakan pemisahan arsitektur modern antara frontend independen dan backend RESTful API yang aman dengan Laravel 13 dan Sanctum.</p>',
                'cover' => null,
                'demo_url' => 'https://nahnu.id',
                'repository_url' => 'https://github.com/nahnu-dev/nahnu-profile',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        if ($project1 && $laravel && $tailwind && $js && $vite && $mysql) {
            $project1->technologies()->sync([
                $laravel->id,
                $tailwind->id,
                $js->id,
                $vite->id,
                $mysql->id,
            ]);
        }

        if ($project1 && $fauzi && $rian && $dimas) {
            $project1->teamMembers()->sync([
                $fauzi->id,
                $rian->id,
                $dimas->id,
            ]);
        }

        // Project 2: EventPass Scanner (Website Sekali Pakai / Lokal)
        $project2 = Project::updateOrCreate(
            ['slug' => 'eventpass-offline-scanner'],
            [
                'category_id' => $localCat?->id,
                'title' => 'EventPass — Single-Event Scanner & Visitor Check-in',
                'short_description' => 'Sistem website sekali pakai berbasis LAN/intranet untuk registrasi dan pemindaian QR tiket pengunjung pameran secara offline tanpa koneksi internet publik.',
                'description' => '<p>EventPass dirancang khusus sebagai sistem website sekali pakai (*single-event deployment*) yang dioperasikan pada server lokal saat acara pameran dan konferensi teknologi.</p><p>Memungkinkan puluhan petugas gerbang memindai kode QR tiket secara instan dengan sinkronisasi basis data lokal yang cepat dan toleran terhadap ketiadaan koneksi internet luar.</p>',
                'cover' => null,
                'demo_url' => 'http://localhost:8080 (Local Network / Intranet)',
                'repository_url' => 'https://github.com/nahnu-dev/eventpass-offline',
                'status' => 'published',
                'published_at' => now()->subDays(3),
            ]
        );

        if ($project2 && $laravel && $tailwind && $js && $mysql) {
            $project2->technologies()->sync([
                $laravel->id,
                $tailwind->id,
                $js->id,
                $mysql->id,
            ]);
        }

        if ($project2 && $dimas && $fauzi) {
            $project2->teamMembers()->sync([
                $dimas->id,
                $fauzi->id,
            ]);
        }

        // Project 3: SimLab Inventory (Website Sekali Pakai / Lokal)
        $project3 = Project::updateOrCreate(
            ['slug' => 'simlab-local-inventory'],
            [
                'category_id' => $localCat?->id,
                'title' => 'SimLab — Web Manajemen Alat & Inventaris Lab Komputer',
                'short_description' => 'Website internal yang beroperasi pada server lokal kampus untuk peminjaman alat praktik, logging perangkat, dan monitoring pemeliharaan lab.',
                'description' => '<p>SimLab adalah sistem web operasional internal kampus yang berjalan di lingkungan server lokal (*on-premises*). Digunakan oleh asisten laboratorium untuk mendata inventaris komponen hardware, penjadwalan peminjaman, serta logbook pemakaian workstation harian.</p>',
                'cover' => null,
                'demo_url' => 'http://localhost:3000 (Local Environment)',
                'repository_url' => 'https://github.com/nahnu-dev/simlab-local',
                'status' => 'published',
                'published_at' => now()->subDays(7),
            ]
        );

        if ($project3 && $laravel && $tailwind && $js && $mysql) {
            $project3->technologies()->sync([
                $laravel->id,
                $tailwind->id,
                $js->id,
                $mysql->id,
            ]);
        }

        if ($project3 && $dimas && $rian) {
            $project3->teamMembers()->sync([
                $dimas->id,
                $rian->id,
            ]);
        }

        // Project 4: Zenith Studio Showcase (Website Terpublikasi)
        $project4 = Project::updateOrCreate(
            ['slug' => 'zenith-interactive-showcase'],
            [
                'category_id' => $publishedCat?->id,
                'title' => 'Zenith Studio — Creative Web Showcase & Portal',
                'short_description' => 'Website interaktif modern untuk agensi kreatif dengan storytelling visual dinamis, animasi micro-interactions, dan arsitektur aksesibilitas tinggi.',
                'description' => '<p>Zenith Studio adalah website profil agensi interaktif kelas premium yang menggabungkan estetika modern, micro-animations, dan performa tinggi dengan skor PageSpeed optimal.</p>',
                'cover' => null,
                'demo_url' => 'https://zenith.example.com',
                'repository_url' => 'https://github.com/nahnu-dev/zenith-showcase',
                'status' => 'published',
                'published_at' => now()->subDays(12),
            ]
        );

        if ($project4 && $figma && $tailwind && $js && $vite) {
            $project4->technologies()->sync([
                $figma->id,
                $tailwind->id,
                $js->id,
                $vite->id,
            ]);
        }

        if ($project4 && $rian && $fauzi) {
            $project4->teamMembers()->sync([
                $rian->id,
                $fauzi->id,
            ]);
        }

        // Clean up obsolete seed projects if they exist
        Project::whereIn('slug', ['finflow-smart-finance-tracker', 'zenith-saas-design-system'])->delete();
    }
}
