import express = require("express");
import passport = require("passport");
const { isLoggedIn, storeReturnTo } = require("../middleware");
const index = require("../controllers/index.controller");
import catchAsync = require("../utils/catchAsync");

/*
===========================================================================
index.route.ts
- 
===========================================================================
*/

// init router
const router = express.Router();
const path = '/';

// index route constants
const authOptions = { failureFlash: true, failureRedirect: "/login" };

// home page
router.get("/", index.showHome);

// employee dashboard
router.get("/dashboard", isLoggedIn, catchAsync(index.empDashboard));

router.route("/login")
	// employee login - form entry
	.get(storeReturnTo, index.renderLoginForm)
	// employee login - authentication
	.post(
		storeReturnTo,
		passport.authenticate("local", authOptions),
		index.loginEmployee
	);

// employee logout
router.get("/logout", index.logoutEmployee);

module.exports = { router, path };