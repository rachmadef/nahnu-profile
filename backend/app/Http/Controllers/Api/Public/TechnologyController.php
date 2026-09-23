<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Technology;
use Illuminate\Http\JsonResponse;

class TechnologyController extends Controller
{
    /**
     * Display a listing of technologies.
     */
    public function index(): JsonResponse
    {
        $technologies = Technology::withCount(['projects' => function ($query) {
            $query->published();
        }])->get();

        return response()->json([
            'success' => true,
            'data' => $technologies,
        ]);
    }
}
