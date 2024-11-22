<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Location;
use App\Models\TrackingSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function getLocation(string $vin): JsonResponse
    {
        $vehicle = Vehicle::where('vin', $vin)->firstOrFail();
        $location = $vehicle->locations()->latest()->first();

        if (!$location) {
            return response()->json([
                'status' => 404,
                'message' => 'No location data available'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'latitude' => $location->latitude,
                'longitude' => $location->longitude,
                'altitude' => $location->altitude
            ]
        ]);
    }

    public function startTracking(string $vin): JsonResponse
    {
        $vehicle = Vehicle::where('vin', $vin)->firstOrFail();
        
        $activeSession = $vehicle->trackingSessions()
            ->whereNull('end_time')
            ->first();

        if ($activeSession) {
            return response()->json([
                'status' => 400,
                'message' => 'Tracking already in progress'
            ], 400);
        }

        $session = $vehicle->trackingSessions()->create([
            'start_time' => now(),
            'distance' => 0
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Tracking started',
            'timestamp' => $session->start_time
        ]);
    }

    public function stopTracking(string $vin): JsonResponse
    {
        $vehicle = Vehicle::where('vin', $vin)->firstOrFail();
        
        $session = $vehicle->trackingSessions()
            ->whereNull('end_time')
            ->first();

        if (!$session) {
            return response()->json([
                'status' => 400,
                'message' => 'No active tracking session'
            ], 400);
        }

        $session->update([
            'end_time' => now()
        ]);

        return response()->json([
            'status' => 200,
            'distance' => $session->distance,
            'message' => 'Tracking stopped'
        ]);
    }

    public function getMileage(string $vin): JsonResponse
    {
        $vehicle = Vehicle::where('vin', $vin)->firstOrFail();
        
        $totalDistance = $vehicle->trackingSessions()
            ->whereNotNull('end_time')
            ->sum('distance');

        return response()->json([
            'status' => 200,
            'total_distance' => $totalDistance,
            'unit' => 'km'
        ]);
    }
}