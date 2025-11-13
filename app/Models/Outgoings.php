<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Outgoings extends Model
{
    use SoftDeletes;

    protected $table = 'outgoings';
    public $timestamps = true;

    protected $fillable = [
        'nomkwit',
        'nomtrans_id',
        'stock_id',
        'jumlah',
        'keterangan',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function stock()
    {
        return $this->belongsTo(Stock::class, 'stock_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deleter()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
