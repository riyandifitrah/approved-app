<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Approval extends Model
{
    use SoftDeletes;
    public $timestamps = true;
    protected $fillable = [
        'nomtrans_id',
        'user_id',
        'status',
        'catatan',
        'tanggal_approve',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'nomtrans_id', 'nomtrans');
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
