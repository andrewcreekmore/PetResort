import { Request, Response, NextFunction } from "express";
import AppError = require("../utils/appError");
import escapeRegex = require("../utils/escapeRegex");
import { Guest } from "../models/guest.model";
import { Client } from "../models/client.model";

/*
===========================================================================
guests.controller.ts
- methods containing route logic for export
===========================================================================
*/

// guest route constants
const guestRecordsDir = "employee/records/guests";
const title = "Pet Resort · Guest Records";
const user = "employee";

// guest records: view all / index
module.exports.index = 
	async (req: Request, res: Response, next: NextFunction) => {
        const currentOnly: boolean = Boolean(req.query.current) || false;
        const isSearch: boolean = Boolean(req.query.search) || false;

        // pagination
        const page = Number(req.query.p) || 1;
        const guestsPerPage = 8;
        // for use in both query types
        const populateVisits = [
					{
						path: "visits",
						populate: [
							{
								path: "assignedKennel",
								model: "Kennel",
							},
						],
					},
				];

        // find by searched guest name
        if (isSearch) {
            const regex = new RegExp(escapeRegex(String(req.query.search)), 'gi');
            var totalGuestCount = await Guest.count({ name: regex });
			var guests = await Guest.find({ name: regex })
				.populate("owner")
				.populate(populateVisits);
		} else { // find all
            var totalGuestCount = await Guest.count({});
            var guests = await Guest.find({})
                .populate("owner")
                .populate(populateVisits)
                .skip((page - 1) * guestsPerPage)
                .limit(guestsPerPage);
        }

        // sorting by recency, then filtering to current only if needed
        var sortedGuests = guests.sort(
                        (b, a) => a.mostRecentVisit.valueOf() - b.mostRecentVisit.valueOf()
                    );
        if (currentOnly) {
            sortedGuests = sortedGuests.filter(guest => guest.current);
            var totalGuestCount = sortedGuests.length;
        }

        guests = sortedGuests;
        const pageCount = Math.ceil(totalGuestCount / guestsPerPage);
        var data = { title, user, guests, page, pageCount, currentOnly, isSearch };
        res.render(guestRecordsDir + "/index", { ...data });
	};

// guest records: create new record - form entry
module.exports.renderNewForm = 
    async (req: Request, res: Response, next: NextFunction) => {
        var allClients = await Client.find({});
        if (allClients) {
            var data = { title, user, allClients };
            res.render(guestRecordsDir + "/new", { ...data });
        } else {
            throw new AppError(400);
        }
    };

// guest records: create new record - add on server
module.exports.createGuest =
    async (req: Request, res: Response, next: NextFunction) => {
        const newGuest = new Guest(req.body.guest);
        if (req.file) {
            const uploadedURL = req.file.path;
            const uploadedFilename = req.file.filename;
            newGuest.image = { url: uploadedURL, filename: uploadedFilename };
        }
        await newGuest.save();
        const populatedGuest = await Guest.findOne(newGuest._id).populate("owner");
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
        req.flash("success", "Successfully added new guest.");
        res.redirect(`/guest-records/${newGuest._id}`);
    };

// guest records: view single record details
module.exports.showDetails = 
    async (req: Request, res: Response, next: NextFunction) => {
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
                        {
                            path: "assignedKennel",
                            model: 'Kennel',
                        },
                    ],
                },
            ]);
        if (!guest) {
            req.flash("error", `Couldn't find that guest.`);
            return res.redirect("/guest-records");
        } else {
            var bUseAltImgPath = false;
            var data = { title, user, guest, bUseAltImgPath };
            res.render(guestRecordsDir + "/details", { ...data });
        }
    };

// guest records: update single record - form entry
module.exports.renderEditForm = 
    async (req: Request, res: Response, next: NextFunction) => {
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
    };

// guest records: update single record - edit on server
module.exports.updateGuest =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const guest = await Guest.findByIdAndUpdate(id, req.body.guest,  {
            runValidators: true,
            new: true,
        });
        if (guest) {
            if (req.file) {
                guest.image = { url: req.file.path, filename: req.file.filename };
                await guest.save();
            }
            req.flash('success', 'Successfully updated guest.')
            res.redirect(`/guest-records/${guest._id}`);
        }
    };

// guest records: delete single record
module.exports.deleteGuest =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deletedGuest = await Guest.findByIdAndDelete(id);
        if (!deletedGuest) {
            throw new AppError(404);
        } else {
            req.flash("success", "Successfully deleted guest.");
            res.redirect("/guest-records");
        }
    };

// guest records: remove photo (reset to placeholder)
module.exports.removePhoto =
    async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const guest = await Guest.findById(id);

		if (guest) {
			guest.image = {
				url: "../img/pawPrint.png",
				filename: "pawPrint.png",
			};
			await guest.save();

			req.flash("success", "Successfully removed guest photo.");
			res.redirect(`/guest-records/${guest._id}/edit`);
		}
	};
