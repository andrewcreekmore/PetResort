import { Request, Response, NextFunction } from "express";
import AppError = require("./appError");

/*
===========================================================================
catchAsync.ts
- error-catching wrapper for async functions
===========================================================================
*/

export = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
			fn(req, res, next).catch(next);
		};
}
