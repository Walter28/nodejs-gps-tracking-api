import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const Vehicle = sequelize.define('Vehicle', {
  vin: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
});