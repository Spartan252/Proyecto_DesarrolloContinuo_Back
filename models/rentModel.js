import mysql from 'mysql2/promise';
import { db } from '../config/db.js';

export async function rentMovie(userId, movieId) {
  console.log(`🟢 Rentando película ${movieId} para usuario ${userId}`);
  const sql = `
    INSERT INTO rentas (usuario_id, pelicula_id, fecha_renta)
    VALUES (?, ?, NOW())
  `;
  const [result] = await db.query(sql, [userId, movieId]);
  console.log('✅ Renta registrada con ID:', result.insertId);
  return result.insertId;
}


export async function getRentedMoviesByUser(userId) {
  console.log(`🟢 Rentandas pendientes para usuario ${userId}`);

  const sql = `
    SELECT r.id, p.titulo, p.descripcion, p.portada_url, r.fecha_renta
    FROM rentas r
    INNER JOIN peliculas p ON r.pelicula_id = p.id
    WHERE r.usuario_id = ?
  `;

  try {
    const [rows] = await db.query(sql, [userId]);
    console.log('✅ Rentas:', rows);
    return rows;
  } catch (err) {
    console.error('❌ Error al obtener rentas:', err.message);
    throw err;
  }
}


export async function returnMovie(rentId, userId) {
  const sql = 'DELETE FROM rentas WHERE id = ? AND usuario_id = ?';
  try {
    await db.query(sql, [rentId, userId]);
    console.log("se devolvio la pelicula")
  }
  catch{
    console.log("error al devolver")

  }
}
