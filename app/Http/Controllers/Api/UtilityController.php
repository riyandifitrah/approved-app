<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction as Tr;
use App\Models\Stock as St;

class UtilityController extends Controller
{
    const TYPE_MASUK  = '01';
    const TYPE_KELUAR = '02';

    public function generate_nomtrans(Request $request)
    {

        $type = $request->query('type', self::TYPE_MASUK);

        if (!in_array($type, [self::TYPE_MASUK, self::TYPE_KELUAR])) {
            return response()->json([
                'success' => false,
                'message' => 'Tipe transaksi tidak valid'
            ], 400);
        }

        $year = date('Y');
        $month = date('m');

        $lastTrans = Tr::where('nomtrans', 'like', $type . $year . $month . '%')
            ->orderBy('id', 'desc')
            ->first();

        $number = 1;
        if ($lastTrans) {
            $number = (int)substr($lastTrans->nomtrans, -4) + 1;
        }


        $nomtrans = $type . $year . $month . str_pad($number, 4, '0', STR_PAD_LEFT);

        $lastKode = Tr::max('kode');

        if ($lastKode) {
            $kodeNum = (int)substr($lastKode, 3);
            $kodeNum++;
        } else {
            $kodeNum = 1;
        }


        $kode = 'BRG' . str_pad($kodeNum, 4, '0', STR_PAD_LEFT);

        return response()->json([
            'success' => true,
            'data' => [
                'nomtrans' => $nomtrans,
                'kode' => $kode,
            ]
        ]);
    }

    public function fetch_stocks()
    {
        $stocks = St::all();

        $data = $stocks->map(function ($stock) {
            $pendingKeluar = Tr::where('kode', $stock->kode)
                ->where('tipe', 'keluar')
                ->where('status', 'pending')
                ->sum('jumlah');

            $lastTransaction = Tr::where('kode', $stock->kode)
                ->where('tipe', 'masuk')
                ->where('status', 'approved')
                ->orderBy('created_at', 'desc')
                ->first();

            return [
                'id' => $stock->id,
                'kode' => $stock->kode,
                'nama' => $stock->nama,
                'stok' => $stock->stok,
                'stok_tersedia' => $stock->stok - $pendingKeluar,
                'pending_keluar' => $pendingKeluar,
                'unit' => $lastTransaction->unit ?? $stock->unit,
                'lokasi' => $lastTransaction->lokasi ?? $stock->lokasi,
                'tanggal' => $lastTransaction->tanggal ?? null,
                'expired' => $lastTransaction->expired ?? null,
                'keterangan' => $lastTransaction->keterangan ?? null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function message_tele_body($transaction, $type)
    {
        $message = "📦 Transaksi {$type} baru:\n"
            . "Nomor: {$transaction->nomtrans}\n"
            . "Nama: {$transaction->nama}\n"
            . "Jumlah: {$transaction->jumlah}\n"
            . "Unit: {$transaction->unit}\n"
            . "Tanggal: {$transaction->tanggal}\n"
            . "Status: {$transaction->status}";
        return $message;
    }
}
