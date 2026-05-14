import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../models/userModel.js', () => ({
  getUserByEmail: jest.fn(),
  createUser: jest.fn().mockResolvedValue(1),
}));

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn().mockResolvedValue('hashedpassword'),
    compare: jest.fn().mockResolvedValue(true),
  },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    verify: jest.fn(),
  },
}));

const { default: app } = await import('../server.js');
const { getUserByEmail } = await import('../models/userModel.js');
const { default: bcrypt } = await import('bcryptjs');

describe('API de usuarios', () => {
  beforeEach(() => {
    getUserByEmail.mockResolvedValue(null);
    bcrypt.compare.mockResolvedValue(true);
  });

  describe('Registro', () => {
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

  describe('Login', () => {
    it('debería iniciar sesión correctamente', async () => {
      getUserByEmail.mockResolvedValue({ id: 1, email: 'usertest@test.com', password: 'hashedpassword' });

      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'usertest@test.com', password: 'password123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login exitoso');
      expect(res.body).toHaveProperty('token');
    });

    it('debería rechazar login con usuario inexistente', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'noexiste@test.com', password: 'password123' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Usuario no encontrado');
    });

    it('debería rechazar login con contraseña incorrecta', async () => {
      getUserByEmail.mockResolvedValue({ id: 1, email: 'usertest@test.com', password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'usertest@test.com', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Contraseña incorrecta');
    });
  });
});
