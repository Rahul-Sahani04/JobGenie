const express = require('express');
const {
  getResumeByUserId,
  updateResume,
  generateLatexResume,
  updateTemplate,
} = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Resume routes
router.get('/:userId', getResumeByUserId);
router.put('/:resumeId', updateResume);
router.put('/:resumeId/template', updateTemplate);
router.post('/:resumeId/latex', generateLatexResume);

module.exports = router;