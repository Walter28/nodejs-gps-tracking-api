import { sequelize } from '../../db.js';
import { User } from '../../models/User.js';
import { Vehicle } from '../../models/Vehicle.js';
import { Location } from '../../models/Location.js';
import { TrackingSession } from '../../models/TrackingSession.js';
import crypto from 'crypto';

async function seed() {
  try {
    await sequelize.sync({ force: true });

    // Create test user
    const user = await User.create({
      username: 'testuser',
      password: 'password123',
      apiKey: crypto.randomBytes(32).toString('hex')
    });

    // Create test vehicles
    const vehicles = await Vehicle.bulkCreate([
      { vin: 'TEST1234567890ABC1' },
      { vin: 'TEST1234567890ABC2' },
      { vin: 'TEST1234567890ABC3' }
    ]);

    // Create test locations
    for (const vehicle of vehicles) {
      await Location.bulkCreate([
        {
          VehicleId: vehicle.id,
          latitude: 48.8566,
          longitude: 2.3522,
          altitude: 35,
          timestamp: new Date()
        },
        {
          VehicleId: vehicle.id,
          latitude: 48.8566,
          longitude: 2.3523,
          altitude: 35,
          timestamp: new Date(Date.now() - 1000 * 60 * 5)
        }
      ]);

      // Create test tracking sessions
      await TrackingSession.create({
        VehicleId: vehicle.id,
        startTime: new Date(Date.now() - 1000 * 60 * 60),
        endTime: new Date(),
        distance: 25.5
      });
    }

    console.log('Database seeded successfully!');
    console.log('Test User Credentials:');
    console.log('Username: testuser');
    console.log('Password: password123');
    console.log('Test VINs:');
    console.log('- TEST1234567890ABC1');
    console.log('- TEST1234567890ABC2');
    console.log('- TEST1234567890ABC3');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();