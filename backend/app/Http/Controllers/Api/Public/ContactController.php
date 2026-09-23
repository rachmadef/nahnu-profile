<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Store a newly created contact message.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $message = Message::create([
            'name' => strip_tags($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'subject' => strip_tags($validated['subject']),
            'message' => strip_tags($validated['message']),
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih, pesan Anda telah berhasil dikirim ke tim NAHNU.',
            'data' => $message,
        ], 201);
    }
}
