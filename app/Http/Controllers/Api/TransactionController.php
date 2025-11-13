<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Stock;
use App\Models\Approval;
use App\Models\Notifikasi;
use App\Models\Outgoings;
use Illuminate\Http\Request;
use App\Jobs\SendTransactionNotificationJob;

class TransactionController extends Controller
{
    public function indexMasuk()
    {
        $data = Transaction::where('tipe', 'masuk')->orderBy('tanggal', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function showMasuk($nomtrans)
    {
        $transaction = Transaction::where('nomtrans', $nomtrans)->firstOrFail();
        return response()->json($transaction);
    }


    public function createMasuk(Request $request)
    {
        $request->validate([
            'nomtrans' => 'required|string|unique:transactions,nomtrans',
            'kode' => 'required|string|unique:transactions,kode',
            'nama' => 'required|string',
            'jumlah' => 'required|string',
            'unit' => 'required|string',
            'tanggal' => 'required|date',
            'expired' => 'nullable|date',
            'status' => 'required|in:pending,approved,rejected',
            'keterangan' => 'nullable|string'
        ]);

        $transaction = Transaction::create([
            'nomtrans' => $request->nomtrans,
            'kode' => $request->kode,
            'tipe' => 'masuk',
            'nama' => $request->nama,
            'jumlah' => $request->jumlah,
            'unit' => $request->unit,
            'tanggal' => $request->tanggal,
            'expired' => $request->expired,
            'status' => 'pending',
            'lokasi' => $request->lokasi,
            'keterangan' => $request->keterangan,
            'user_id' => $request->user()->id,
            'created_by' => $request->user()->id
        ]);
        
        Notifikasi::create([
            'nomtrans_id' => $transaction->nomtrans,
            'channel' => 'telegram',
            'user_id' => $request->user()->id,
            'judul' => "Transaksi Baru",
            'pesan' => '',
            'is_send' => false,
            'created_by' => $request->user()->id,
        ]);

        Notifikasi::create([
            'nomtrans_id' => $transaction->nomtrans,
            'channel' => 'email',
            'user_id' => $request->user()->id,
            'judul' => "Transaksi Baru",
            'pesan' => '',
            'is_send' => false,
            'created_by' => $request->user()->id,
        ]);

        SendTransactionNotificationJob::dispatchNow($transaction, 'masuk');

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dibuat dan notifikasi dikirim.',
            'data' => $transaction
        ], 201);
    }

    public function updateMasuk(Request $request, $nomtrans)
    {
        $transaction = Transaction::where('nomtrans', $nomtrans)->firstOrFail();
        $transaction->update($request->all());
        $transaction->updated_by = auth()->user()->id ?? null;
        $transaction->save();
        return response()->json([
            'success' => true,
            'message' => 'Transaction berhasil diupdate',
            'data' => $transaction
        ]);
    }

    public function updateStatusMasuk(Request $request, $nomtrans)
    {
        $transaction = Transaction::where('nomtrans', $nomtrans)
            ->where('tipe', 'masuk')
            ->firstOrFail();

        $status = $request->input('status');
        $catatan = $request->input('catatan');

        if (!in_array($status, ['pending', 'approved', 'rejected'])) {
            return response()->json([
                'success' => false,
                'message' => 'Status tidak valid'
            ]);
        }


        $transaction->status = $status;
        $transaction->updated_by = $request->user()->id;
        $transaction->save();
        if ($status == 'approved') {
            $stock = Stock::firstOrCreate(
                ['kode' => $transaction->kode],
                [
                    'nomtrans_id' => $transaction->nomtrans,
                    'stok' => $transaction->jumlah,
                    'unit' => $transaction->unit,
                    'lokasi' => $transaction->lokasi,
                    'nama' => $transaction->nama
                ]
            );
            $stock->save();
            Approval::create([
                'nomtrans_id' => $transaction->nomtrans,
                'user_id' => $request->user()->id,
                'status' => 'approved',
                'catatan' => $catatan ?? 'Disetujui otomatis',
                'tanggal_approve' => now(),
                'created_by' => $request->user()->id,
            ]);
        } elseif ($status === 'rejected') {
            Approval::create([
                'nomtrans_id' => $transaction->nomtrans,
                'user_id' => $request->user()->id,
                'status' => 'rejected',
                'catatan' => $catatan ?? 'Transaksi ditolak',
                'tanggal_approve' => now(),
                'created_by' => $request->user()->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => "Transaksi berhasil diupdate ke $status"
        ]);
    }

    public function deleteMasuk(Request $request)
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) {
            return response()->json(['success' => false, 'message' => 'Tidak ada data yang dipilih']);
        }
        Transaction::where('tipe', 'masuk')->whereIn('id', $ids)->delete();

