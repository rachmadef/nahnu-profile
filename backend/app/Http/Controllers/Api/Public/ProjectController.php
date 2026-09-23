<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of published projects.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Project::query()
            ->published()
            ->with(['category', 'technologies', 'teamMembers'])
            ->latest('published_at');

        // Filter by category slug
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->query('category'));
            });
        }

        // Filter by technology slug
        if ($request->filled('technology')) {
            $query->whereHas('technologies', function ($q) use ($request) {
                $q->where('slug', $request->query('technology'));
            });
        }

        // Search in title, short_description
        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->query('per_page', 12);
        $projects = $perPage > 0 ? $query->paginate($perPage) : $query->get();

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    /**
     * Display the specified project by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $project = Project::query()
            ->published()
            ->with(['category', 'technologies', 'teamMembers'])
            ->where('slug', $slug)
            ->first();

        if (! $project) {
            return response()->json([
                'success' => false,
                'message' => 'Project tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $project,
        ]);
    }
}
