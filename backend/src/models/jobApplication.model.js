const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    jobLocation: {
        type: String,
        required: true,
        trim: true
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
        required: true
    },
    salary: {
        amount: {
            type: Number,
            default: null
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
    originalJobUrl: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'In Review', 'Interviewing', 'Offered', 'Accepted', 'Rejected'],
        default: 'Applied'
    },
    notes: {
        type: String,
        default: ''
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['Applied', 'In Review', 'Interviewing', 'Offered', 'Accepted', 'Rejected']
        },
        date: {
            type: Date,
            default: Date.now
        },
        note: String
    }],
    interviews: [{
        type: {
            type: String,
            enum: ['Phone', 'Video', 'On-site', 'Technical', 'HR']
        },
        date: Date,
        notes: String,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    skills: [{
        type: String,
        trim: true
    }],
    remote: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Pre-save middleware to update status history
jobApplicationSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            date: new Date(),
            note: 'Status updated'
        });
    }
    next();
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;