import { Request, Response, NextFunction } from "express";
import AppError = require("../../utils/appError");
import { Kennel } from "../../models/kennel.model";

/*
===========================================================================
kennels.controller.ts
- methods containing route logic for export
===========================================================================
*/

// kennel records route constants
const kennelsDir = "employee/records/kennels";
var user = "employee";
var adminAccess: boolean = true;
