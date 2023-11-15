import { Request, Response, NextFunction } from "express";
import { Guest } from "../models/guest.model";

/*
===========================================================================
index.controller.ts
- methods containing route logic for export
===========================================================================
*/

// home page
module.exports.showHome = 
    (req: Request, res: Response) => {
        const title = "Pet Resort · Home";
        const user = "NONE";
        const data = { title, user };
        res.render("home", { ...data });
    };

// employee dashbaord
module.exports.empDashboard = 
    async (req: Request, res: Response, next: NextFunction) => {
        //const title = "Pet Resort · Employee Dashboard";
        const title = "Pet Resort · Guest Records";
        var activeGuestsTab = res.locals.activeGuestsTab
                            ? res.locals.activeGuestsTab
                            : "current";
        var user = "employee";
        var adminAccess: boolean = true;
        //var data = { title, user, adminAccess };
        //res.render("employee/dashboard", { ...data });
        const guests = await Guest.find({})
					.populate("owner")
					.populate("visits");
		var data = { title, user, guests, activeGuestsTab };
        res.render("employee/records/guests/index", { ...data });
    };

// employee login - form entry
module.exports.renderLoginForm = 
    (req: Request, res: Response) => {
        const title = "Pet Resort · Employee Login";
        var user = "employee";
        var data = { title, user };
        res.render("employee/login", { ...data });
    };

// employee login - authentication
module.exports.loginEmployee = 
    (req: Request, res: Response) => {
        req.flash("success", "Welcome back!");
        const redirectUrl = res.locals.returnTo;
        if (redirectUrl) {
            res.redirect(redirectUrl);
        } else {
            res.redirect("/employee");
        }
    };

// employee logout
module.exports.logoutEmployee =
    (req: Request, res: Response, next: NextFunction) => {
        req.logout(function (err) {
            if (err) return next(err);
            req.flash("success", "Goodbye!");
            res.redirect("/employee");
        });
    };

// customer portal
module.exports.customerHome = 
    (req: Request, res: Response) => {
        const title = "Pet Resort · Customer Home";
        var user = "customer";
        var data = { title, user };
        res.render("customer/customerPortal", { ...data });
    };
