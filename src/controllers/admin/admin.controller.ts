import { Request, Response, NextFunction } from "express";
import { Service } from "../../models/service.model";
import Employee = require("../../models/employee.model");
const { IEmployeeDoc } = require("../../models/employee.model");
import { IKennelDoc, Kennel } from "../../models/kennel.model";
import nodemailer = require("nodemailer");
import crypto = require("crypto");

/*
===========================================================================
admin.controller.ts
- methods containing route logic for export
- coverage: admin tools index + password reset functions (employee, admin direct)
===========================================================================
*/

// admin route constants
const adminDir = "employee/admin";

// for ajax setting of activeAdminTab
module.exports.setActiveTab =
    (req: Request, res: Response, next: NextFunction) => {
        req.session.activeAdminTab = req.body.activeAdminTab;
        res.send(`activeTab set to ${req.session.activeAdminTab}`);
    }

// admin tools index/home
module.exports.index = 
    async (req: Request, res: Response, next: NextFunction) => {
			const title = "PetResort · Admin";
            var activeAdminTab = res.locals.activeAdminTab
                                        ? res.locals.activeAdminTab
                                        : "employees";

			const occupiedOnly: boolean = Boolean(req.query.occupied) || false;

			// pagination
            var page = Number(req.query.p) || 1;
			const itemsPerPage = 8;

            const totalDogServiceCount = await Service.count( { petType: 'dog' });
            const dogServices = await Service.find({ petType: 'dog'})
                .sort({ displayOrder: 1, price: 1 })
				.skip((page - 1) * itemsPerPage)
				.limit(itemsPerPage);
            const totalCatServiceCount = await Service.count( { petType: 'cat' });
            const catServices = await Service.find({ petType: "cat" })
                .sort({ displayOrder: 1, price: 1 })
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage);
            const totalEmployeeCount = await Employee.count({});
			const allEmployees = await Employee.find({})
				.skip((page - 1) * itemsPerPage)
				.limit(itemsPerPage);

            if (!occupiedOnly) {
                var totalKennelCount = await Kennel.count({});
                var kennels = await Kennel.find({})
                    .populate("occupant")
                    .skip((page - 1) * itemsPerPage)
                    .limit(itemsPerPage);
            } else { // occupied kennels only

                function compareFn(a: IKennelDoc, b: IKennelDoc) {
                    if (a.occupant) return 1;
                    else if (b.occupant) return -1;
                    return 0;
                }

                var unlimitedKennels = await Kennel.find({}).populate("occupant");
                var sortedKennels = unlimitedKennels.sort(compareFn);
				var occupiedKennels = sortedKennels.filter((kennel) => kennel.occupant);

                kennels = await Kennel.find({
									_id: { $in: occupiedKennels },
								})
                    .populate("occupant")
                    .skip((page - 1) * itemsPerPage)
                    .limit(itemsPerPage);
                
                totalKennelCount = kennels.length;
            }

			const kennelsPageCount = Math.ceil(totalKennelCount / itemsPerPage);
			const employeesPageCount = Math.ceil(totalEmployeeCount / itemsPerPage);
			const catServicesPageCount = Math.ceil(totalCatServiceCount / itemsPerPage);
			const dogServicesPageCount = Math.ceil(totalDogServiceCount / itemsPerPage);

			var data = {
				title,
				dogServices,
                catServices,
				allEmployees,
				kennels,
				activeAdminTab,
				occupiedOnly,
				page,
				kennelsPageCount,
				dogServicesPageCount,
				catServicesPageCount,
				employeesPageCount,
			};
			res.render(adminDir + "/adminHome", { ...data });
		}

// reset emp password - form entry (request email with link)
module.exports.renderForgotForm = 
    (req: Request, res: Response) => {
        const title = "PetResort · Reset Password";
        var data = { title };
        res.render(adminDir + "/forgot", { ...data });
    };

// reset emp password - send email to user
module.exports.emailResetToken =
    async (req: Request, res: Response, next: NextFunction) => {
        const employee: typeof IEmployeeDoc = await Employee.findOne({
                email: req.body.email,
            });
        if (!employee) {
            req.flash("error", "No account with that email address exists.");
            return res.redirect("/admin/forgot");
        } else {

            var token = crypto.randomBytes(20).toString('hex')
            employee.resetPasswordToken = token;
            employee.resetPasswordExpires = Date.now() + 3600000; // 1 hr
            await employee.save();

            var smtpTransport = nodemailer.createTransport({
                        host: "smtp.zoho.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: "petresort@zohomail.com",
                            pass: process.env.ZOHO_PW
                        },
                    });
            var mailOptions = {
                to: employee.email,
                from: "petresort@zohomail.com",
                subject: "PetResort Employee Password Reset",
                text:
                    "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                    "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
                    "http://" +
                    req.headers.host +
                    "/admin/reset/" +
                    token +
                    "\n\n" +
                    "If you did not request this, please ignore this email and your password will remain unchanged.\n",
            };

            smtpTransport.verify(function (err, success) {
                if (err) {
                console.log(err);
                } else {
                    //console.log("Server is ready to take our messages");
                    smtpTransport.sendMail(mailOptions, function(err) {
                    //console.log('mail sent!')
                    req.flash('success', 'An e-mail has been sent to ' + employee.email + ' with further instructions.');
                    res.redirect('/admin/forgot')
                })
                }
            })
        }
    };

