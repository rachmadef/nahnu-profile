<?php

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\MessageController as AdminMessageController;
use App\Http\Controllers\Api\Admin\ProfileController;
use App\Http\Controllers\Api\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Api\Admin\TeamMemberController as AdminTeamMemberController;
use App\Http\Controllers\Api\Admin\TechnologyController as AdminTechnologyController;
use App\Http\Controllers\Api\Public\CategoryController;
use App\Http\Controllers\Api\Public\ContactController;
use App\Http\Controllers\Api\Public\ProjectController;
use App\Http\Controllers\Api\Public\TeamMemberController;
use App\Http\Controllers\Api\Public\TechnologyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::prefix('projects')->group(function () {
    Route::get('/', [ProjectController::class, 'index']);
    Route::get('/{slug}', [ProjectController::class, 'show']);
});

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/technologies', [TechnologyController::class, 'index']);
Route::get('/team-members', [TeamMemberController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:10,1');

/*
|--------------------------------------------------------------------------
| Admin Auth Routes (Public login)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    /*
    |--------------------------------------------------------------------------
    | Protected Admin Routes (auth:sanctum)
    |--------------------------------------------------------------------------
    */
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Admin Profile Management
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

        // Projects
        Route::apiResource('projects', AdminProjectController::class);
        Route::post('projects/{id}', [AdminProjectController::class, 'update']); // for multipart file updates

        // Categories
        Route::apiResource('categories', AdminCategoryController::class);

        // Technologies
        Route::apiResource('technologies', AdminTechnologyController::class);

        // Team Members
        Route::apiResource('team-members', AdminTeamMemberController::class);
        Route::post('team-members/{id}', [AdminTeamMemberController::class, 'update']); // for multipart file updates

        // Messages
        Route::get('/messages', [AdminMessageController::class, 'index']);
        Route::get('/messages/{id}', [AdminMessageController::class, 'show']);
        Route::patch('/messages/{id}/toggle-read', [AdminMessageController::class, 'toggleRead']);
        Route::delete('/messages/{id}', [AdminMessageController::class, 'destroy']);
    });
});
