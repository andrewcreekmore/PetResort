
import express = require("express");
import { Request, Response, NextFunction } from "express";
import AppError = require("../utils/appError");
import Employee = require("../models/employee.model");
import { Service } from "../models/service.model";
import { stateInfo } from "../utils/staticData";
import catchAsync = require("../utils/catchAsync");
import passport = require("passport");
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
    //var activeTab =  res.locals.activeTab ? res.locals.activeTab : 'dogServices'
    var activeTab = 'dogServices'
    if (res.locals.activeTab) {
        console.log(res.locals.activeTab)
        activeTab = res.locals.activeTab
    }
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