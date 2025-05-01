const { validationResult } = require('express-validator');

const validate = validations => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // Format errors
        const formattedErrors = errors.array().reduce((acc, error) => {
            if (!acc[error.param]) {
                acc[error.param] = [];
            }
            acc[error.param].push(error.msg);
            return acc;
        }, {});

        return res.status(400).json({
            message: 'Validation failed',
            errors: formattedErrors
        });
    };
};

const sanitizeOutput = (data, allowedFields) => {
    if (Array.isArray(data)) {
        return data.map(item => sanitizeOutput(item, allowedFields));
    }

    if (typeof data !== 'object' || data === null) {
        return data;
    }

    const sanitized = {};
    allowedFields.forEach(field => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            if (data[parent]) {
                if (!sanitized[parent]) {
                    sanitized[parent] = {};
                }
                sanitized[parent][child] = data[parent][child];
            }
        } else if (data[field] !== undefined) {
            sanitized[field] = data[field];
        }
    });

    return sanitized;
};

const escapeRegex = (string) => {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

module.exports = {
    validate,
    sanitizeOutput,
    escapeRegex
};