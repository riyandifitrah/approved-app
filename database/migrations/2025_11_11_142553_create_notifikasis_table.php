<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotifikasisTable extends Migration
{
    public function up()
    {
        Schema::create('notifikasi', function (Blueprint $table) {
            $table->id();
            $table->string('nomtrans_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('channel')->default('email');
            $table->string('judul')->nullable();
            $table->text('pesan');
            $table->boolean('is_send')->default(false);
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->softDeletes();
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('deleted_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('nomtrans_id')->references('nomtrans')->on('transactions')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifikasi');
    }
}
