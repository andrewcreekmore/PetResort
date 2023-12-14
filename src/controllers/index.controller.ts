import { Request, Response, NextFunction } from "express";
import { Visit } from "../models/visit.model";

/*
===========================================================================
index.controller.ts
- methods containing route logic for export
- coverage: home page, employee dashboard, login/out + auth
===========================================================================
*/

// home page
module.exports.showHome = 
    (req: Request, res: Response) => {
        const title = "PetResort · Home";
        const data = { title };
        req.session.returnTo = '/';
        res.render("home", { ...data });
    };

// employee dashbaord
module.exports.empDashboard = 
    async (req: Request, res: Response, next: NextFunction) => {
        const title = "PetResort · Employee Dashboard";
        var adminAccess: boolean = true;
        const upcoming = req.query.upcoming || false;

        // pagination
        const page = Number(req.query.p) || 1;
        const visitsPerPage = 8;

        const populateParams = [
					{
						path: "guest",
						populate: [
							{
								path: "owner",
								model: "Client",
							},
						],
					},
					{
						path: "assignedKennel",
						model: "Kennel",
					},
				];

        // collecting dashboard metadata
        var currentVisits = await Visit.find( {checkedIn: true, checkedOut: false })
        var occupancy = currentVisits.length;
            var pendingServiceCount = 0;
            for (var visit of currentVisits) {
                pendingServiceCount += (visit.services.length - visit.servicesRendered.length)
            }

        if (!upcoming) {
            // current only (default)
            var visits = await Visit.find({ checkedIn: true, checkedOut: false })
                .populate(populateParams)
                .sort({ endDate: -1 })
                .skip((page - 1) * visitsPerPage)
                .limit(visitsPerPage);
				} else { // upcoming only
                    var today = new Date();
                    var visits = await Visit.find({ startDate: { $gt: today } })
                        .populate(populateParams)
                        .sort({ endDate: -1 })
                        .skip((page - 1) * visitsPerPage)
                        .limit(visitsPerPage);
            }
        
        const totalVisitCount = visits.length;
        const pageCount = Math.ceil(totalVisitCount / visitsPerPage);
        var data = { title, adminAccess, visits, page, pageCount, upcoming, occupancy, pendingServiceCount };
        res.render("employee/dashboard", { ...data });
    };

// employee login - form entry
module.exports.renderLoginForm = 
    (req: Request, res: Response) => {
        const title = "PetResort · Employee Login";
        var returnUrl = res.locals.returnTo;
        var data = { title, returnUrl };
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
            const redirectUrl = res.locals.returnTo;
            req.flash("success", "Goodbye!");
            if (redirectUrl === '/') {
                res.redirect(redirectUrl); 
            } else {
                res.redirect("/login");
            }
        });
    };