<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\HtmlSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Project::with(['category', 'technologies', 'teamMembers'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->query('per_page', 15);
        $projects = $perPage > 0 ? $query->paginate($perPage) : $query->get();

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // Normalize URLs
        $data = $request->all();
        foreach (['demo_url', 'repository_url'] as $urlField) {
            if (! empty($data[$urlField])) {
                $val = trim($data[$urlField]);
                if ($val === 'http://' || $val === 'https://' || $val === '') {
                    $data[$urlField] = null;
                } elseif (! preg_match('~^(?:f|ht)tps?://~i', $val)) {
                    $data[$urlField] = 'https://'.$val;
                } else {
                    $data[$urlField] = $val;
                }
            } else {
                $data[$urlField] = null;
            }
        }

        $validator = Validator::make($data, [
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:projects,slug'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'cover' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:10240'],
            'demo_url' => ['nullable', 'url', 'max:255'],
            'repository_url' => ['nullable', 'url', 'max:255'],
            'status' => ['required', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
            'technology_ids' => ['nullable', 'array'],
            'technology_ids.*' => ['exists:technologies,id'],
            'team_member_ids' => ['nullable', 'array'],
            'team_member_ids.*' => ['exists:team_members,id'],
        ], [
            'title.required' => 'Judul project wajib diisi.',
            'slug.unique' => 'Slug sudah digunakan oleh project lain.',
            'cover.image' => 'File sampul harus berupa gambar.',
            'cover.mimes' => 'Format file sampul harus jpeg, png, jpg, atau webp.',
            'cover.max' => 'Ukuran file sampul tidak boleh lebih dari 10 MB.',
            'demo_url.url' => 'Format Demo URL tidak valid.',
            'repository_url.url' => 'Format Repository URL tidak valid.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        // Auto-generate slug if empty
        $slug = ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['title']);
        $originalSlug = $slug;
        $counter = 1;
        while (Project::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        // Handle cover image upload
        $coverPath = null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('projects', 'public');
        }

        $project = Project::create([
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $slug,
            'short_description' => $validated['short_description'] ?? null,
            'description' => HtmlSanitizer::clean($validated['description'] ?? null),
            'cover' => $coverPath ? Storage::url($coverPath) : null,
            'demo_url' => $validated['demo_url'] ?? null,
            'repository_url' => $validated['repository_url'] ?? null,
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' ? ($validated['published_at'] ?? now()) : null,
        ]);

        if (! empty($validated['technology_ids'])) {
            $project->technologies()->sync($validated['technology_ids']);
        }

        if (! empty($validated['team_member_ids'])) {
            $project->teamMembers()->sync($validated['team_member_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project berhasil ditambahkan.',
            'data' => $project->load(['category', 'technologies', 'teamMembers']),
        ], 201);
    }

    /**
     * Display the specified project.
     */
    public function show(int $id): JsonResponse
    {
        $project = Project::with(['category', 'technologies', 'teamMembers'])->find($id);

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

    /**
     * Update the specified project in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $project = Project::find($id);

        if (! $project) {
            return response()->json([
                'success' => false,
                'message' => 'Project tidak ditemukan.',
            ], 404);
        }

        // Normalize URLs
        $data = $request->all();
        foreach (['demo_url', 'repository_url'] as $urlField) {
            if (! empty($data[$urlField])) {
                $val = trim($data[$urlField]);
                if ($val === 'http://' || $val === 'https://' || $val === '') {
                    $data[$urlField] = null;
                } elseif (! preg_match('~^(?:f|ht)tps?://~i', $val)) {
                    $data[$urlField] = 'https://'.$val;
                } else {
                    $data[$urlField] = $val;
                }
            } else {
                $data[$urlField] = null;
            }
        }

        $validator = Validator::make($data, [
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:projects,slug,'.$project->id],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'cover' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:10240'],
            'demo_url' => ['nullable', 'url', 'max:255'],
            'repository_url' => ['nullable', 'url', 'max:255'],
            'status' => ['required', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
            'technology_ids' => ['nullable', 'array'],
            'technology_ids.*' => ['exists:technologies,id'],
            'team_member_ids' => ['nullable', 'array'],
            'team_member_ids.*' => ['exists:team_members,id'],
        ], [
            'title.required' => 'Judul project wajib diisi.',
            'slug.unique' => 'Slug sudah digunakan oleh project lain.',
            'cover.image' => 'File sampul harus berupa gambar.',
            'cover.mimes' => 'Format file sampul harus jpeg, png, jpg, atau webp.',
            'cover.max' => 'Ukuran file sampul tidak boleh lebih dari 10 MB.',
            'demo_url.url' => 'Format Demo URL tidak valid.',
            'repository_url.url' => 'Format Repository URL tidak valid.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $slug = ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['title']);

        // Handle cover update
        $coverUrl = $project->cover;
        if ($request->hasFile('cover')) {
            if ($project->cover) {
                $oldPath = str_replace(Storage::url(''), '', $project->cover);
                Storage::disk('public')->delete($oldPath);
            }
            $coverPath = $request->file('cover')->store('projects', 'public');
            $coverUrl = Storage::url($coverPath);
        }

        $project->update([
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $slug,
            'short_description' => $validated['short_description'] ?? null,
            'description' => HtmlSanitizer::clean($validated['description'] ?? null),
            'cover' => $coverUrl,
            'demo_url' => $validated['demo_url'] ?? null,
            'repository_url' => $validated['repository_url'] ?? null,
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' ? ($validated['published_at'] ?? $project->published_at ?? now()) : null,
        ]);

        if (isset($validated['technology_ids'])) {
            $project->technologies()->sync($validated['technology_ids']);
        }

        if (isset($validated['team_member_ids'])) {
            $project->teamMembers()->sync($validated['team_member_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project berhasil diperbarui.',
            'data' => $project->load(['category', 'technologies', 'teamMembers']),
        ]);
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $project = Project::find($id);

        if (! $project) {
            return response()->json([
                'success' => false,
                'message' => 'Project tidak ditemukan.',
            ], 404);
        }

        if ($project->cover) {
            $oldPath = str_replace(Storage::url(''), '', $project->cover);
            Storage::disk('public')->delete($oldPath);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project berhasil dihapus.',
        ]);
    }
}
