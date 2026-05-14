import { Hono } from 'hono';
import { cors } from 'hono/cors';
import jwt from 'jsonwebtoken';
import { setD1Binding } from '../config/db.js';
import { register, login } from '../controllers/userController.js';
import { listMovies, getMovie, addMovie, editMovie, removeMovie } from '../controllers/movieController.js';
import { rent, listUserRents, returnRentedMovie } from '../controllers/rentController.js';

const app = new Hono();

app.use('*', cors());

app.use('*', async (c, next) => {
  setD1Binding(c.env.DB);

  if (typeof process === 'undefined') {
    globalThis.process = { env: c.env };
  } else {
    Object.assign(process.env, c.env);
  }

  await next();
});

app.onError((err, c) => {
  return c.json({ message: 'Error interno del servidor', error: err.message }, 500);
});

// Builds a plain Express-style req/res pair from a Hono context
const buildReqRes = async (c, user = null) => {
  const body = c.req.header('content-type')?.includes('application/json')
    ? await c.req.json().catch(() => ({}))
    : {};

  const req = { body, params: c.req.param(), query: c.req.query(), headers: c.req.header() };
  if (user) req.user = user;

  let status = 200;
  let responseData = {};
  const res = {
    status: (s) => { status = s; return res; },
    json: (data) => { responseData = data; return res; },
    send: (data) => { responseData = data; return res; },
  };

  return { req, res, getResponse: (c) => c.json(responseData, status) };
};

const adapter = (fn) => async (c) => {
  const { req, res, getResponse } = await buildReqRes(c);
  await fn(req, res);
  return getResponse(c);
};

const authAdapter = (fn) => async (c) => {
  const token = c.req.header('authorization')?.split(' ')[1];
  if (!token) return c.json({ message: 'Token no proporcionado' }, 401);

  let decoded;
  try {
    decoded = jwt.verify(token, c.env.JWT_SECRET || process.env.JWT_SECRET);
  } catch {
    return c.json({ message: 'Token inválido o expirado' }, 403);
  }

  const { req, res, getResponse } = await buildReqRes(c, decoded);
  await fn(req, res);
  return getResponse(c);
};

app.get('/', (c) => c.text('API Movie Rental (Cloudflare Workers) funcionando'));

// Auth
app.post('/api/users/register', adapter(register));
app.post('/api/users/login', adapter(login));

// Movies
app.get('/api/movies', adapter(listMovies));
app.get('/api/movies/:id', adapter(getMovie));
app.post('/api/movies', adapter(addMovie));
app.put('/api/movies/:id', adapter(editMovie));
app.delete('/api/movies/:id', adapter(removeMovie));

// Rents
app.post('/api/rents', authAdapter(rent));
app.get('/api/rents', authAdapter(listUserRents));
app.delete('/api/rents/:id', authAdapter(returnRentedMovie));

export default app;
