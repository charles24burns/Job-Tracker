import express from 'express';
import { getJobs, getJob, createJobByID, updateJobByID, deleteJobByID } from '../controllers/jobsController.js';
import { verifyToken } from '../middleware/verifyToken.js'; // Import the verifyToken middleware

const router = express.Router();

router.get('/:userId', verifyToken, getJobs); // Get all jobs
router.get('/:userId/:id', verifyToken, getJob); // Get a specific job by ID
router.post('/:userId', verifyToken, createJobByID); // Create a new job
router.put('/:userId/:id', verifyToken, updateJobByID); // Update a specific job by ID
router.delete('/:userId/:id', verifyToken, deleteJobByID); // Delete a specific job by ID


export default router;
// This code defines a set of RESTful API routes for managing jobs.