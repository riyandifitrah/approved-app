<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TransactionNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $transaction;
    public $type;

    public function __construct($transaction, $type)
    {
        $this->transaction = $transaction;
        $this->type = $type;
    }

    public function build()
    {
        return $this->subject("Notifikasi Barang {$this->type}")->markdown('emails.transaction_notification');
    }
}
