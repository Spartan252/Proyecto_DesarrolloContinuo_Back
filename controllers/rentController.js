import { rentMovie, getRentedMoviesByUser, returnMovie } from '../models/rentModel.js';

export async function rent(req, res) {
  try {
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: 'Falta el ID de la película' });
    await rentMovie(req.user.id, movieId);
    res.status(201).json({ message: 'Película rentada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listUserRents(req, res) {
  try {
    const rents = await getRentedMoviesByUser(req.user.id);
    res.json(rents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function returnRentedMovie(req, res) {
  try {
    await returnMovie(req.params.id, req.user.id);
    res.json({ message: 'Película devuelta correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
