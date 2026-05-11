import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  }
});

// Verificar conexión al iniciar
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Conectado a la base de datos MySQL');
    conn.release();
  } catch (err) {
    console.error('❌ Error al conectar a MySQL:', err);
  }
}

testConnection();

export const db = pool;
export default db;