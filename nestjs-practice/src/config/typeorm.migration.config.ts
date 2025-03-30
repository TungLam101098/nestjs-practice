import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Define constants directly in this file to avoid import issues
const DATABASE_PORT = 5432;

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: DATABASE_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['../modules/**/*.entity.ts'],
  migrations: ['src/scripts/migrations/*.ts'],
  synchronize: false,
});
