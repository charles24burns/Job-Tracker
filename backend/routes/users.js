import express from 'express';
import { getUser, createUser, updateUser, deleteUser } from '../controllers/usersController.js';
import { verifyToken } from '../middleware/verifyToken.js'; // Import the verifyToken middleware


const router = express.Router();

router.get('/:email', verifyToken, getUser); // Get a specific user by ID
router.post('/', createUser); // Create a new user
router.put('/:id', verifyToken, updateUser); // Update a specific user by ID
router.delete('/:id', verifyToken, deleteUser); // Delete a specific user by ID

export default router;
// This code defines a set of RESTful API routes for managing users.