import { rentMovie, getRentedMoviesByUser, returnMovie } from '../models/rentModel.js';

export async function rent(req, res) {
  try {
    const userId = req.user.id;
    const { movieId } = req.body;

    if (!movieId) return res.status(400).json({ message: 'Falta el ID de la película' });

    await rentMovie(userId, movieId);
    res.status(201).json({ message: 'Película rentada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listUserRents(req, res) {
  try {
    const userId = req.user.id;
    const rents = await getRentedMoviesByUser(userId);
    res.json(rents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function returnRentedMovie(req, res) {
  console.log("retornando...")
  try {
    const userId = req.user.id;
    const rentId = req.params.id;
    await returnMovie(rentId, userId);
    res.json({ message: 'Película devuelta correctamente' });
    console.log(`Película ${rentId} devuelta correctamente`)
  } catch (err) {
    console.log("Error")
    res.status(500).json({ error: err.message });
  }
}
