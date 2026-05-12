import request from 'supertest';
import app from '../server.js';

jest.mock('../models/movieModel.js', () => ({
  getAllMovies: jest.fn().mockResolvedValue([
    { id: 1, titulo: 'The Matrix', disponible: 1 },
  ]),
  getMovieById: jest.fn().mockResolvedValue({ id: 1, titulo: 'The Matrix' }),
  createMovie: jest.fn().mockResolvedValue(),
  updateMovie: jest.fn().mockResolvedValue(),
  deleteMovie: jest.fn().mockResolvedValue(),
}));

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
});
