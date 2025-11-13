<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Log;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use App\Mail\TransactionNotificationMail;
use App\Models\Notifikasi;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Http\Controllers\Api\UtilityController;

class SendTransactionNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $transaction;
    protected $type;

    public function __construct($transaction, $type)
    {
        $this->transaction = $transaction;
        $this->type = $type;
    }

    public function handle()
    {
        $message = (new UtilityController)->message_tele_body($this->transaction, $this->type);

        $telegramToken = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_CHAT_ID');
        if ($telegramToken && $chatId) {
            try {
                $response = Http::timeout(10)->post("https://api.telegram.org/bot{$telegramToken}/sendMessage", [
                    'chat_id' => $chatId,
                    'text' => $message
                ]);

                Notifikasi::where('nomtrans_id', $this->transaction->nomtrans)
                    ->where('channel', 'telegram')
                    ->update([
                        'pesan' => $message,
                        'is_send' => $response->successful(),
                        'sent_at' => now()
                    ]);
            } catch (\Exception $e) {
            }
        }

        try {
            Mail::to(env('MAIL_TO_ADDRESS', 'admin@example.com'))
                ->send(new TransactionNotificationMail($this->transaction, $this->type));

            Notifikasi::where('nomtrans_id', $this->transaction->nomtrans)
                ->where('channel', 'email')
                ->update([
                    'pesan' => 'Email terkirim',
                    'is_send' => true,
                    'sent_at' => now()
                ]);
        } catch (\Exception $e) {
            Log::error("Error deleting user: " . $e->getMessage());
            Notifikasi::where('nomtrans_id', $this->transaction->nomtrans)
                ->where('channel', 'email')
                ->update([
                    'pesan' => 'Gagal: '.$e->getMessage(),
                    'is_send' => false,
                ]);
        }
    }
}
