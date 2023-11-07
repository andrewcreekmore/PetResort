
import express = require("express");
import { Request, Response, NextFunction } from "express";
import AppError = require("../utils/appError");
import Employee  = require('../models/employee.model')
const { IEmployeeDoc } = require('../models/employee.model')
import { Service } from "../models/service.model";
import { stateInfo } from "../utils/staticData";
import catchAsync = require("../utils/catchAsync");
import passport = require("passport");
import async = require('async');
import nodemailer = require('nodemailer');
import crypto = require('crypto');
import { PassportLocalDocument, PassportLocalModel } from "mongoose";
const { isLoggedIn, storeReturnTo, storeActiveTab } = require("../middleware");

/*
===========================================================================
admin.route.ts
- 
===========================================================================
*/

const router = express.Router();
const adminDir = "employee/admin";
const servicesDir = "employee/records/services"
const employeesDir = "employee/records/employees"
var user = "employee";
var adminAccess: boolean = true;

// admin tools index
router.get("/", catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const title = "Pet Resort · Admin";
    var activeTab =  res.locals.activeTab ? res.locals.activeTab : 'dogServices'
    const allServices = await Service.find({});
    const allEmployees = await Employee.find({});
    var data = {
			title,
			user,
			adminAccess,
			allServices,
			allEmployees,
			activeTab,
		};
    res.render(adminDir + "/adminHome", { ...data });
}));

// EMP USER AUTH ROUTES

// reset emp password - form entry (request email with link)
router.get("/forgot", function (req: Request, res: Response) {
    const title = "Pet Resort · Reset Password";
    var data = { title, user };
	res.render(adminDir + "/forgot", { ...data });
});

// reset emp password - send email to user
router.post('/forgot', catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const employee: typeof IEmployeeDoc = await Employee.findOne({ email: req.body.email })
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
}));

// reset emp password - form entry (input new pw)
router.get("/reset/:token", catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const employee = await Employee.findOne(
        { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });

    if (!employee) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/admin/forgot");
    }
    const title = "Pet Resort · Reset Password";
    var token = req.params.token;
    var data = { title, user, token };
    res.render(adminDir + "/reset", { ...data });
}));
						
// reset emp password - edit on server
router.post('/reset/:token', catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
                                res.redirect("/employee");
                            }
                        );
                    }
                });
            });
		} else {
			req.flash("error", "Passwords do not match.");
			return res.redirect("back");
		}
})) 

// reset emp password DIRECTLY (from admin tools emp record) - form entry
router.get('/resetDirect/:id', catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const employee: typeof IEmployeeDoc = await Employee.findById(id);
    if (!employee) {
        req.flash('error', 'Employee not found.');
        return res.redirect(`/admin/employee-records/${id}`);
    } else {
			const title = "Pet Resort · Reset Password";
			var data = { title, user, employee };
			res.render(adminDir + "/resetDirect", { ...data });
		}
}))

// reset emp password DIRECTLY (from admin tools emp record) - edit on server
router.post('/resetDirect/:id', catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
                        res.redirect("/employee");
                    });
                }
            });
        });
		} else {
			req.flash("error", "Passwords do not match.");
			return res.redirect("back");
		}
}))

// EMPLOYEE CRUD ROUTES

// registration of new employees - form entry
router.get("/employee-records/new", (req: Request, res: Response) => {
	const title = "Pet Resort · Admin";
	var data = { title, user, adminAccess };
	res.render(employeesDir + "/new", { ...data, stateInfo });
});

// registration of new employees - add on server
router.post("/employee-records", // NEED TO ADD JOI VALIDATE EMPLOYEE FUNC ()
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
            const newEmployee = new Employee(req.body.employee);
            const registeredNewEmployee = await Employee.register(newEmployee, password);
            // log in as newly created user
            req.login(registeredNewEmployee, err => {
                if (err) return next(err);
                req.flash("success", "Successfully registered new Employee.");
                req.session.activeTab = 'employees';
                res.redirect("/admin");
            });
        } catch (err) {
            //req.flash("error", (err as Error).message);
            //res.redirect(employeesDir + "/new");
            throw new AppError(400, (err as Error).message);
        }
}))

