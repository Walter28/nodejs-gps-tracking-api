import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getLocation,
  startTracking,
  stopTracking,
  getMileage
} from '../controllers/vehicleController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

router.get('/vehicle/:vin/location', getLocation);
router.post('/vehicle/:vin/start-tracking', startTracking);
router.post('/vehicle/:vin/stop-tracking', stopTracking);
router.get('/vehicle/:vin/mileage', getMileage);

export default router;