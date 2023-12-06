import express = require("express");
import { Request, Response, NextFunction } from "express";
import AppError = require("../../utils/appError");
const Service = require("../../models/service.model");
const services = require("../../controllers/admin/services.controller");
import { validateService } from "../../validationFunctions";
import catchAsync = require("../../utils/catchAsync");
const { isLoggedIn, isAdmin } = require("../../middleware");

/*
===========================================================================
service.route.ts
- 
===========================================================================
*/

// init router
const router = express.Router();
const path = '/service-records'

// require login for all service records routes
router.all('*', isLoggedIn)

// add new service - form entry
router.get("/new", isAdmin, services.renderNewForm);

// service records: create new record - add on server
router.post("/", isAdmin, validateService, catchAsync(services.createService));

// service records: update single record - form entry
router.get("/:id/edit", isAdmin, catchAsync(services.renderEditForm));

router
	.route("/:id")
	// service records: update single record - edit on server
	.put(isAdmin, validateService, catchAsync(services.updateService))
	// service records: delete single record
	.delete(isAdmin, catchAsync(services.deleteService));

module.exports = { router, path };