// reset emp password - form entry (input new pw)
module.exports.renderResetPasswordForm =
    async (req: Request, res: Response, next: NextFunction) => {
        const employee = await Employee.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!employee) {
            req.flash("error", "Password reset token is invalid or has expired.");
            return res.redirect("/admin/forgot");
        }
        const title = "PetResort · Reset Password";
        var token = req.params.token;
        var data = { title, token };
        res.render(adminDir + "/reset", { ...data });
    };


// reset emp password - edit on server
module.exports.resetPassword =
    async (req: Request, res: Response, next: NextFunction) => {
        const employee = await Employee.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() },
            });
        if (!employee) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
        }
        if (req.body.password === req.body.passwordConfirm) {
                employee.setPassword(req.body.password, function() {
                    employee.resetPasswordToken = undefined;
                    employee.resetPasswordExpires = undefined;
                    // save updated pw + login user
                    employee.save();
                    req.login(employee, (err) => {
                        if (err) return next(err);
                    });

                    // send email confirmation of pw change
                    var smtpTransport = nodemailer.createTransport({
                        host: "smtp.zoho.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: "petresort@zohomail.com",
                            pass: process.env.ZOHO_PW,
                        },
                    });
                    var mailOptions = {
                        to: employee.email,
                        from: "petresort@zohomail.com",
                        subject: "Your password has been updated",
                        text:
                            "Hello,\n\n" +
                            "This is a confirmation that the password for your account " +
                            employee.email +
                            " has just been changed.\n",
                    };
                    smtpTransport.verify(function (err, success) {
                        if (err) {
                            console.log(err);
                        } else {
                            //console.log("Server is ready to take our messages");
                            smtpTransport.sendMail(
                                mailOptions,
                                function (err) {
                                    //console.log("mail sent!");
                                    req.flash(
                                        "success",
                                        "Your password has been successfully updated."
                                    );
                                    res.redirect("/dashboard");
                                }
                            );
                        }
                    });
                });
            } else {
                req.flash("error", "Passwords do not match.");
                return res.redirect("back");
            }
    }

// admin reset emp password DIRECTLY (from admin tools emp record) - form entry
module.exports.renderDirectResetPasswordForm =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const employee: typeof IEmployeeDoc = await Employee.findById(id);
        if (!employee) {
            req.flash('error', 'Employee not found.');
            return res.redirect(`/admin/employee-records/${id}`);
        } else {
                const title = "PetResort · Reset Password";
                var breadcrumbs: Array<any> = req.session.breadcrumbs;
                breadcrumbs[0].breadcrumbName = 'adminPasswordReset';
                var recordName = employee.fullName;
                var data = { title, employee, breadcrumbs, recordName };
                res.render(adminDir + "/resetDirect", { ...data });
            }
};

// admin reset emp password DIRECTLY (from admin tools emp record) - edit on server
module.exports.directResetPassword =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const employee: typeof IEmployeeDoc = await Employee.findById(id);
        if (!employee) {
            req.flash("error", "Employee not found.");
            return res.redirect(`/admin/employee-records/${id}`);
        }
        if (req.body.password === req.body.passwordConfirm) {
            // call setPassword with cb func
            employee.setPassword(req.body.password, function() {
                // save updated pw
                employee.save();
                // send email confirmation of pw change
                var smtpTransport = nodemailer.createTransport({
                    host: "smtp.zoho.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: "petresort@zohomail.com",
                        pass: process.env.ZOHO_PW,
                    },
                });
                var mailOptions = {
                    to: employee.email,
                    from: "petresort@zohomail.com",
                    subject: "Your password has been updated",
                    text:
                        "Hello,\n\n" +
                        "This is a confirmation that the password for your account " +
                        employee.email +
                        " has just been changed.\n",
                };
                smtpTransport.verify(function (err, success) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log("Server is ready to take our messages");
                        smtpTransport.sendMail(mailOptions, function (err) {
                            //console.log("mail sent!");
                            req.flash(
                                "success",
                                employee.fullName + "'s password has been successfully updated."
                            );
                            res.redirect("/admin");
                        });
                    }
                });
            });
            } else {
                req.flash("error", "Passwords do not match.");
                return res.redirect("back");
            }
    }