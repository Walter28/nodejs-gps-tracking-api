import { Vehicle } from '../models/Vehicle.js';
import { Location } from '../models/Location.js';
import { TrackingSession } from '../models/TrackingSession.js';

export const getLocation = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ where: { vin: req.params.vin } });
    if (!vehicle) {
      return res.status(404).json({
        status: 404,
        message: 'Vehicle not found'
      });
    }

    const location = await Location.findOne({
      where: { VehicleId: vehicle.id },
      order: [['timestamp', 'DESC']]
    });

    if (!location) {
      return res.status(404).json({
        status: 404,
        message: 'No location data available'
      });
    }

    res.json({
      status: 200,
      data: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        altitude: parseFloat(location.altitude)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

export const startTracking = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ where: { vin: req.params.vin } });
    if (!vehicle) {
      return res.status(404).json({
        status: 404,
        message: 'Vehicle not found'
      });
    }

    const activeSession = await TrackingSession.findOne({
      where: {
        VehicleId: vehicle.id,
        endTime: null
      }
    });

    if (activeSession) {
      return res.status(400).json({
        status: 400,
        message: 'Tracking already in progress'
      });
    }

    const session = await TrackingSession.create({
      VehicleId: vehicle.id,
      startTime: new Date(),
      distance: 0
    });

    res.json({
      status: 200,
      message: 'Tracking started',
      timestamp: session.startTime
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

export const stopTracking = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ where: { vin: req.params.vin } });
    if (!vehicle) {
      return res.status(404).json({
        status: 404,
        message: 'Vehicle not found'
      });
    }

    const session = await TrackingSession.findOne({
      where: {
        VehicleId: vehicle.id,
        endTime: null
      }
    });

    if (!session) {
      return res.status(400).json({
        status: 400,
        message: 'No active tracking session'
      });
    }

    await session.update({
      endTime: new Date(),
      distance: Math.random() * (150 - 20) + 20
    });

    res.json({
      status: 200,
      distance: parseFloat(session.distance),
      message: 'Tracking stopped',
      endtime: session.endTime
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

export const getMileage = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ where: { vin: req.params.vin } });
    if (!vehicle) {
      return res.status(404).json({
        status: 404,
        message: 'Vehicle not found'
      });
    }

    const totalDistance = await TrackingSession.sum('distance', {
      where: {
        VehicleId: vehicle.id,
        endTime: { [Op.not]: null }
      }
    });

    res.json({
      status: 200,
      total_distance: parseFloat(totalDistance || 0),
      unit: 'km'
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};