import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

console.log('Database connection pool created: ', process.env.DATABASE_URL);
export default pool;

const test = async () => {
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('🟢 Connected to DB! Current time:', result.rows[0].now);
    } catch (err) {
      console.error('🔴 DB connection failed:', err);
    }
  };
  test();
// This code sets up a connection pool to a PostgreSQL database using the pg library.