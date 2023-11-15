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
- contains funcs for each Mongoose schema
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

// for (var i = 0; i < Object.keys(modelNameToSchemaMap).length; i++) {

// 	var funcName = `validate${modelName}`
// }

// const validateGuest = (req: Request, res: Response, next: NextFunction) => {
// 	const { error } = guestValidationSchema.validate(req.body);
// 	if (error) {
// 		const msg = error.details.map((element: any) => element.message).join(",");
// 		throw new AppError(400, msg);
// 	} else {
// 		next();
// 	}
// };

// const validateClient = (req: Request, res: Response, next: NextFunction) => {
// 	const { error } = clientValidationSchema.validate(req.body);
// 	if (error) {
// 		const msg = error.details.map((element: any) => element.message).join(",");
// 		throw new AppError(400, msg);
// 		console.log(error);
// 	} else {
// 		next();
// 	}
// };

// const validateVisit = (req: Request, res: Response, next: NextFunction) => {
// 	const { error } = visitValidationSchema.validate(req.body);
// 	if (error) {
// 		const msg = error.details.map((element: any) => element.message).join(",");
// 		throw new AppError(400, msg);
// 	} else {
// 		next();
// 	}
// };

// const validateEmployee = (req: Request, res: Response, next: NextFunction) => {
// 	const { error } = employeeValidationSchema.validate(req.body);
// 	if (error) {
// 		const msg = error.details.map((element: any) => element.message).join(",");
// 		throw new AppError(400, msg);
// 	} else {
// 		next();
// 	}
// };

// const validateService= (req: Request, res: Response, next: NextFunction) => {
// 	const { error } = serviceValidationSchema.validate(req.body);
// 	if (error) {
// 		const msg = error.details.map((element: any) => element.message).join(",");
// 		throw new AppError(400, msg);
// 	} else {
// 		next();
// 	}
// };

// const validateKennel = (req: Request, res: Response, next: NextFunction) => {
// 	const { error } = kennelValidationSchema.validate(req.body);
// 	if (error) {
// 		const msg = error.details.map((element: any) => element.message).join(",");
// 		throw new AppError(400, msg);
// 	} else {
// 		next();
// 	}
// };

export {
	validateGuest,
	validateClient,
	validateVisit,
	validateEmployee,
	validateService,
	validateKennel,
};