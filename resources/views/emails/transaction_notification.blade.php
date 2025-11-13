@component('mail::message')
# 📦 Transaksi {{ $type }} Baru

Berikut detail transaksi:

- **Nomor:** {{ $transaction->nomtrans }}
- **Nama:** {{ $transaction->nama }}
- **Jumlah:** {{ $transaction->jumlah }}
- **Unit:** {{ $transaction->unit }}
- **Tanggal:** {{ \Carbon\Carbon::parse($transaction->tanggal)->format('d/m/Y') }}
- **Status:** {{ $transaction->status }}

@component('mail::button', ['url' => '#'])
Lihat Transaksi
@endcomponent

Terima kasih,<br>
{{ config('app.name') }}
@endcomponent
