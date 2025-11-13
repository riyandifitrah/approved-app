<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    public function up()
{
    Schema::create('transactions', function (Blueprint $table) {
        $table->id();
        $table->string('nomtrans')->unique();
        $table->string('kode');
        $table->string('nama');
        $table->string('jumlah');
        $table->enum('tipe', ['masuk', 'keluar']);
        $table->string('unit');
        $table->string('lokasi');
        $table->date('tanggal');
        $table->date('expired');
        $table->unsignedBigInteger('user_id');
        $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
        $table->text('keterangan')->nullable();
        $table->timestamps();
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->unsignedBigInteger('created_by')->nullable();
        $table->unsignedBigInteger('updated_by')->nullable();
        $table->unsignedBigInteger('deleted_by')->nullable();
        $table->softDeletes();
        $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        $table->foreign('deleted_by')->references('id')->on('users')->onDelete('set null');
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
