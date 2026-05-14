import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../models/userModel.js', () => ({
  getUserByEmail: jest.fn(),
  createUser: jest.fn().mockResolvedValue(1),
}));

const { default: app } = await import('../server.js');
const { getUserByEmail } = await import('../models/userModel.js');

describe('API de usuarios', () => {
  beforeEach(() => {
    getUserByEmail.mockResolvedValue(null);
  });

  it('debería registrar un usuario correctamente', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ nombre: 'UserTest', email: 'usertest@test.com', password: 'password123' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Usuario creado correctamente');
  });

  it('debería rechazar un registro sin datos', async () => {
    const res = await request(app).post('/api/users/register').send({});
    expect(res.statusCode).toBe(400);
  });

  it('debería rechazar registro si el usuario ya existe', async () => {
    getUserByEmail.mockResolvedValue({ id: 1, email: 'usertest@test.com' });
    const res = await request(app)
      .post('/api/users/register')
      .send({ nombre: 'UserTest', email: 'usertest@test.com', password: 'password123' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'El usuario ya existe');
  });
});
