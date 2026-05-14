import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../models/rentModel.js', () => ({
  rentMovie: jest.fn().mockResolvedValue(1),
  getRentedMoviesByUser: jest.fn().mockResolvedValue([
    { id: 1, titulo: 'The Matrix', portada_url: 'http://img.com', fecha_renta: '2026-01-01' },
  ]),
  returnMovie: jest.fn().mockResolvedValue(),
}));

const { default: app } = await import('../server.js');

describe('API de rentas', () => {
  it('debería registrar una renta correctamente', async () => {
    const res = await request(app).post('/api/rents').send({ movieId: 1 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Película rentada correctamente');
  });

  it('debería rechazar una renta sin movieId', async () => {
    const res = await request(app).post('/api/rents').send({});
    expect(res.statusCode).toBe(400);
  });

  it('debería obtener las rentas del usuario', async () => {
    const res = await request(app).get('/api/rents');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debería devolver una película rentada correctamente', async () => {
    const res = await request(app).delete('/api/rents/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Película devuelta correctamente');
  });
});
