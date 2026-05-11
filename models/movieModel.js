import { db } from '../config/db.js';

// Obtener todas las películas disponibles
export async function getAllMovies() {
  const [rows] = await db.query('SELECT * FROM peliculas WHERE disponible = 1');
  return rows;
}

// Obtener película por ID
export async function getMovieById(id) {
  const [rows] = await db.query('SELECT * FROM peliculas WHERE id = ?', [id]);
  return rows[0];
}

// Crear película
export async function createMovie(titulo, descripcion, portada_url, disponible) {
  const conn = await db.getConnection();
  try {
    const sql = `
      INSERT INTO peliculas (titulo, descripcion, portada_url, disponible)
      VALUES (?, ?, ?, ?)
    `;
    await conn.execute(sql, [
      titulo,
      descripcion,
      portada_url ?? null,
      disponible ?? 1
    ]);
  } finally {
    conn.release(); // <- CORRECTO
  }
}

// Actualizar película
export async function updateMovie(id, titulo, descripcion, portada_url, disponible) {
  const conn = await db.getConnection();
  try {
    const sql = `
      UPDATE peliculas
      SET titulo = ?, descripcion = ?, portada_url = ?, disponible = ?
      WHERE id = ?
    `;
    await conn.execute(sql, [titulo, descripcion, portada_url, disponible, id]);
  } finally {
    conn.release();
  }
}

// Eliminar película
export async function deleteMovie(id) {
  const conn = await db.getConnection();
  try {
    await conn.execute('DELETE FROM peliculas WHERE id = ?', [id]);
  } finally {
    conn.release();
  }
}
