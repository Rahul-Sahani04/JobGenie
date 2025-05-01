const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { register, login, getProfile, updateProfile } = require('../controllers/auth.controller');

const router = express.Router();

// Registration validation
const registerValidation = [
    check('name').trim().notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Please enter a valid email'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

// Login validation
const loginValidation = [
    check('email').isEmail().withMessage('Please enter a valid email'),
    check('password').notEmpty().withMessage('Password is required')
];

// Profile update validation
const profileUpdateValidation = [
    check('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    check('email').optional().isEmail().withMessage('Please enter a valid email'),
    check('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    check('profile.phone').optional().trim(),
    check('profile.location').optional().trim(),
    check('profile.headline').optional().trim(),
    check('profile.bio').optional().trim(),
    check('profile.skills').optional().isArray(),
    check('profile.experienceYears').optional().isNumeric()
];

// Routes
router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(profileUpdateValidation), updateProfile);

module.exports = router;