import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../models/movieModel.js', () => ({
  getAllMovies: jest.fn().mockResolvedValue([
    { id: 1, titulo: 'The Matrix', disponible: 1 },
  ]),
  getMovieById: jest.fn().mockResolvedValue({ id: 1, titulo: 'The Matrix' }),
  createMovie: jest.fn().mockResolvedValue(),
  updateMovie: jest.fn().mockResolvedValue(),
  deleteMovie: jest.fn().mockResolvedValue(),
}));

const { default: app } = await import('../server.js');
const { getMovieById } = await import('../models/movieModel.js');

describe('API de películas', () => {
  it('debería obtener el listado de películas', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debería crear una película correctamente', async () => {
    const res = await request(app)
      .post('/api/movies')
      .send({ titulo: 'Pelicula Test', descripcion: 'Test', portada_url: 'http://test.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Película creada correctamente');
  });

  it('debería obtener una película por ID', async () => {
    const res = await request(app).get('/api/movies/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('titulo');
  });

  it('debería retornar 404 si la película no existe', async () => {
    getMovieById.mockResolvedValueOnce(null);
    const res = await request(app).get('/api/movies/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Película no encontrada');
  });

  it('debería actualizar una película correctamente', async () => {
    const res = await request(app)
      .put('/api/movies/1')
      .send({ titulo: 'Matrix Reloaded', descripcion: 'Secuela', portada_url: 'http://test.com', disponible: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Película actualizada correctamente');
  });

  it('debería eliminar una película correctamente', async () => {
    const res = await request(app).delete('/api/movies/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Película eliminada correctamente');
  });
});
