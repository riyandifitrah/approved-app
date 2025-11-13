<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Approval;
use Illuminate\Http\Request;

class ApprovalController extends Controller
{
    public function indexApprovedMasuk()
    {
        $data = Approval::with(['transaction', 'user'])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
    public function deletApprovedMasuk(Request $request)
    {
        $ids = $request->ids;
        $deleted = Approval::whereIn('id', $ids)->delete();

        return response()->json([
            'success' => true,
            'message' => "$deleted notifikasi berhasil dihapus"
        ]);
    }
}
