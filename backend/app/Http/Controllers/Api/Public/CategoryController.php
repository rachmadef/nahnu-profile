<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount(['projects' => function ($query) {
            $query->published();
        }])->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
