<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;

class TeamMemberController extends Controller
{
    /**
     * Display a listing of team members.
     */
    public function index(): JsonResponse
    {
        $members = TeamMember::withCount(['projects' => function ($query) {
            $query->published();
        }])->get();

        return response()->json([
            'success' => true,
            'data' => $members,
        ]);
    }
}
