import baseJoi = require('joi');
import sanitizeHTML = require('sanitize-html');

/*
===========================================================================
validationSchemas.ts
- defines + exports Joi schemas for each Mongoose schema
- for verifying new/edit input data w/ Joi prior to sending to Mongoose
===========================================================================
*/

// Joi custom extension to sanitize string inputs
const extension = (Joi: any) => ({
	type: 'string',
	base: Joi.string(),
	messages: {
		'string.escapeHTML': '{{#label}} must not include HTML.'
	},
	rules: {
		escapeHTML: {
			validate(value: string, helpers: any) {
				const clean = sanitizeHTML(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value) return helpers.error('string.escapeHTML', { value })
				return clean;
			}
		}
	}
})

const Joi = baseJoi.extend(extension);

module.exports.guestValidationSchema = Joi.object({
	guest: Joi.object({
		name: Joi.string().required().escapeHTML(),
		type: Joi.string().required().escapeHTML(),
		breed: Joi.string().required().escapeHTML(),
		// owner is a str as it will be an owner._id reference
		owner: Joi.string().required().escapeHTML(),
		age: Joi.number().min(0),
		weight: Joi.number().min(0),
		image: Joi.object()
			.keys({
				url: Joi.string().optional().allow("").escapeHTML(),
				filename: Joi.string().optional().allow("").escapeHTML(),
			})
			.optional()
			.allow(""),
		notes: Joi.string().optional().allow("").escapeHTML(),
	}).required(),
});

module.exports.clientValidationSchema = Joi.object({
	client: Joi.object({
		firstName: Joi.string().required().escapeHTML(),
		lastName: Joi.string().required().escapeHTML(),
		phoneNumber: Joi.string()
			.regex(/^[0-9]{10}$/)
			.messages({
				"string.pattern.base": `Phone number must have 10 digits.`,
			})
			.required()
			.escapeHTML(),
		email: Joi.string().optional().allow("").escapeHTML(),

		address: Joi.object()
			.keys({
				streetAddress: Joi.string().required().escapeHTML(),
				apartment: Joi.string().optional().allow("").escapeHTML(),
				city: Joi.string().required().escapeHTML(),
				state: Joi.string().required().escapeHTML(),
				zip: Joi.number().required(),
			})
			.required(),

		pets: Joi.array().sparse(),
		accountCredit: Joi.number().min(0),
		accountBalance: Joi.number().min(0),
	}).required(),
});

module.exports.visitValidationSchema = Joi.object({
	visit: Joi.object({
		guest: Joi.string().required().escapeHTML(),
		number: Joi.number().required(),
		startDate: Joi.date().required(),
		endDate: Joi.date().greater(Joi.ref("startDate")).required(),
		services: Joi.object().optional(),
		paid: Joi.bool().optional(),
		notes: Joi.string().optional().allow("").escapeHTML(),
		checkedIn: Joi.bool().optional(),
		checkedInBy: Joi.string().optional().allow("").escapeHTML(),
		checkedOut: Joi.bool().optional(),
		checkedOutBy: Joi.string().optional().allow("").escapeHTML(),
		assignedKennel: Joi.string().required().escapeHTML(),
		lastAssignedKennel: Joi.string().optional().allow("").escapeHTML(),
		kennelUpdatedFlag: Joi.bool().optional(),
	}),
}).options({ stripUnknown: true }); // ignore maps metadata

module.exports.employeeValidationSchema = Joi.object({
	employee: Joi.object({
		firstName: Joi.string().required().escapeHTML(),
		lastName: Joi.string().required().escapeHTML(),
		phoneNumber: Joi.string()
			.regex(/^[0-9]{10}$/)
			.messages({
				"string.pattern.base": `Phone number must have 10 digits.`,
			})
			.required()
			.escapeHTML(),
		email: Joi.string().optional().allow("").escapeHTML(),

		address: Joi.object().keys({
			streetAddress: Joi.string().required().escapeHTML(),
			apartment: Joi.string().optional().allow("").escapeHTML(),
			city: Joi.string().required().escapeHTML(),
			state: Joi.string().required().escapeHTML(),
			zip: Joi.number().required(),
		}),

		role: Joi.string().required().escapeHTML(),
		adminAccess: Joi.bool().optional(),
		username: Joi.string().required().escapeHTML(),
		resetPasswordToken: Joi.string().optional().allow("").escapeHTML(),
		resetPasswordExpires: Joi.string().optional().allow("").escapeHTML(),
	}),
}).options({ stripUnknown: true }); // password will not have been hashed/salted yet; ignore it

module.exports.serviceValidationSchema = Joi.object({
	service: Joi.object({
		petType: Joi.string().required().escapeHTML(),
		name: Joi.string().required().escapeHTML(),
		price: Joi.number().required(),
		description: Joi.string().optional().allow("").escapeHTML(),
		serviceType: Joi.string().required().escapeHTML(),
	}),
});

module.exports.kennelValidationSchema = Joi.object({
	kennel: Joi.object({
		kennel_id: Joi.string().required().escapeHTML(),
		size: Joi.string().required().escapeHTML(),
		// occupant is a str as it will be an guest._id reference
		occupant: Joi.string().optional().allow("").escapeHTML(),
	}),
});