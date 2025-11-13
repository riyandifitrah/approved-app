<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use SoftDeletes;
    public $timestamps = true;
    protected $table = 'transactions';
    protected $fillable = [
        'nomtrans',
        'kode',
        'nama',
        'jumlah',
        'tipe',
        'unit',
        'lokasi',
        'tanggal',
        'expired',
        'user_id',
        'status',
        'keterangan',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $dates = [
        'tanggal',
        'expired',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    public function notifikasi()
    {
        return $this->hasMany(Notifikasi::class, 'nomtrans_id', 'nomtrans');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
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
