import BaseJoi from 'joi';
import JoiDate from '@joi/date';
import { findAllJobsByUser, findJob, createJob, updateJob, deleteJob } from '../models/jobsModel.js';

const Joi = BaseJoi.extend(JoiDate);

const jobSchema = Joi.object({
  applied_from: Joi.string().valid(
    "LinkedIn",
    "Indeed",
    "Handshake",
    "CollegeGrad",
    "Idealist",
    "USAJobs",
    "Company Website",
    "Interstide",
    "GoinGlobal",
    "Internships.com",
    "College Recruiter",
    "AfterCollege",
    "Worldwide Job Boards",
    "GoAbroad",
    "WayUp",
    "DCInternships",
    "Google Jobs",
    "Referral",
    "Networking",
    "Job Fair",
    "Other"

).required(),
  job_title: Joi.string().min(2).required(),
  company_name: Joi.string().min(2).required(),
  location: Joi.string()
    .trim()
    .pattern(/^[\p{L}\s]+,\s*[\p{L}\s]+,\s[\p{L}\s]+$/u)
    .required()
    .messages({
      'string.pattern.base': 'Location must be in the format "City, State, Country".'
    }),
  application_date: Joi.date().format(['YYYY-MM-DD', 'MM/DD/YYYY']).required(),
  status: Joi.string().valid(
    "applied",
    "interview",
    "offer",
    "accepted",
    "rejected"
  ).required()
});

const updateJobSchema = jobSchema.fork(Object.keys(jobSchema.describe().keys), (schema) => schema.optional()).min(1);


// Get all jobs
export const getJobs = async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    const result = await findAllJobsByUser(userId);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  console.log('📥 Received GET /api/v1/jobs');
};

// Get a specific job by ID
export const getJob = async (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const userId = parseInt(req.params.userId, 10);
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  if (isNaN(jobId)) {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  try {
    const result = await findJob(jobId, userId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Create a new job
export const createJobByID = async (req, res) => {
  console.log('📥 Received POST /api/v1/jobs');
  const { error, value } = jobSchema.validate(req.body);
  console.log('Validated job data:', value);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const userId = parseInt(req.params.userId, 10);
  console.log('userId:', userId);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    const result = await createJob(value, userId);
    res.status(201).json(result.rows[0]);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a specific job by ID
export const updateJobByID = async (req, res) => {

  const jobId = parseInt(req.params.id, 10);
  const { error, value } = updateJobSchema.validate(req.body);
 const userId = parseInt(req.params.userId, 10);
  if (isNaN(jobId)) {
    return res.status(400).json({ error: 'Invalid job ID' });
  }
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const result = await updateJob(jobId, userId, value);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a specific job by ID
export const deleteJobByID = async (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  if (isNaN(jobId)) {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  if (isNaN(jobId)) return res.status(400).json({ error: 'Invalid job ID' });
  const userId = parseInt(req.params.userId, 10); 
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const result = await deleteJob(jobId, userId);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    // If the job was deleted successfully, send a message that states that the Job was successfully deleted
    res.status(200).json({ message: 'Job successfully deleted' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


