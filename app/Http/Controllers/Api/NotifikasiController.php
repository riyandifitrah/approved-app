<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notifikasi;

class NotifikasiController extends Controller
{
    public function indexNotifMasuk()
    {
        $data = Notifikasi::with('transaction')
            ->whereHas('transaction', function ($q) {
                $q->where('tipe', 'masuk');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function deletNotifMasuk(Request $request)
    {
        $ids = $request->ids;
        $deleted = Notifikasi::whereIn('id', $ids)->delete();

        return response()->json([
            'success' => true,
            'message' => "$deleted notifikasi berhasil dihapus"
        ]);
    }


    public function indexNotifKeluar()
    {
        $data = Notifikasi::with('transaction')
            ->whereHas('transaction', function ($q) {
                $q->where('tipe', 'keluar');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function deletNotifKeluar()
    {
        $deleted = Notifikasi::whereHas('transaction', function ($q) {
            $q->where('tipe', 'keluar');
        })->delete();

        return response()->json([
            'success' => true,
            'message' => "$deleted notifikasi berhasil dihapus"
        ]);
    }
}
