const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { protect } = require('../middleware/auth.middleware');

// Validation middleware
const validateJob = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Full Time'])
    .withMessage('Invalid job type'),
  body('experience.min').optional().isNumeric().withMessage('Minimum experience must be a number'),
  body('experience.max').optional().isNumeric().withMessage('Maximum experience must be a number'),
  body('salary.min').optional().isNumeric().withMessage('Minimum salary must be a number'),
  body('salary.max').optional().isNumeric().withMessage('Maximum salary must be a number')
];

// Validation result check middleware
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes that don't require authentication
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);

// Protected routes that require authentication
router.post('/', protect, validateJob, checkValidation, jobController.createJob);
router.put('/:id', protect, validateJob, checkValidation, jobController.updateJob);
router.delete('/:id', protect, jobController.deleteJob);

module.exports = router;