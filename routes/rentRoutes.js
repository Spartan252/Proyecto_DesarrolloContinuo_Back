import express from 'express';
import { rent, listUserRents, returnRentedMovie } from '../controllers/rentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas protegidas (requieren token)
router.post('/', verifyToken, rent);
router.get('/', verifyToken, listUserRents);
router.delete('/:id', verifyToken, returnRentedMovie);

export default router;
