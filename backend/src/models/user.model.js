const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    profile: {
        phone: {
            type: String,
            trim: true
        },
        location: {
            type: String,
            trim: true
        },
        headline: {
            type: String,
            trim: true
        },
        bio: String,
        skills: [String],
        experienceYears: {
            type: Number,
            default: 0
        },
        profileViews: {
            type: Number,
            default: 0
        }
    },
    education: [{
        school: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        gpa: String,
        description: String
    }],
    experience: [{
        company: String,
        position: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: {
            type: Boolean,
            default: false
        },
        description: String
    }],
    preferences: {
        jobTypes: [String],
        locations: [String],
        experienceLevels: [String],
        remote: {
            type: Boolean,
            default: false
        },
        minSalary: Number,
        maxSalary: Number,
        currency: {
            type: String,
            default: 'INR'
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;