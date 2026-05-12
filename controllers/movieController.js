import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } from '../models/movieModel.js';

export async function listMovies(req, res) {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getMovie(req, res) {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Película no encontrada' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addMovie(req, res) {
  try {
    const { titulo, descripcion, portada_url, disponible } = req.body;
    await createMovie(titulo, descripcion, portada_url, disponible ?? 1);
    res.status(201).json({ message: 'Película creada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function editMovie(req, res) {
  try {
    const { titulo, descripcion, portada_url, disponible } = req.body;
    await updateMovie(req.params.id, titulo, descripcion, portada_url, disponible);
    res.json({ message: 'Película actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeMovie(req, res) {
  try {
    await deleteMovie(req.params.id);
    res.json({ message: 'Película eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
