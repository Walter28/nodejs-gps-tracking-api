<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    protected $fillable = ['vin'];

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    public function trackingSessions(): HasMany
    {
        return $this->hasMany(TrackingSession::class);
    }
}