        return response()->json(['success' => true, 'message' => count($ids) . ' data berhasil dihapus']);
    }

    public function indexKeluar()
    {
        $data = Transaction::where('tipe', 'keluar')->orderBy('tanggal', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function showKeluar($nomtrans)
    {
        $transaction = Transaction::where('nomtrans', $nomtrans)->firstOrFail();
        return response()->json($transaction);
    }

    public function createKeluar(Request $request)
    {

        $stock = Stock::where('kode', $request->kode)->first();
        $maxJumlah = $stock ? $stock->stok : 0;

        $request->validate([
            'nomtrans' => 'required|string|unique:transactions,nomtrans',
            'kode' => 'required|string',
            'nama' => 'required|string',
            'jumlah' => "required|integer|min:1|max:$maxJumlah",
            'unit' => 'required|string',
            'tanggal' => 'required|date',
            'expired' => 'nullable|date',
            'status' => 'required|in:pending,approved,rejected',
            'lokasi' => 'required|string',
            'keterangan' => 'nullable|string'
        ], [
            'jumlah.max' => "Jumlah tidak boleh lebih dari stok yang tersedia ($maxJumlah)"
        ]);

        $transaction = Transaction::create([
            'nomtrans' => $request->nomtrans,
            'kode' => $request->kode,
            'tipe' => 'keluar',
            'nama' => $request->nama,
            'jumlah' => $request->jumlah,
            'unit' => $request->unit,
            'tanggal' => $request->tanggal,
            'expired' => $request->expired,
            'status' => 'pending',
            'lokasi' => $request->lokasi,
            'keterangan' => $request->keterangan,
            'user_id' => $request->user()->id,
            'created_by' => $request->user()->id
        ]);
        Notifikasi::create([
            'nomtrans_id' => $transaction->nomtrans,
            'channel' => 'telegram',
            'user_id' => $request->user()->id,
            'judul' => "Transaksi Baru",
            'pesan' => '',
            'is_send' => false,
            'created_by' => $request->user()->id,
        ]);

        Notifikasi::create([
            'nomtrans_id' => $transaction->nomtrans,
            'channel' => 'email',
            'user_id' => $request->user()->id,
            'judul' => "Transaksi Baru",
            'pesan' => '',
            'is_send' => false,
            'created_by' => $request->user()->id,
        ]);

        SendTransactionNotificationJob::dispatchNow($transaction, 'keluar');

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dibuat dan notifikasi dikirim.',
            'data' => $transaction
        ], 201);
    }

    public function updateKeluar(Request $request, $nomtrans)
    {
        $transaction = Transaction::where('nomtrans', $nomtrans)->firstOrFail();
        $transaction->update($request->all());
        $transaction->updated_by = $request->user()->id ?? null;
        $transaction->save();
        return response()->json([
            'success' => true,
            'message' => 'Transaction berhasil diupdate',
            'data' => $transaction
        ]);
    }

    public function updateStatusKeluar(Request $request, $nomtrans)
    {
        $transaction = Transaction::where('nomtrans', $nomtrans)
            ->where('tipe', 'keluar')
            ->firstOrFail();

        $status = $request->input('status');
        $catatan = $request->input('catatan');

        if (!in_array($status, ['pending', 'approved', 'rejected'])) {
            return response()->json([
                'success' => false,
                'message' => 'Status tidak valid'
            ]);
        }

        $transaction->status = $status;
        $transaction->updated_by = $request->user()->id;
        $transaction->save();

        $stock = Stock::where('kode', $transaction->kode)->first();

        if ($status == 'approved' && $stock) {
            $stock->stok = max(0, $stock->stok - $transaction->jumlah);
            $stock->save();
            $prefix = '03';
            $year = date('Y');
            $month = date('m');
            $base = $prefix . $year . $month;
            
            $lastOut = Outgoings::withTrashed()->where('nomkwit', 'like', $base . '%')
            ->orderByDesc('nomkwit')
            ->first();

            $number = 1;
            if ($lastOut) {
                $number = (int)substr($lastOut->nomkwit, -4) + 1;
            }
            $numbers = str_pad($number, 4, '0', STR_PAD_LEFT);
            $nomkwit = $base . $numbers;

            Approval::create([
                'nomtrans_id' => $transaction->nomtrans,
                'user_id' => $request->user()->id,
                'status' => 'approved',
                'catatan' => $catatan ?? 'Disetujui otomatis',
                'tanggal_approve' => now(),
                'created_by' => $request->user()->id,
            ]);
            Outgoings::create([
                'nomkwit' => $nomkwit,
                'nomtrans_id' => $transaction->nomtrans,
                'stock_id' => $stock->id,
                'jumlah' => $transaction->jumlah,
                'keterangan' => $catatan ?? null,
                'created_by' => $request->user()->id,
            ]);
            
        } elseif ($status === 'rejected') {
            Approval::create([
                'nomtrans_id' => $transaction->nomtrans,
                'user_id' => $request->user()->id,
                'status' => 'rejected',
                'catatan' => $catatan ?? 'Transaksi ditolak',
                'tanggal_approve' => now(),
                'created_by' => $request->user()->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => "Transaksi keluar berhasil diupdate ke $status"
        ]);
    }

    public function deleteKeluar(Request $request)
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) {
            return response()->json(['success' => false, 'message' => 'Tidak ada data yang dipilih']);
        }
        Transaction::where('tipe', 'keluar')->whereIn('id', $ids)->delete();

        return response()->json(['success' => true, 'message' => count($ids) . ' data berhasil dihapus']);
    }
}
