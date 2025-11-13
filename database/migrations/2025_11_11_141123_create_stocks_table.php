<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStocksTable extends Migration
{
    public function up()
{
    Schema::create('stocks', function (Blueprint $table) {
        $table->id();
        $table->string('kode')->unique();
        $table->string('nomtrans_id');
        $table->string('nama');
        $table->integer('stok')->default(0);
        $table->string('unit')->nullable();
        $table->string('lokasi')->nullable();
        $table->timestamps();
        $table->foreign('nomtrans_id')->references('nomtrans')->on('transactions')->onDelete('cascade');
        $table->unsignedBigInteger('created_by')->nullable();
        $table->unsignedBigInteger('updated_by')->nullable();
        $table->unsignedBigInteger('deleted_by')->nullable();
        $table->softDeletes();
        $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        $table->foreign('deleted_by')->references('id')->on('users')->onDelete('set null');
    });
    
}


    public function down()
    {
        Schema::dropIfExists('stocks');
    }
}
