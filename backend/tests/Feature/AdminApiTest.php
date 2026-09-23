<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@nahnu.id',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'token',
                'user' => ['id', 'name', 'email', 'role'],
            ]);
    }

    public function test_admin_login_fails_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@nahnu.id',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_unauthenticated_request_to_admin_api_is_rejected(): void
    {
        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(401);
    }

    public function test_authenticated_admin_can_access_dashboard_and_me(): void
    {
        $admin = User::where('email', 'admin@nahnu.id')->first();
        $token = $admin->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'stats' => [
                        'total_projects',
                        'published_projects',
                        'draft_projects',
                        'total_categories',
                        'total_technologies',
                        'total_team_members',
                        'total_messages',
                        'unread_messages',
                    ],
                    'recent_messages',
                    'recent_projects',
                ],
            ]);

        $meResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/admin/me');

        $meResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'user' => [
                    'email' => 'admin@nahnu.id',
                ],
            ]);
    }

    public function test_admin_can_logout_and_revoke_token(): void
    {
        $admin = User::where('email', 'admin@nahnu.id')->first();
        $token = $admin->createToken('logout_test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/admin/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_admin_can_view_and_update_profile(): void
    {
        $admin = User::where('email', 'admin@nahnu.id')->first();
        $token = $admin->createToken('profile_token')->plainTextToken;

        // View profile
        $viewRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/admin/profile');

        $viewRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'user' => [
                    'email' => 'admin@nahnu.id',
                ],
            ]);

        // Update profile
        $updateRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson('/api/admin/profile', [
                'name' => 'Super Administrator NAHNU',
                'email' => 'superadmin@nahnu.id',
            ]);

        $updateRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'user' => [
                    'name' => 'Super Administrator NAHNU',
                    'email' => 'superadmin@nahnu.id',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
            'email' => 'superadmin@nahnu.id',
        ]);
    }

    public function test_admin_update_password(): void
    {
        $admin = User::where('email', 'admin@nahnu.id')->first();
        $token = $admin->createToken('password_token')->plainTextToken;

        // Fails if current password is wrong
        $failRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson('/api/admin/profile/password', [
                'current_password' => 'wrongcurrentpassword',
                'password' => 'newpassword123',
                'password_confirmation' => 'newpassword123',
            ]);

        $failRes->assertStatus(422)
            ->assertJsonStructure(['errors' => ['current_password']]);

        // Succeeds with valid current password and confirmed new password
        $successRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson('/api/admin/profile/password', [
                'current_password' => 'password',
                'password' => 'newpassword123',
                'password_confirmation' => 'newpassword123',
            ]);

        $successRes->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }
}
