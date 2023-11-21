import Joi = require('joi');

/*
===========================================================================
validationSchemas.ts
- contains Joi schemas for each Mongoose schema
- for verifying new/edit input data w/ Joi prior to sending to Mongoose
===========================================================================
*/

module.exports.guestValidationSchema =  Joi.object({
	guest: Joi.object({
		name: Joi.string().required(),
		type: Joi.string().required(),
		breed: Joi.string().required(),
		// owner is a str as it will be an owner._id reference
		owner: Joi.string().required(),
		age: Joi.number().min(0),
		weight: Joi.number().min(0),
		image: Joi.object().keys({
			url: Joi.string().optional().allow(""),
			filename: Joi.string().optional().allow(""),
		}).optional().allow(""),
		notes: Joi.string().optional().allow(""),
	}).required(),
});

module.exports.clientValidationSchema = Joi.object({
		client: Joi.object({
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			phoneNumber: Joi.string()
				.regex(/^[0-9]{10}$/)
				.messages({
					"string.pattern.base": `Phone number must have 10 digits.`,
				})
				.required(),
			email: Joi.string().optional().allow(""),

			address: Joi.object().keys({
				streetAddress: Joi.string().required(),
				apartment: Joi.string().optional().allow(""),
				city: Joi.string().required(),
				state: Joi.string().required(),
				zip: Joi.number().required(),
			}).required(),

			pets: Joi.array().sparse(),
			accountCredit: Joi.number().min(0),
			accountBalance: Joi.number().min(0),
		}).required(),
})

module.exports.visitValidationSchema = Joi.object({
	visit: Joi.object({
		guest: Joi.string().required(),
		number: Joi.number().required(),
		startDate: Joi.date().required(),
		endDate: Joi.date().greater(Joi.ref("startDate")).required(),
		services: Joi.object().optional(),
		paid: Joi.bool().optional(),
		notes: Joi.string().optional().allow(""),
		checkedIn: Joi.bool().optional(),
		checkedInBy: Joi.string().optional().allow(""),
		checkedOut: Joi.bool().optional(),
		checkedOutBy: Joi.string().optional().allow(""),
		assignedKennel: Joi.string().required(),
		lastAssignedKennel: Joi.string().optional().allow(""),
		kennelUpdatedFlag: Joi.bool().optional(),
	}),
}).options({ stripUnknown: true }); // ignore maps metadata for now

module.exports.employeeValidationSchema = Joi.object({
	employee: Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		phoneNumber: Joi.string()
			.regex(/^[0-9]{10}$/)
			.messages({
				"string.pattern.base": `Phone number must have 10 digits.`,
			})
			.required(),
		email: Joi.string().optional().allow(""),

		address: Joi.object().keys({
			streetAddress: Joi.string().required(),
			apartment: Joi.string().optional().allow(""),
			city: Joi.string().required(),
			state: Joi.string().required(),
			zip: Joi.number().required(),
		}),

		role: Joi.string().required(),
		adminAccess: Joi.bool().optional(),
		username: Joi.string().required(),
		resetPasswordToken: Joi.string().optional().allow(""),
		resetPasswordExpires: Joi.string().optional().allow(""),
	}),
}).options({ stripUnknown: true }); // password will not have been hashed/salted yet; ignore it

module.exports.serviceValidationSchema = Joi.object({
	service: Joi.object({
		petType: Joi.string().required(),
		name: Joi.string().required(),
		price: Joi.number().required(),
		description: Joi.string().optional().allow(""),
		serviceType: Joi.string().required(),
	})
});

module.exports.kennelValidationSchema = Joi.object({
	kennel: Joi.object({
		kennel_id: Joi.string().required(),
		size: Joi.string().required(),
		// occupant is a str as it will be an guest._id reference
		occupant: Joi.string().optional().allow(""),
	}),
});