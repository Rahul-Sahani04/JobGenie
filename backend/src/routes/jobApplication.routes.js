const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication
} = require('../controllers/jobApplication.controller');

const router = express.Router();

// Application validation rules
const applicationValidation = [
    check('jobTitle').trim().notEmpty().withMessage('Job title is required'),
    check('companyName').trim().notEmpty().withMessage('Company name is required'),
    check('jobLocation').trim().notEmpty().withMessage('Job location is required'),
    check('jobType')
        .isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'])
        .withMessage('Invalid job type'),
    check('salary.amount').optional().isNumeric(),
    check('salary.currency').optional().isLength({ min: 3, max: 3 }),
    check('originalJobUrl').isURL().withMessage('Valid job URL is required'),
    check('jobDescription').notEmpty().withMessage('Job description is required'),
    check('status')
        .optional()
        .isIn(['Applied', 'In Review', 'Interviewing', 'Offered', 'Accepted', 'Rejected']),
    check('skills').optional().isArray(),
    check('remote').optional().isBoolean()
];

const updateValidation = [
    check('jobTitle').optional().trim().notEmpty(),
    check('companyName').optional().trim().notEmpty(),
    check('jobLocation').optional().trim().notEmpty(),
    check('jobType')
        .optional()
        .isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']),
    check('status')
        .optional()
        .isIn(['Applied', 'In Review', 'Interviewing', 'Offered', 'Accepted', 'Rejected']),
    check('notes').optional().trim(),
    check('interviews').optional().isArray(),
    check('skills').optional().isArray(),
    check('remote').optional().isBoolean()
];

// Routes
router.post('/', protect, validate(applicationValidation), createApplication);
router.get('/', protect, getApplications);
router.get('/:id', protect, getApplication);
router.put('/:id', protect, validate(updateValidation), updateApplication);
router.delete('/:id', protect, deleteApplication);

module.exports = router;