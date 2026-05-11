import { db } from "../config/db.js";

// Obtener todos los usuarios
export const getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
};

// Buscar usuario por email
export const getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows.length > 0 ? rows[0] : null;
};

// Crear nuevo usuario
export const createUser = async (nombre, email, password) => {
  const [result] = await db.query(
    "INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)",
    [nombre, email, password]
  );
  return result.insertId;
};
