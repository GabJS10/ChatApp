import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const Sessions = sequelize.define("sessions", {
  sessionId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.STRING,
    unique: true,
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  connected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});
