import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "chatsocket",
  "postgres",
  "postgres123",
  {
    host: "localhost",
    dialect: "postgres",
  }
);
