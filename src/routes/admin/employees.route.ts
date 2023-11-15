import express = require("express");
import catchAsync = require("../../utils/catchAsync");
import { validateEmployee } from "../../validationFunctions";
const employees = require("../../controllers/admin/employees.controller");
const { isLoggedIn } = require("../../middleware");

/*
===========================================================================
employee.route.ts
- employee *records* routes; admin-access only
===========================================================================
*/

const router = express.Router();

// require login for all employee records routes
router.all('*', isLoggedIn)

// registration of new employees - form entry
router.get("/new", employees.renderNewForm);

// registration of new employees - add on server
router.post("/", validateEmployee, catchAsync(employees.createEmployee));

router.route("/:id")
	// employee records: view single record details
	.get(catchAsync(employees.showDetails))
	// employee records: update single record - edit on server
	.put(validateEmployee, catchAsync(employees.updateEmployee))
    // employee records: delete single record
    .delete(catchAsync(employees.deleteEmployee));

// employee records: update single record - form entry
router.get("/:id/edit", catchAsync(employees.renderEditForm));

module.exports = router;