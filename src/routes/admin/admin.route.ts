
import express = require("express");
const admin = require("../../controllers/admin/admin.controller");
import catchAsync = require("../../utils/catchAsync");
const { isLoggedIn }  = require("../../middleware");

/*
===========================================================================
admin.route.ts
- admin index routes - admin tools page, ajax setting of activeTab
- also includes password reset (by user and directly by admin) func routes
===========================================================================
*/

// init router
const router = express.Router();
const path = '/admin';

// for ajax setting of activeAdminTab
router.post("/setActiveTab", admin.setActiveTab);

// admin tools index
router.get("/", isLoggedIn, catchAsync(admin.index));

router.route("/forgot")
	// reset emp password - form entry (request email with link)
	.get(admin.renderForgotForm)
	// reset emp password - send email to user
	.post(catchAsync(admin.emailResetToken));

router.route("/reset/:token")
	// reset emp password - form entry (input new pw)
	.get(catchAsync(admin.renderResetPasswordForm))
    // reset emp password - edit on server
    .post(catchAsync(admin.resetPassword)); 				

router.route("/resetDirect/:id")
    // admin reset emp password DIRECTLY (from admin tools emp record) - form entry
    .get(catchAsync(admin.renderDirectResetPasswordForm))
    // admin reset emp password DIRECTLY (from admin tools emp record) - edit on server
    .post(catchAsync(admin.directResetPassword));

module.exports = { router, path };