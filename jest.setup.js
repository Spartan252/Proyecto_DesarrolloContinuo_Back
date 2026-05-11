import { db } from './config/db.js';

afterAll(async () => {
  await db.query("DELETE FROM peliculas WHERE titulo = 'Pelicula Test'");
  await db.query("DELETE FROM users WHERE email = 'usertest@test.com'");
  await db.end();
});
