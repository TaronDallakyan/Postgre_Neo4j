import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.POSTGRES_DB_NAME,
  process.env.POSTGRES_DB_USERNAME,
  process.env.POSTGRES_DB_PASSWORD,
  {
    host: process.env.HOST,
    dialect: 'postgres',
    logging: false,
  },
);
