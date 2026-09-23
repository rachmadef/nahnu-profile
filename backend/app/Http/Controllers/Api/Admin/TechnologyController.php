<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Technology;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TechnologyController extends Controller
{
    /**
     * Display a listing of technologies.
     */
    public function index(): JsonResponse
    {
        $technologies = Technology::withCount('projects')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $technologies,
        ]);
    }

    /**
     * Store a newly created technology.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:technologies,slug'],
            'icon' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $slug = ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);

        $technology = Technology::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'icon' => $validated['icon'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Teknologi berhasil ditambahkan.',
            'data' => $technology,
        ], 201);
    }

    /**
     * Display the specified technology.
     */
    public function show(int $id): JsonResponse
    {
        $technology = Technology::withCount('projects')->find($id);

        if (! $technology) {
            return response()->json([
                'success' => false,
                'message' => 'Teknologi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $technology,
        ]);
    }

    /**
     * Update the specified technology.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $technology = Technology::find($id);

        if (! $technology) {
            return response()->json([
                'success' => false,
                'message' => 'Teknologi tidak ditemukan.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:technologies,slug,'.$technology->id],
            'icon' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $slug = ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);

        $technology->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'icon' => $validated['icon'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Teknologi berhasil diperbarui.',
            'data' => $technology,
        ]);
    }

    /**
     * Remove the specified technology.
     */
    public function destroy(int $id): JsonResponse
    {
        $technology = Technology::find($id);

        if (! $technology) {
            return response()->json([
                'success' => false,
                'message' => 'Teknologi tidak ditemukan.',
            ], 404);
        }

        $technology->delete();

        return response()->json([
            'success' => true,
            'message' => 'Teknologi berhasil dihapus.',
        ]);
    }
}
