<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Transaction;

class Notifikasi extends Model
{
    use SoftDeletes;

    protected $table = 'notifikasi';

    protected $fillable = [
        'nomtrans_id',
        'user_id',
        'channel',
        'judul',
        'pesan',
        'is_send',
        'sent_at',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'is_send' => 'boolean',
        'sent_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'nomtrans_id', 'nomtrans');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
