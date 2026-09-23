<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display a listing of messages.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Message::latest();

        if ($request->has('is_read')) {
            $isRead = filter_var($request->query('is_read'), FILTER_VALIDATE_BOOLEAN);
            $query->where('is_read', $isRead);
        }

        $perPage = (int) $request->query('per_page', 20);
        $messages = $perPage > 0 ? $query->paginate($perPage) : $query->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    /**
     * Display the specified message and mark as read.
     */
    public function show(int $id): JsonResponse
    {
        $message = Message::find($id);

        if (! $message) {
            return response()->json([
                'success' => false,
                'message' => 'Pesan tidak ditemukan.',
            ], 404);
        }

        if (! $message->is_read) {
            $message->update(['is_read' => true]);
        }

        return response()->json([
            'success' => true,
            'data' => $message,
        ]);
    }

    /**
     * Toggle read status of a message.
     */
    public function toggleRead(int $id): JsonResponse
    {
        $message = Message::find($id);

        if (! $message) {
            return response()->json([
                'success' => false,
                'message' => 'Pesan tidak ditemukan.',
            ], 404);
        }

        $message->update(['is_read' => ! $message->is_read]);

        return response()->json([
            'success' => true,
            'message' => 'Status pesan berhasil diperbarui.',
            'data' => $message,
        ]);
    }

    /**
     * Remove the specified message.
     */
    public function destroy(int $id): JsonResponse
    {
        $message = Message::find($id);

        if (! $message) {
            return response()->json([
                'success' => false,
                'message' => 'Pesan tidak ditemukan.',
            ], 404);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil dihapus.',
        ]);
    }
}
