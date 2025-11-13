<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Stock;
use App\Models\Notifikasi;

class DashboardController extends Controller
{
    public function index()
    {
        $masukCount = Transaction::where('tipe', 'masuk')->count();
        $keluarCount = Transaction::where('tipe', 'keluar')->count();
        $totalStock = Stock::sum('stok'); 
        $notifikasiCount = Notifikasi::count();
        return response()->json([
            'success' => true,
            'data' => [
                'masuk' => $masukCount,
                'keluar' => $keluarCount,
                'stock' => $totalStock,
                'notifikasi' => $notifikasiCount,
            ]
        ]);
    }
}
