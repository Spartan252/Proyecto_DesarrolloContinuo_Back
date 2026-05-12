import { db } from '../config/db.js';

export async function getAllMovies() {
  const [rows] = await db.query('SELECT * FROM peliculas WHERE disponible = 1');
  return rows;
}

export async function getMovieById(id) {
  const [rows] = await db.query('SELECT * FROM peliculas WHERE id = ?', [id]);
  return rows[0];
}

export async function createMovie(titulo, descripcion, portada_url, disponible) {
  await db.query(
    'INSERT INTO peliculas (titulo, descripcion, portada_url, disponible) VALUES (?, ?, ?, ?)',
    [titulo, descripcion, portada_url ?? null, disponible ?? 1]
  );
}

export async function updateMovie(id, titulo, descripcion, portada_url, disponible) {
  await db.query(
    'UPDATE peliculas SET titulo = ?, descripcion = ?, portada_url = ?, disponible = ? WHERE id = ?',
    [titulo, descripcion, portada_url, disponible, id]
  );
}

export async function deleteMovie(id) {
  await db.query('DELETE FROM peliculas WHERE id = ?', [id]);
}
