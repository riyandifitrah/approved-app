<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOutgoingsTable extends Migration
{
    public function up()
    {
        Schema::create('outgoings', function (Blueprint $table) {
            $table->id();
            $table->string('nomkwit')->unique();
            $table->string('nomtrans_id');
            $table->string('stock_id');
            $table->integer('jumlah');
            $table->text('keterangan')->nullable();
            $table->timestamps();
            $table->foreign('nomtrans_id')->references('nomtrans')->on('transactions')->onDelete('cascade');
            $table->foreign('stock_id')->references('kode')->on('stocks')->onDelete('cascade');
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
        Schema::dropIfExists('outgoings');
    }
}
