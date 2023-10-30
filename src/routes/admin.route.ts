
import express = require("express");
import { Request, Response, NextFunction } from "express";
//import { Employee } from "../models/employee.model";
import Employee = require("../models/employee.model");
import { stateInfo } from "../utils/staticData";
import catchAsync = require("../utils/catchAsync");
import passport = require("passport");
const { isLoggedIn } = require("../middleware");

/*
===========================================================================
admin.route.ts
- 
===========================================================================
*/

const router = express.Router();
const adminDir = "employee/admin";
var user = "employee";
var adminAccess: boolean = true;


// administration
router.get("/", isLoggedIn, (req: Request, res: Response) => {
    const title = "Pet Resort · Admin";
    var data = { title, user, adminAccess };
    res.render(adminDir + "/adminHome", { ...data });
});

// registration of new employees - form entry
router.get("/registerEmployee", isLoggedIn, (req: Request, res: Response) => {
    const title = "Pet Resort · Admin";
    var data = { title, user, adminAccess };
    res.render(adminDir + "/registerEmployee", { ...data, stateInfo });
})

// registration of new employees - add on server
router.post('/registerEmployee', isLoggedIn, // NEED TO ADD JOI VALIDATE EMPLOYEE FUNC ()
    catchAsync(async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            const newEmployee = new Employee(req.body.employee);
            const registeredNewEmployee = await Employee.register(newEmployee, password);
            console.log(registeredNewEmployee);
            req.flash("success", "Successfully registered new employee.");
            res.redirect("/admin");
        } catch (err) {
            req.flash("error", (err as Error).message);
            res.redirect('/admin/registerEmployee')
        }
}))

module.exports = router;