<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Message;
use App\Models\Project;
use App\Models\TeamMember;
use App\Models\Technology;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Get statistics and recent activity for the admin dashboard.
     */
    public function index(): JsonResponse
    {
        $stats = [
            'total_projects' => Project::count(),
            'published_projects' => Project::where('status', 'published')->count(),
            'draft_projects' => Project::where('status', 'draft')->count(),
            'total_categories' => Category::count(),
            'total_technologies' => Technology::count(),
            'total_team_members' => TeamMember::count(),
            'total_messages' => Message::count(),
            'unread_messages' => Message::where('is_read', false)->count(),
        ];

        $recentMessages = Message::latest()->take(5)->get();
        $recentProjects = Project::with(['category', 'technologies', 'teamMembers'])->latest()->take(5)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_messages' => $recentMessages,
                'recent_projects' => $recentProjects,
            ],
        ]);
    }
}
