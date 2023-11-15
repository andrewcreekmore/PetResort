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

// index route constants
const authOptions = { failureFlash: true, failureRedirect: "/login" };

// home page
router.get("/", index.showHome);

// employee dashboard
router.get("/employee", isLoggedIn, catchAsync(index.empDashboard));

router.route("/login")
	// employee login - form entry
	.get(index.renderLoginForm)
	// employee login - authentication
	.post(
		storeReturnTo,
		passport.authenticate("local", authOptions),
		index.loginEmployee
	);

// employee login - form entry
router.get("/login", index.renderLoginForm);

// employee logout
router.get("/logout", index.logoutEmployee);

// customer portal
router.get("/customer", index.customerHome);

module.exports = router;