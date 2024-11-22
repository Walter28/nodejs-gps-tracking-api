import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Vehicle } from './Vehicle.js';

export const Location = sequelize.define('Location', {
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  altitude: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Location.belongsTo(Vehicle);