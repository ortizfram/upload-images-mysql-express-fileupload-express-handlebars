import { createPool } from "mysql2/promise";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./config.js";

const pool = createPool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
});

export const testDbConnection = async () => {
  try {

    // Attempt a simple query to test the connection
    const [rows] = await pool.query('SELECT 1');

    console.log(' ');
    console.log(' ');
    console.log('***Database connected successfully!***');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    // Handle the error or throw it to stop the app initialization
    throw error;
  }
};

export default pool;