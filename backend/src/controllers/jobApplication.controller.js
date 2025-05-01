const JobApplication = require('../models/jobApplication.model');
const { sanitizeOutput } = require('../middleware/validate.middleware');

// @desc    Create a new job application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
    try {
        const application = new JobApplication({
            ...req.body,
            user: req.user._id,
            statusHistory: [{
                status: 'Applied',
                date: new Date(),
                note: 'Initial application created'
            }]
        });

        const savedApplication = await application.save();
        const sanitizedApplication = sanitizeOutput(savedApplication.toObject(), [
            '_id',
            'jobTitle',
            'companyName',
            'jobLocation',
            'jobType',
            'salary',
            'status',
            'applicationDate',
            'statusHistory'
        ]);

        res.status(201).json(sanitizedApplication);
    } catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({ message: 'Error creating job application' });
    }
};

// @desc    Get all applications for a user
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
    try {
        const { status, company, sort = '-applicationDate' } = req.query;
        const query = { user: req.user._id };

        if (status) {
            query.status = status;
        }
        if (company) {
            query.companyName = new RegExp(company, 'i');
        }

        const applications = await JobApplication.find(query)
            .sort(sort)
            .exec();

        const sanitizedApplications = applications.map(app => 
            sanitizeOutput(app.toObject(), [
                '_id',
                'jobTitle',
                'companyName',
                'jobLocation',
                'jobType',
                'salary',
                'status',
                'applicationDate',
                'statusHistory'
            ])
        );

        res.json(sanitizedApplications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ message: 'Error fetching job applications' });
    }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplication = async (req, res) => {
    try {
        const application = await JobApplication.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const sanitizedApplication = sanitizeOutput(application.toObject(), [
            '_id',
            'jobTitle',
            'companyName',
            'jobLocation',
            'jobType',
            'salary',
            'originalJobUrl',
            'jobDescription',
            'status',
            'notes',
            'applicationDate',
            'statusHistory',
            'interviews',
            'skills',
            'remote'
        ]);

        res.json(sanitizedApplication);
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({ message: 'Error fetching job application' });
    }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res) => {
    try {
        const application = await JobApplication.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update fields
        const updatableFields = [
            'jobTitle',
            'companyName',
            'jobLocation',
            'jobType',
            'salary',
            'status',
            'notes',
            'interviews',
            'skills',
            'remote'
        ];

        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                application[field] = req.body[field];
            }
        });

        const updatedApplication = await application.save();
        const sanitizedApplication = sanitizeOutput(updatedApplication.toObject(), [
            '_id',
            'jobTitle',
            'companyName',
            'jobLocation',
            'jobType',
            'salary',
            'status',
            'notes',
            'applicationDate',
            'statusHistory',
            'interviews',
            'skills',
            'remote'
        ]);

        res.json(sanitizedApplication);
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({ message: 'Error updating job application' });
    }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
    try {
        const application = await JobApplication.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        await application.remove();
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({ message: 'Error deleting job application' });
    }
};

module.exports = {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication
};