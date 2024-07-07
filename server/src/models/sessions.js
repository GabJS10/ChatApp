import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";
export const Sessions = sequelize.define("sessions", {
  sessionId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  connected: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
});

