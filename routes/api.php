<?php

use App\Http\Controllers\Api\ApprovalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\NotifikasiController;
use App\Http\Controllers\Api\StockController;
use App\Http\Controllers\Api\UtilityController;
use App\Http\Controllers\Api\TransactionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// Route::get('/', [AuthController::class, 'index'])->name('index');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'currentUser']);

Route::get('/generate-nomtrans', [UtilityController::class, 'generate_nomtrans']);
Route::get('/fetch-stocks', [UtilityController::class, 'fetch_stocks']);

Route::middleware('auth:sanctum')->prefix('transactions')->group(function () {
    Route::prefix('masuk')->group(function () {
        Route::post('/create', [TransactionController::class, 'createMasuk']);
        Route::get('/', [TransactionController::class, 'indexMasuk']);
        Route::get('/detail/{nomtrans}', [TransactionController::class, 'showMasuk']);
        Route::put('/update/{nomtrans}', [TransactionController::class, 'updateMasuk']);
        Route::put('/update-status/{nomtrans}', [TransactionController::class, 'updateStatusMasuk']);
        Route::delete('/delete', [TransactionController::class, 'deleteMasuk']);

        Route::get('/notif', [NotifikasiController::class, 'indexNotifMasuk']);
        Route::delete('/notif/delete', [NotifikasiController::class, 'deletNotifMasuk']);
    });
    Route::prefix('keluar')->group(function () {
        Route::post('/create', [TransactionController::class, 'createKeluar']);
        Route::get('/', [TransactionController::class, 'indexKeluar']);
        Route::get('/detail/{nomtrans}', [TransactionController::class, 'showKeluar']);
        Route::put('/update/{nomtrans}', [TransactionController::class, 'updateKeluar']);
        Route::put('/update-status/{nomtrans}', [TransactionController::class, 'updateStatusKeluar']);
        Route::delete('/delete', [TransactionController::class, 'deleteKeluar']);

        Route::get('/notif', [NotifikasiController::class, 'indexNotifKeluar']);
        Route::delete('/notif/delete', [NotifikasiController::class, 'deletNotifKeluar']);
    });
    
    Route::get('/approvals', [ApprovalController::class, 'indexApprovedMasuk']);
    Route::delete('/approvals/delete', [ApprovalController::class, 'deletApprovedMasuk']);

    Route::get('/stocks', [StockController::class, 'indexStock']);
    Route::get('/stocks/{id}', [StockController::class, 'showStock']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
});