import { Request, Response, NextFunction } from "express";
import AppError = require("../../utils/appError");
import { stateInfo } from "../../utils/staticData";
import Employee  = require("../../models/employee.model");

/*
===========================================================================
employees.controller.ts
- methods containing route logic for export
- coverage: employee-model CUD; R is a tab on index @ admin.controller
===========================================================================
*/

// employee records route constants
const employeesDir = "employee/records/employees";
const title = "PetResort · Employee Records";

// registration of new employees - form entry
module.exports.renderNewForm = 
    (req: Request, res: Response) => {
        var breadcrumbs = req.session.breadcrumbs;
        var data = { title, breadcrumbs };
        req.session.activeAdminTab = "employees";
        res.render(employeesDir + "/new", { ...data, stateInfo });
    };

// registration of new employees - add on server
module.exports.createEmployee =
    async (req: Request, res: Response, next: NextFunction) => {
        req.session.activeAdminTab = "employees";
        const { username, password } = req.body;
        const newEmployee = new Employee(req.body.employee);
        const registeredNewEmployee = await Employee.register(newEmployee, password);

        if (registeredNewEmployee) {
            req.flash("success", "Successfully registered new Employee.");
            res.redirect("/admin");
        } else {
            req.flash("error", "Unable to register employee.");
            res.redirect(employeesDir + "/new");
        }
    };

// employee records: view single record details
module.exports.showDetails =
    async (req: Request, res: Response, next: NextFunction) => {
        req.session.activeAdminTab = "employees";
		const { id } = req.params;
		const employee = await Employee.findById(id)
			.populate("address")
		if (!employee) {
			req.flash("error", `Couldn't find that employee.`);
			return res.redirect("/admin");
		} else {
            var recordName = employee.firstName + ' ' + employee.lastName;
            var breadcrumbs = req.session.breadcrumbs;
			var data = { title, employee, stateInfo, recordName, breadcrumbs };
			res.render(employeesDir + "/details", { ...data });
		}
	};

// employee records: update single record - form entry
module.exports.renderEditForm =
    async (req: Request, res: Response, next: NextFunction) => {
        const title = "PetResort · Employee Records";
        req.session.activeAdminTab = "employees";
        const { id } = req.params;
        const employee = await Employee.findById(id)
        if (!employee) {
            req.flash("error", `Couldn't find that employee.`);
            return res.redirect("/admin");
        } else {
            var recordName = employee.firstName + " " + employee.lastName;
            var breadcrumbs = req.session.breadcrumbs;
            var data = { title, employee, stateInfo, recordName, breadcrumbs };
            res.render(employeesDir + "/edit", { ...data });
        }
    };

// employee records: update single record - edit on server
module.exports.updateEmployee =
    async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const employee = await Employee.findByIdAndUpdate(id, req.body.employee, {
			runValidators: true,
			new: true,
		});
		if (employee) {
			req.flash("success", "Successfully updated employee.");
			res.redirect(`/employee-records/${employee._id}`);
		}
	};

// employee records: delete single record
module.exports.deleteEmployee =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) {
            throw new AppError(404);
            } else {
                req.flash("success", "Successfully deleted Employee.");
                req.session.activeAdminTab = "employees";
                res.redirect(`/admin`);
            }
    };
