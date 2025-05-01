const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sanitizeOutput } = require('../middleware/validate.middleware');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            profile: {
                skills: [],
                experienceYears: 0,
                profileViews: 0
            }
        });

        if (user) {
            const sanitizedUser = sanitizeOutput(user.toObject(), [
                '_id',
                'name',
                'email',
                'profile'
            ]);

            res.status(201).json({
                ...sanitizedUser,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        
        if (user && (await user.matchPassword(password))) {
            const sanitizedUser = sanitizeOutput(user.toObject(), [
                '_id',
                'name',
                'email',
                'profile'
            ]);

            res.json({
                ...sanitizedUser,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('education')
            .populate('experience');

        if (user) {
            const sanitizedUser = sanitizeOutput(user.toObject(), [
                '_id',
                'name',
                'email',
                'profile',
                'education',
                'experience',
                'preferences'
            ]);

            res.json(sanitizedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            
            if (req.body.profile) {
                user.profile = {
                    ...user.profile,
                    ...req.body.profile
                };
            }

            if (req.body.preferences) {
                user.preferences = {
                    ...user.preferences,
                    ...req.body.preferences
                };
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            
            const sanitizedUser = sanitizeOutput(updatedUser.toObject(), [
                '_id',
                'name',
                'email',
                'profile',
                'preferences'
            ]);

            res.json({
                ...sanitizedUser,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};