import { Request, Response, NextFunction } from "express";
const {
	guestValidationSchema,
	clientValidationSchema,
	visitValidationSchema,
	employeeValidationSchema,
	serviceValidationSchema,
	kennelValidationSchema
} = require("./validationSchemas");
import AppError = require("./utils/appError");
import Joi = require("joi");

/*
===========================================================================
validationFunctions.ts
- creates + exports funcs for each Mongoose schema
- for verifying new/edit input data w/ Joi prior to sending to Mongoose
===========================================================================
*/

const createValidateFunc = (schema: Joi.ObjectSchema) => {
	return function (req: Request, res: Response, next: NextFunction) {
		const { error } = schema.validate(req.body);
		if (error) {
			const msg = error.details
				.map((element: any) => element.message)
				.join(",");
			throw new AppError(400, msg);
		} else {
			next();
		}
	};
};

const validateGuest = createValidateFunc(guestValidationSchema);
const validateClient = createValidateFunc(clientValidationSchema);
const validateVisit = createValidateFunc(visitValidationSchema);
const validateEmployee = createValidateFunc(employeeValidationSchema);
const validateService = createValidateFunc(serviceValidationSchema);
const validateKennel = createValidateFunc(kennelValidationSchema);

export {
	validateGuest,
	validateClient,
	validateVisit,
	validateEmployee,
	validateService,
	validateKennel,
};