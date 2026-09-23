<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TeamMemberController extends Controller
{
    /**
     * Display a listing of team members.
     */
    public function index(): JsonResponse
    {
        $members = TeamMember::withCount('projects')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $members,
        ]);
    }

    /**
     * Store a newly created team member.
     */
    public function store(Request $request): JsonResponse
    {
        // Normalize URLs
        $data = $request->all();
        foreach (['github_url', 'linkedin_url', 'instagram_url'] as $urlField) {
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
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:team_members,slug'],
            'role' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:10240'],
            'skills' => ['nullable'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
        ], [
            'name.required' => 'Nama lengkap developer wajib diisi.',
            'name.max' => 'Nama lengkap maksimal 255 karakter.',
            'slug.unique' => 'Slug sudah digunakan oleh anggota tim lain.',
            'role.required' => 'Role / posisi developer wajib diisi.',
            'photo.image' => 'File yang diunggah harus berupa gambar.',
            'photo.mimes' => 'Format foto harus berupa jpeg, png, jpg, atau webp.',
            'photo.max' => 'Ukuran foto tidak boleh lebih dari 10 MB.',
            'github_url.url' => 'Format GitHub URL tidak valid.',
            'linkedin_url.url' => 'Format LinkedIn URL tidak valid.',
            'instagram_url.url' => 'Format Instagram URL tidak valid.',
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

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('team', 'public');
        }

        $skills = $request->input('skills');
        if (is_string($skills)) {
            $decoded = json_decode($skills, true);
            $skills = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode(',', $skills)));
        }

        $member = TeamMember::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'role' => $validated['role'],
            'bio' => $validated['bio'] ?? null,
            'photo' => $photoPath ? Storage::url($photoPath) : null,
            'skills' => $skills,
            'github_url' => $validated['github_url'] ?? null,
            'linkedin_url' => $validated['linkedin_url'] ?? null,
            'instagram_url' => $validated['instagram_url'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Anggota tim berhasil ditambahkan.',
            'data' => $member,
        ], 201);
    }

    /**
     * Display the specified team member.
     */
    public function show(int $id): JsonResponse
    {
        $member = TeamMember::with('projects')->find($id);

        if (! $member) {
            return response()->json([
                'success' => false,
                'message' => 'Anggota tim tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $member,
        ]);
    }

    /**
     * Update the specified team member.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $member = TeamMember::find($id);

        if (! $member) {
            return response()->json([
                'success' => false,
                'message' => 'Anggota tim tidak ditemukan.',
            ], 404);
        }

        // Normalize URLs
        $data = $request->all();
        foreach (['github_url', 'linkedin_url', 'instagram_url'] as $urlField) {
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
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:team_members,slug,'.$member->id],
            'role' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:10240'],
            'skills' => ['nullable'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
        ], [
            'name.required' => 'Nama lengkap developer wajib diisi.',
            'name.max' => 'Nama lengkap maksimal 255 karakter.',
            'slug.unique' => 'Slug sudah digunakan oleh anggota tim lain.',
            'role.required' => 'Role / posisi developer wajib diisi.',
            'photo.image' => 'File yang diunggah harus berupa gambar.',
            'photo.mimes' => 'Format foto harus berupa jpeg, png, jpg, atau webp.',
            'photo.max' => 'Ukuran foto tidak boleh lebih dari 10 MB.',
            'github_url.url' => 'Format GitHub URL tidak valid.',
            'linkedin_url.url' => 'Format LinkedIn URL tidak valid.',
            'instagram_url.url' => 'Format Instagram URL tidak valid.',
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

        $photoUrl = $member->photo;
        if ($request->hasFile('photo')) {
            if ($member->photo) {
                $oldPath = str_replace(Storage::url(''), '', $member->photo);
                Storage::disk('public')->delete($oldPath);
            }
            $photoPath = $request->file('photo')->store('team', 'public');
            $photoUrl = Storage::url($photoPath);
        }

        $skills = $request->input('skills');
        if (is_string($skills)) {
            $decoded = json_decode($skills, true);
            $skills = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode(',', $skills)));
        }

        $member->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'role' => $validated['role'],
            'bio' => $validated['bio'] ?? null,
            'photo' => $photoUrl,
            'skills' => $skills,
            'github_url' => $validated['github_url'] ?? null,
            'linkedin_url' => $validated['linkedin_url'] ?? null,
            'instagram_url' => $validated['instagram_url'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Anggota tim berhasil diperbarui.',
            'data' => $member,
        ]);
    }

    /**
     * Remove the specified team member.
     */
    public function destroy(int $id): JsonResponse
    {
        $member = TeamMember::find($id);

        if (! $member) {
            return response()->json([
                'success' => false,
                'message' => 'Anggota tim tidak ditemukan.',
            ], 404);
        }

        if ($member->photo) {
            $oldPath = str_replace(Storage::url(''), '', $member->photo);
            Storage::disk('public')->delete($oldPath);
        }

        $member->delete();

        return response()->json([
            'success' => true,
            'message' => 'Anggota tim berhasil dihapus.',
        ]);
    }
}