// employee records: view single record details
router.get(
	"/employee-records/:id",
	catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const title = "Pet Resort · Employee Records";
		var user = "employee";
        req.session.activeTab = "employees";
		const { id } = req.params;
		const employee = await Employee.findById(id)
			.populate("address")
		if (!employee) {
			req.flash("error", `Couldn't find that employee.`);
			return res.redirect("/admin");
		} else {
			var data = { title, user, employee };
			res.render(employeesDir + "/details", { ...data });
		}
	})
);

// employee records: update single record - form entry
router.get(
    "/employee-records/:id/edit",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const title = "Pet Resort · Employee Records";
        var user = "employee";
        req.session.activeTab = "employees";
        const { id } = req.params;
        const employee = await Employee.findById(id)
        if (!employee) {
            req.flash("error", `Couldn't find that employee.`);
            
            return res.redirect("/admin");
        } else {
            var data = { title, user, employee, stateInfo };
            res.render(employeesDir + "/edit", { ...data });
        }
    })
);

// employee records: update single record - edit on server
router.put(
	"/employee-records/:id",
	// NEED TO ADD JOI VALIDATE EMPLOYEEE FUNC
	catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const employee = await Employee.findByIdAndUpdate(id, req.body.employee, {
			runValidators: true,
			new: true,
		});
		if (employee) {
			req.flash("success", "Successfully updated employee.");
			res.redirect(`/admin/employee-records/${employee._id}`);
		}
	})
);

// employee records: delete single record
router.delete(
    "/employee-records/:id",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) {
            throw new AppError(404);
            } else {
                req.flash("success", "Successfully deleted Employee.");
                req.session.activeTab = "employees";
                res.redirect(`/admin`);
            }
    })
);

// SERVICE RECORDS

// add new service - form entry
router.get("/service-records/new", (req: Request, res: Response) => {
    const title = "Pet Resort · Admin";
    const petType = JSON.stringify(req.query.petType);
    var data = { title, user, adminAccess, petType };
    req.session.activeTab = petType === "cat" ? "catServices" : "dogServices";
    res.render(servicesDir + "/new", { ...data });
})

// service records: create new record - add on server
router.post(
	"/service-records",
	// NEED TO ADD VALIDATESERVICE FUNC CALL (JOI)
	catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const newService = new Service(req.body.service);
		if (newService) {
			await newService.save();
			req.flash("success", "Successfully added new Service.");
            req.session.activeTab = newService.petType === 'cat' ? 'catServices' : 'dogServices';
			res.redirect(`/admin`);
		} else {
			throw new AppError(400);
		}
	})
);

// service records: update single record - form entry
router.get(
    "/service-records/:id/edit",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const title = "Pet Resort · Service Records";
        var user = "employee";
        const { id } = req.params;
        const service = await Service.findById(id)
        if (!service) {
            req.flash("error", `Couldn't find that service.`);
            return res.redirect("/admin");
        } else {
            var data = { title, user, service };
            req.session.activeTab = service.petType === "cat" ? "catServices" : "dogServices";
            res.render(servicesDir + "/edit", { ...data });
        }
    })
);

// service records: update single record - edit on server
router.put(
    "/service-records/:id", // NEED TO ADD VALIDATESERVICE FUNC CALL (JOI)
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const service = await Service.findByIdAndUpdate(
            id,
            req.body.service,
            {
                runValidators: true,
                new: true,
            }
        );
        if (service) {
            req.flash('success', 'Successfully updated Service.')
            req.session.activeTab = service.petType === "cat" ? "catServices" : "dogServices";
            res.redirect(`/admin`);
        }
    })
);

// service records: delete single record
router.delete(
    "/service-records/:id",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) {
            throw new AppError(404);
        } else {
            req.flash("success", "Successfully deleted Service.");
            req.session.activeTab = deletedService.petType === "cat" ? "catServices" : "dogServices";
            res.redirect(`/admin`);
        }
    })
);

module.exports = router;