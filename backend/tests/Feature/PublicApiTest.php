<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->seed(\Database\Seeders\TeamMemberSeeder::class);
        $this->seed(\Database\Seeders\ProjectSeeder::class);
    }

    public function test_can_get_public_projects(): void
    {
        $response = $this->getJson('/api/projects');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data',
                ],
            ]);
    }

    public function test_can_get_single_project_by_slug(): void
    {
        $response = $this->getJson('/api/projects/nahnu-portfolio-platform');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'slug' => 'nahnu-portfolio-platform',
                ],
            ]);
    }

    public function test_returns_404_for_non_existent_project(): void
    {
        $response = $this->getJson('/api/projects/project-tidak-ada');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_can_get_categories(): void
    {
        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
            ]);
    }

    public function test_can_get_technologies(): void
    {
        $response = $this->getJson('/api/technologies');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
            ]);
    }

    public function test_can_get_team_members(): void
    {
        $response = $this->getJson('/api/team-members');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
            ]);
    }

    public function test_can_submit_contact_form(): void
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'subject' => 'Kerjasama Proyek',
            'message' => 'Halo tim NAHNU, kami tertarik untuk berdiskusi proyek pengembangan aplikasi web.',
        ];

        $response = $this->postJson('/api/contact', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('messages', [
            'email' => 'johndoe@example.com',
            'subject' => 'Kerjasama Proyek',
        ]);
    }
}
