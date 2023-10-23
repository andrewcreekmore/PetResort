import express = require("express");
import { Request, Response, NextFunction } from "express";
import AppError = require("../utils/appError");
import catchAsync = require("../utils/catchAsync");
import { Guest } from "../models/guest.model";
const { guestValidationSchema } = require("../validationSchemas");
import { Client } from "../models/client.model";


/*
===========================================================================
guests.route.ts
- 
===========================================================================
*/

// init router
const router = express.Router();

// Guest route constants
const guestRecordsDir = "employee/records/guests";
const title = "Pet Resort · Guest Records";
const user = "employee";

// model validation using Joi before sending to Mongoose
const validateGuest = (req: Request, res: Response, next: NextFunction) => {
    const { error } = guestValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details
            .map((element: any) => element.message)
            .join(",");
        throw new AppError(400, msg);
    } else {
        next();
    }
};

// guest records: view all / index
router.get("/",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        var query = JSON.stringify(req.query);
        if (query.includes("current")) {
            const guests = await Guest.find({ current: true })
                .populate("owner")
                .populate("visits");
            var data = { title, user, guests };
            res.render(guestRecordsDir + "/index", { ...data });
        } else if (query.includes("nameSearch")) {
            const guests = await Guest.find({
                name: req.query.nameSearch,
            })
                .populate("owner")
                .populate("visits");
            var data = { title, user, guests };
            res.render(guestRecordsDir + "/index", { ...data });
        } else {
            const guests = await Guest.find({})
                .populate("owner")
                .populate("visits");
            var data = { title, user, guests };

            res.render(guestRecordsDir + "/index", { ...data });
        }
    })
);

// guest records: create new record - form entry
router.get(
    "/new",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        var allClients = await Client.find({});
        if (allClients) {
            var data = { title, user, allClients };
            res.render(guestRecordsDir + "/new", { ...data });
        } else {
            throw new AppError(400);
        }
    })
);

// guest records: create new record - add on server
router.post(
    "/",
    validateGuest,
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const newGuest = new Guest(req.body.guest);
        await newGuest.save();
        const populatedGuest = await Guest.findOne(newGuest._id).populate(
            "owner"
        );
        if (populatedGuest) {
            const owner = await Client.findOne(
                { firstName: populatedGuest.owner.firstName },
                { lastName: populatedGuest.owner.lastName }
            ).populate("pets");
            if (owner) {
                owner.pets.push(populatedGuest);
                await owner.save();
            } else {
                throw new AppError(400);
            }
        }
        req.flash('success', 'Successfully added new guest.');
        res.redirect(`/guest-records/${newGuest._id}`);
    })
);

// guest records: view single record details
router.get(
    "/:id",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const guest = await Guest.findById(id)
            .populate("owner")
            .populate([
                {
                    path: "visits",
                    populate: [
                        {
                            path: "services",
                            model: "Service",
                        },
                        {
                            path: "servicesRendered",
                            model: "Service",
                        },
                    ],
                },
            ]);
        if (!guest) {
            req.flash('error', `Couldn't find that guest.`)
            return res.redirect('/guest-records')
        } else {
            var bUseAltImgPath = false;
            var data = { title, user, guest, bUseAltImgPath };
            res.render(guestRecordsDir + "/details", { ...data });
        }
    })
);

// guest records: update single record - form entry
router.get(
    "/:id/edit",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const guest = await Guest.findById(id).populate("owner");
        var allClients = await Client.find({});
        if (!guest) {
            req.flash("error", `Couldn't find that guest.`);
            return res.redirect("/guest-records");
        } else {
            var data = { title, user, guest, allClients };
            res.render(guestRecordsDir + "/edit", { ...data });
        }
    })
);

// guest records: update single record - edit on server
router.put(
    "/:id",
    validateGuest,
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const guest = await Guest.findByIdAndUpdate(id, req.body.guest, {
            runValidators: true,
            new: true,
        });
        if (guest) {
            req.flash('success', 'Successfully updated guest.')
            res.redirect(`/guest-records/${guest._id}`);
        }
    })
);

// guest records: delete single record
router.delete(
    "/:id",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deletedGuest = await Guest.findByIdAndDelete(id);
        if (!deletedGuest) {
            throw new AppError(404);
        } else {
            req.flash("success", "Successfully deleted guest.");
            res.redirect("/guest-records");
        }
    })
);


module.exports = router;
