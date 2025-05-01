const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    content: {
        basics: {
            name: String,
            email: String,
            phone: String,
            location: String,
            summary: String,
            website: String,
            profiles: [{
                network: String,
                url: String,
                username: String
            }]
        },
        education: [{
            institution: String,
            degree: String,
            field: String,
            startDate: Date,
            endDate: Date,
            gpa: String,
            courses: [String],
            achievements: [String]
        }],
        workExperience: [{
            company: String,
            position: String,
            location: String,
            startDate: Date,
            endDate: Date,
            current: Boolean,
            summary: String,
            highlights: [String],
            technologies: [String]
        }],
        projects: [{
            name: String,
            description: String,
            startDate: Date,
            endDate: Date,
            url: String,
            technologies: [String],
            highlights: [String]
        }],
        skills: [{
            category: String,
            items: [String]
        }],
        certifications: [{
            name: String,
            issuer: String,
            date: Date,
            url: String
        }],
        languages: [{
            name: String,
            proficiency: String
        }]
    },
    fileUrls: {
        pdf: String,
        docx: String
    },
    versions: [{
        versionNumber: Number,
        createdAt: {
            type: Date,
            default: Date.now
        },
        content: {
            type: mongoose.Schema.Types.Mixed
        },
        fileUrls: {
            pdf: String,
            docx: String
        },
        notes: String
    }],
    metadata: {
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        targetPosition: String,
        targetCompany: String,
        customTags: [String]
    }
}, {
    timestamps: true
});

// Pre-save middleware to handle versioning
resumeSchema.pre('save', function(next) {
    if (this.isModified('content')) {
        const versionNumber = (this.versions.length > 0) 
            ? this.versions[this.versions.length - 1].versionNumber + 1 
            : 1;
        
        this.versions.push({
            versionNumber,
            content: this.content,
            fileUrls: this.fileUrls,
            notes: 'Automatic version created on content update'
        });
    }
    this.metadata.lastUpdated = new Date();
    next();
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;