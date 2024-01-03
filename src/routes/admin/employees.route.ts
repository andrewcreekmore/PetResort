import express = require("express");
import catchAsync = require("../../utils/catchAsync");
import { validateEmployee } from "../../validationFunctions";
const employees = require("../../controllers/admin/employees.controller");
const { isLoggedIn, isAdmin } = require("../../middleware");

/*
===========================================================================
employee.route.ts
- employee record CRUD routes; admin-access only
===========================================================================
*/

const router = express.Router();
const path = '/employee-records'

// require login for all employee records routes
router.all('*', isLoggedIn)

// registration of new employees - form entry
router.get("/new", isAdmin, employees.renderNewForm);

// registration of new employees - add on server
router.post("/", isAdmin, validateEmployee, catchAsync(employees.createEmployee));

router.route("/:id")
	// employee records: view single record details
	.get(isAdmin, catchAsync(employees.showDetails))
	// employee records: update single record - edit on server
	.put(isAdmin, validateEmployee, catchAsync(employees.updateEmployee))
	// employee records: delete single record
	.delete(isAdmin, catchAsync(employees.deleteEmployee));

// employee records: update single record - form entry
router.get("/:id/edit", isAdmin, catchAsync(employees.renderEditForm));

module.exports = { router, path };