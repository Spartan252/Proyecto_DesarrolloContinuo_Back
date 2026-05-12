import { db } from '../config/db.js';

export async function rentMovie(userId, movieId) {
  const [result] = await db.query(
    'INSERT INTO rentas (usuario_id, pelicula_id, fecha_renta) VALUES (?, ?, CURRENT_TIMESTAMP)',
    [userId, movieId]
  );
  return result.insertId;
}

export async function getRentedMoviesByUser(userId) {
  const [rows] = await db.query(
    `SELECT r.id, p.titulo, p.descripcion, p.portada_url, r.fecha_renta
     FROM rentas r
     INNER JOIN peliculas p ON r.pelicula_id = p.id
     WHERE r.usuario_id = ?`,
    [userId]
  );
  return rows;
}

export async function returnMovie(rentId, userId) {
  await db.query('DELETE FROM rentas WHERE id = ? AND usuario_id = ?', [rentId, userId]);
}
