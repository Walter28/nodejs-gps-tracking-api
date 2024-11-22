<?php

use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::prefix('vehicle/{vin}')->group(function () {
    Route::get('/location', [VehicleController::class, 'getLocation']);
    Route::post('/start-tracking', [VehicleController::class, 'startTracking']);
    Route::post('/stop-tracking', [VehicleController::class, 'stopTracking']);
    Route::get('/mileage', [VehicleController::class, 'getMileage']);
});