<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Message;
use App\Models\Project;
use App\Models\TeamMember;
use App\Models\Technology;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCrudApiTest extends TestCase
{
    use RefreshDatabase;

    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->seed(\Database\Seeders\TeamMemberSeeder::class);
        $this->seed(\Database\Seeders\ProjectSeeder::class);

        $admin = User::where('email', 'admin@nahnu.id')->first();
        $this->token = $admin->createToken('admin_test_token')->plainTextToken;
    }

    public function test_can_crud_category(): void
    {
        // CREATE
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/admin/categories', [
                'name' => 'Cyber Security',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Cyber Security',
                    'slug' => 'cyber-security',
                ],
            ]);

        $categoryId = $response->json('data.id');

        // UPDATE
        $updateResponse = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/admin/categories/{$categoryId}", [
                'name' => 'Information & Cyber Security',
            ]);

        $updateResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Information & Cyber Security',
                ],
            ]);

        // DELETE
        $deleteResponse = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/admin/categories/{$categoryId}");

        $deleteResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('categories', ['id' => $categoryId]);
    }

    public function test_can_crud_technology(): void
    {
        // CREATE
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/admin/technologies', [
                'name' => 'Next.js',
                'icon' => 'devicon-nextjs-plain',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Next.js',
                    'slug' => 'nextjs',
                ],
            ]);

        $techId = $response->json('data.id');

        // DELETE
        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/admin/technologies/{$techId}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('technologies', ['id' => $techId]);
    }

    public function test_can_crud_project_with_html_sanitizer(): void
    {
        $category = Category::first();
        $tech = Technology::first();
        $member = TeamMember::first();

        // CREATE with XSS script injection to verify sanitization
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/admin/projects', [
                'category_id' => $category->id,
                'title' => 'Project Alpha Test',
                'short_description' => 'A test project',
                'description' => '<p>Safe description</p><script>alert("xss")</script><a href="javascript:alert(1)">bad link</a>',
                'status' => 'published',
                'technology_ids' => [$tech->id],
                'team_member_ids' => [$member->id],
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'title' => 'Project Alpha Test',
                    'slug' => 'project-alpha-test',
                ],
            ]);

        // Verify script is stripped and javascript: is sanitized
        $project = Project::where('slug', 'project-alpha-test')->first();
        $this->assertStringNotContainsString('<script>', $project->description);
        $this->assertStringNotContainsString('javascript:', $project->description);
        $this->assertStringContainsString('Safe description', $project->description);

        // DELETE
        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/admin/projects/{$project->id}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_can_manage_messages(): void
    {
        $msg = Message::create([
            'name' => 'Alice',
            'email' => 'alice@example.com',
            'subject' => 'Project Inquiry',
            'message' => 'Hello team!',
            'is_read' => false,
        ]);

        // Toggle read
        $toggleResponse = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->patchJson("/api/admin/messages/{$msg->id}/toggle-read");

        $toggleResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['is_read' => true],
            ]);

        // Delete message
        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/admin/messages/{$msg->id}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('messages', ['id' => $msg->id]);
    }
}
