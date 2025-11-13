<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stock extends Model
{
    use SoftDeletes;

    protected $table = 'stocks';
    public $timestamps = true;

    protected $fillable = [
        'nomtrans_id',
        'kode',
        'nama',
        'jumlah',
        'stok',
        'unit',
        'lokasi',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    // relasi ke satu transaksi (opsional)
    // relasi ke banyak transaksi
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'nomtrans', 'nomtrans_id');
    }


    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deletedByUser()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
