import { Request, Response, NextFunction } from "express";
import { Guest } from "../models/guest.model";
import { Visit } from "../models/visit.model";
import 	{ isFuture } from "date-fns";

/*
===========================================================================
index.controller.ts
- methods containing route logic for export
===========================================================================
*/

// home page
module.exports.showHome = 
    (req: Request, res: Response) => {
        const title = "PetResort · Home";
        const user = "NONE";
        const data = { title, user };
        res.render("home", { ...data });
    };

// employee dashbaord
module.exports.empDashboard = 
    async (req: Request, res: Response, next: NextFunction) => {
        const title = "PetResort · Employee Dashboard";
        var user = "employee";
        var adminAccess: boolean = true;
        const upcoming = req.query.upcoming || false;

        // pagination
        const page = Number(req.query.p) || 1;
        const visitsPerPage = 8;

        const allVisits = await Visit.find({})
					.populate([
                        {
                            path: "guest",
                            populate: [
                                {
                                    path: 'owner',
                                    model: 'Client',
                                }
                            ]
                        },
						{
							path: "assignedKennel",
							model: "Kennel",
						},
					])
					.sort({ endDate: -1 })
					.skip((page - 1) * visitsPerPage)
					.limit(visitsPerPage);
        
        // current only (default)
        if (!upcoming) {
            var visits = allVisits.filter((visit) => visit.current);
        } else {
            visits = allVisits.filter((visit) => isFuture(+(visit.startDate)));
        }
        
        const totalVisitCount = visits.length;
        const pageCount = Math.ceil(totalVisitCount / visitsPerPage);
        var data = { title, user, adminAccess, visits, page, pageCount, upcoming };
        res.render("employee/dashboard", { ...data });
    };

// employee login - form entry
module.exports.renderLoginForm = 
    (req: Request, res: Response) => {
        const title = "PetResort · Employee Login";
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
            res.redirect("/dashboard");
        }
    };

// employee logout
module.exports.logoutEmployee =
    (req: Request, res: Response, next: NextFunction) => {
        req.logout(function (err) {
            if (err) return next(err);
            req.flash("success", "Goodbye!");
            res.redirect("/login");
        });
    };

// customer portal
module.exports.customerHome = 
    (req: Request, res: Response) => {
        const title = "PetResort · Customer Home";
        var user = "customer";
        var data = { title, user };
        res.render("customer/customerPortal", { ...data });
    };
