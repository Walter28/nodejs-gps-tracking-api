import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Vehicle } from './Vehicle.js';

export const TrackingSession = sequelize.define('TrackingSession', {
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  distance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
});

TrackingSession.belongsTo(Vehicle);