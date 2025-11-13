<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function currentUser(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'role' => $user->role,
        ]);
    }
}
