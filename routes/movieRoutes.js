import express from 'express';
import {
  listMovies,
  getMovie,
  addMovie,
  editMovie,
  removeMovie
} from '../controllers/movieController.js';

const router = express.Router();

// Rutas principales
router.get('/', listMovies);
router.get('/:id', getMovie);

// CRUD (opcional: admin)
router.post('/', addMovie);
router.put('/:id', editMovie);
router.delete('/:id', removeMovie);

export default router;
