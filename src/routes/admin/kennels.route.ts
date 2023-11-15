import express = require("express");
import catchAsync = require("../../utils/catchAsync");
import { validateKennel } from "../../validationFunctions";
const kennels = require("../../controllers/admin/kennels.controller");
const { isLoggedIn } = require("../../middleware");

/*
===========================================================================
employee.route.ts
- employee *records* routes; admin-access only
===========================================================================
*/

const router = express.Router();

module.exports = router;