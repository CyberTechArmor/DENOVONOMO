'use strict';

/**
 * Returns Express middleware that validates req.body against a schema object.
 *
 * Schema format:
 * {
 *   fieldName: {
 *     required: boolean,
 *     type: 'string' | 'number' | 'boolean' | 'object' | 'array',
 *     minLength: number,    // for strings
 *     maxLength: number,    // for strings
 *     min: number,          // for numbers
 *     max: number,          // for numbers
 *   }
 * }
 *
 * @param {object} schema - Validation schema
 * @returns {Function} Express middleware
 */
function validate(schema) {
  return (req, res, next) => {
    const errors = [];
    const body = req.body || {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];

      // Check required
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      // Skip further checks if value is not present and not required
      if (value === undefined || value === null) {
        continue;
      }

      // Check type
      if (rules.type) {
        if (rules.type === 'array') {
          if (!Array.isArray(value)) {
            errors.push(`${field} must be an array`);
            continue;
          }
        } else if (typeof value !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
          continue;
        }
      }

      // String validations
      if (typeof value === 'string') {
        if (rules.minLength !== undefined && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }
        if (rules.maxLength !== undefined && value.length > rules.maxLength) {
          errors.push(`${field} must be at most ${rules.maxLength} characters`);
        }
      }

      // Number validations
      if (typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push(`${field} must be at most ${rules.max}`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
}

module.exports = { validate };
