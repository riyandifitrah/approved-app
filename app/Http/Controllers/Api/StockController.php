<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stock;

class StockController extends Controller
{
    public function indexStock()
    {
        $stocks = Stock::with(['transactions', 'createdByUser', 'updatedByUser'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stocks
        ]);
    }

    public function showStock($id)
    {
        $stock = Stock::with(['transactions', 'createdByUser', 'updatedByUser'])
            ->find($id);

        if (!$stock) {
            return response()->json([
                'success' => false,
                'message' => 'Stock tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $stock
        ]);
    }
}
