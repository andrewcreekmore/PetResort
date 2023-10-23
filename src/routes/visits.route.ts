import express = require("express");
import { Request, Response, NextFunction } from "express";
import AppError = require("../utils/appError");
import catchAsync = require("../utils/catchAsync");
import { Visit } from "../models/visit.model";
import { Guest } from "../models/guest.model";
const { visitValidationSchema } = require("../validationSchemas");
import { Service } from "../models/service.model";
import dateFns = require("date-fns");


/*
===========================================================================
visits.route.ts
- 
===========================================================================
*/

// init router
const router = express.Router();

// Visit route constants
const visitRecordsDir = "employee/records/visits";
const title = "Pet Resort · Visit Records";
const user = "employee";

// model validation using Joi before sending to Mongoose
const validateVisit = (req: Request, res: Response, next: NextFunction) => {
	const { error } = visitValidationSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((element: any) => element.message).join(",");
		throw new AppError(400, msg);
	} else {
		next();
	}
};

// visit records: view single record details
router.get(
    "/:id",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const title = "Pet Resort · Visit Records";
        var user = "employee";
        const { id } = req.params;
        const visit = await Visit.findById(id)
            .populate("guest")
            .populate("services")
            .populate("servicesRendered");
        if (!visit) {
            req.flash("error", `Couldn't find that visit.`);
            return res.redirect("/guest-records");
        } else {
            const guest = await Guest.findById(visit.guest).populate("owner");
            var bUseAltImgPath = false;
            var data = { title, user, visit, guest, bUseAltImgPath };
            res.render(visitRecordsDir + "/details", { ...data });
        }
    })
);

// visit records: create new record - form entry
router.get(
    "/new/:id",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const title = "Pet Resort · Visit Records";
        var user = "employee";
        const { id } = req.params;
        var guest = await Guest.findOne({ _id: id })
            .populate("owner")
            .populate("visits");
        if (guest && guest.visits) {
            var mostRecentVisitNumber = 0;
            if (guest.visits.length) {
                const sortedVisitsArr = guest.visits.sort((b, a) => a.number - b.number);
                mostRecentVisitNumber = sortedVisitsArr[0].number;
            }
            var bUseAltImgPath = true;
            var today = new Date();
            var tomorrow = dateFns.addDays(today, 1);
            var data = {
                title,
                user,
                guest,
                bUseAltImgPath,
                mostRecentVisitNumber,
                today,
                tomorrow,
            };
            res.render(visitRecordsDir + "/new", { ...data });
        } else {
            throw new AppError(400);
        }
    })
);

// visit records: create new record - add on server
router.post(
    "/",
    validateVisit,
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const newVisit = new Visit(req.body.visit);
        await newVisit.save();
        const populatedVisit = await Visit.findOne(newVisit._id).populate(
            "guest"
        );
        if (populatedVisit) {
            const guest = await Guest.findById(populatedVisit.guest._id).populate(
                "visits"
            );
            if (guest && guest.visits) {
                guest.visits.push(populatedVisit);
                await guest.save();
            } else {
                throw new AppError(400);
            }
        }
        req.flash('success', 'Successfully added new visit.')
        res.redirect(`/visit-records/${newVisit._id}`);
    })
);

// visit records: update single record - form entry
router.get(
    "/:id/edit",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const title = "Pet Resort · Visit Records";
        var user = "employee";
        const { id } = req.params;
        const visit = await Visit.findById(id).populate([
            {
                path: "guest",
                populate: {
                    path: "owner",
                    model: "Client",
                },
            },
        ]);

        if (!visit) {
            req.flash("error", `Couldn't find that visit.`);
            return res.redirect("/guest-records");
        } else {
            var data = { title, user, visit };
            res.render(visitRecordsDir + "/edit", { ...data });
        }
    })
);

// visit records: update single record - edit on server
router.put(
    "/:id", // NEED TO ADD VALIDATEVISIT FUNC (like guest)
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const visit = await Visit.findByIdAndUpdate(id, req.body.visit, {
            runValidators: true,
            new: true,
        });
        if (visit) {
            req.flash("success", "Successfully updated visit.");
            res.redirect(`/guest-records/${visit.guest._id}`);
        }
    })
);

// visit records: add service to record - form entry
router.get(
    "/add-service/:id",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const title = "Pet Resort · Visit Records";
        var user = "employee";
        const { id } = req.params;
        const visit = await Visit.findById(id)
            .populate("guest")
            .populate("services")
            .populate("servicesRendered");
        if (visit) {
            const relevantServices = await Service.find({
                petType: visit.guest.type,
            });
            if (relevantServices) {
                var data = { title, user, visit, relevantServices };
                res.render(visitRecordsDir + "/addService", { ...data });
            }
        } else {
            throw new AppError(400);
        }
    })
);

// visit records: add service to single record - edit on server
router.put(
    "/add-service/:id", // NEED TO ADD VALIDATEVISIT FUNC (like guest)
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const visit = await Visit.findByIdAndUpdate(id, req.body.visit, {
            runValidators: true,
            new: true,
        });
        if (visit) {
            res.redirect(`/guest-records/${visit.guest._id}`);
        }
    })
);

// visit records: toggle service status - edit on server
router.put(
    "/toggleServiceStatus/:id", // NEED TO ADD VALIDATEVISIT FUNC (like guest)
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const visit = await Visit.findByIdAndUpdate(id, req.body.visit, {
            runValidators: true,
            new: true,
        });
        if (visit) {
            res.redirect(`/visit-records/${visit._id}`);
        }
    })
);

// visit records: delete single record
router.delete(
    "/:id",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deletedVisit = await Visit.findByIdAndDelete(id);
        if (!deletedVisit) {
            throw new AppError(404);
        } else {
            req.flash("success", "Successfully deleted visit.");
            res.redirect(`/guest-records/${deletedVisit.guest._id}`);
        }
    })
);

module.exports = router;