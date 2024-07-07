import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "chatsocket",
  "postgres",
  "admin1234",
  {
    host: "localhost",
    dialect: "postgres",
  }
);
