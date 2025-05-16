const express = require('express');
const { getResumeByUserId, updateResume, generateLatexResume } = require('../controllers/resume.controller');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

// Get resume by user ID
router.get('/:userId', getResumeByUserId);

// Update resume
router.put('/:resumeId', updateResume);

// Generate LaTeX resume
router.post('/:resumeId/latex', generateLatexResume);

module.exports = router;