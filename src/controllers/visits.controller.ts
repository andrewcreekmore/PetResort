import { Request, Response, NextFunction } from "express";
import AppError = require("../utils/appError");
import { Visit } from "../models/visit.model";
import { Guest } from "../models/guest.model";
import { IServiceDoc, Service } from "../models/service.model";
import { Kennel, IKennelDoc } from "../models/kennel.model";
import dateFns = require("date-fns");
/*
===========================================================================
visits.controller.ts
- methods containing route logic for export
- coverage: all visit-model CRUD
- dedicated update routing for:
-- visit services (add/remove)
-- visit service completion (toggle)
-- visit billing status (toggle)
===========================================================================
*/

// visit route constants
const visitRecordsDir = "employee/records/visits";
const title = "PetResort · Visit Records";

// visit records: view single record details
module.exports.index =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const visit = await Visit.findById(id)
            .populate("guest")
            .populate("services")
            .populate("servicesRendered")
            .populate('assignedKennel')
        if (!visit) {
            req.flash("error", `Couldn't find that visit.`);
            return res.redirect("/guest-records");
        } else {
            const guest = await Guest.findById(visit.guest).populate("owner");
            var bUseAltImgPath = false;
            var recordName = "Visit #" + visit.number;
            var record_id = visit.guest._id;
            var breadcrumbs = req.session.breadcrumbs;
            var data = { title, visit, guest, bUseAltImgPath, recordName, record_id, breadcrumbs };
            res.render(visitRecordsDir + "/details", { ...data });
        }
    };

// visit records: create new record - form entry
module.exports.renderNewForm =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const allKennels = await Kennel.find({});
        const unoccupiedKennels = allKennels.filter(kennel => !kennel.occupant);

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
            var recordName = guest.name;
			var breadcrumbs = req.session.breadcrumbs;
            var data = {
                title,
                guest,
                bUseAltImgPath,
                mostRecentVisitNumber,
                today,
                tomorrow,
                unoccupiedKennels,
                recordName,
                breadcrumbs,
            };
            res.render(visitRecordsDir + "/new", { ...data });
        } else {
            throw new AppError(400);
        }
    };

// visit records: create new record - add on server
module.exports.createVisit = 
    async (req: Request, res: Response, next: NextFunction) => {
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
                if (populatedVisit.checkedIn) {
                    await Kennel.findByIdAndUpdate(
                        populatedVisit.assignedKennel._id,
                        { occupant: populatedVisit.guest._id }
                        );
                    populatedVisit.checkedInBy = res.locals.currentUser.username;
                    populatedVisit.servicesRenderedByMap = new Map();
                    populatedVisit.servicesRenderedDateMap = new Map();
                    await populatedVisit.save();
                }

            } else {
                throw new AppError(400);
            }
        }
        req.flash('success', 'Successfully added new visit.')
        res.redirect(`/visit-records/${newVisit._id}`);
    };

// visit records: update single record - form entry
module.exports.renderEditForm = 
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const visit = await Visit.findById(id)
            .populate('assignedKennel')
            .populate([
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
            const allKennels = await Kennel.find({})

            var unoccupiedKennels = [];

            for (var kennel of allKennels) {
                if (!kennel.occupant) {
                    unoccupiedKennels.push(kennel);
                }
            }

            if (visit.assignedKennel) {
                const currentKennel = await Kennel.find({
									kennel_id: visit.assignedKennel.kennel_id,
								});

                if (currentKennel.length > 0) {
                    const test = (element: IKennelDoc) => element.kennel_id === visit.assignedKennel.kennel_id; 
                    if (!unoccupiedKennels.some(test)) {
                        unoccupiedKennels.push(currentKennel[0]);
                    }
                }
            }
            
			var recordName = "Visit #" + visit.number;
			var breadcrumbs = req.session.breadcrumbs;
            var data = { title, visit, unoccupiedKennels, recordName, breadcrumbs };
            res.render(visitRecordsDir + "/edit", { ...data });
        }
    };

// visit records: update single record - edit on server
module.exports.updateVisit =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const preupdateVisit = await Visit.findById(id)
        const wasAlreadyCheckedIn = preupdateVisit?.checkedIn;
        const visit = await Visit.findByIdAndUpdate(id, req.body.visit, {
            runValidators: true,
            new: true,
        });
        if (visit) {

            // if assignedKennel was updated, reset indicator flag, and update occupant property on old and new
            if (visit.kennelUpdatedFlag) {
                visit.kennelUpdatedFlag = false;
                await visit.save()
                await Kennel.findByIdAndUpdate(visit.lastAssignedKennel._id, { occupant: null });
                await Kennel.findByIdAndUpdate(visit.assignedKennel._id, { occupant: visit.guest._id });
            }

            // if checkedIn was flagged true and hadn't yet been checkedIn prior to this edit,
            // add occupant property on assignedKennel
            if (visit.checkedIn && !wasAlreadyCheckedIn) {
                await Kennel.findByIdAndUpdate(visit.assignedKennel._id, {
									occupant: visit.guest._id,
								});
                visit.checkedInBy = res.locals.currentUser.username;
                await visit.save();
            }

            // if checkedOut was flagged true, remove occupant property on assignedKennel
            if (visit.checkedOut) {
                await Kennel.findByIdAndUpdate(visit.assignedKennel._id, {
									occupant: null,
								});
                visit.checkedOutBy = res.locals.currentUser.username;
				await visit.save();
            }

            req.flash("success", "Successfully updated visit.");
            res.redirect(`/visit-records/${visit._id}`);
        }
    };

// visit records: add/remove services on record - form entry
module.exports.renderAddServiceForm =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const visit = await Visit.findById(id)
					.populate("services")
					.populate("servicesRendered")
					.populate([
                        {
                            path: "guest",
                            populate: {
                                path: "owner",
                                model: "Client",
                            }
                        }
                    ])
        if (visit) {
            const relevantServices = await Service.find({
                petType: visit.guest.type,
            });
            if (relevantServices) {
                var recordName = "Visit #" + visit.number;
                var breadcrumbs = req.session.breadcrumbs;
                var data = { title, visit, relevantServices, recordName, breadcrumbs };
                res.render(visitRecordsDir + "/addService", { ...data });
            }
        } else {
            throw new AppError(400);
        }
    };

// visit records: add/remove services on single record - edit on server
module.exports.addServiceToVisit =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const visit = await Visit.findByIdAndUpdate(id, req.body.visit, {
            runValidators: true,
            new: true,
        });
        if (visit) {
            req.flash("success", "Visit services updated.");
            res.redirect(`/visit-records/${visit._id}`);
        }
    };

// visit records: toggle service status - edit on server
module.exports.toggleServiceStatus =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const visitServicePopulate = [
					{
						path: "services",
						model: "Service",
					},
					{
						path: "servicesRendered",
						model: "Service",
					},
				];

        const preupdateVisit = await Visit.findById(id).populate(
					visitServicePopulate
				);

        var visitUpdateData;
        if (req.body.visit.clearServicesRenderedFlag) {
            visitUpdateData = req.body.visit;
            visitUpdateData.servicesRendered = [];
            visitUpdateData.clearServicesRenderedFlag = false;
        } else {
            visitUpdateData = req.body.visit;
        }
        const visit = await Visit.findByIdAndUpdate(id, visitUpdateData, {
            runValidators: true,
            new: true,
        });

        const populatedUpdatedVisit = await Visit.findById(id).populate(
					visitServicePopulate
				);

        if (visit && preupdateVisit && populatedUpdatedVisit) {

            // check for any newly completed/marked-pending services; update their completedBy and completionDate props
            for (var service of populatedUpdatedVisit.servicesRendered) {
                const test = (element: IServiceDoc) => element.name === service.name;
                if (!preupdateVisit.servicesRendered.some(test)) {					
                    populatedUpdatedVisit.servicesRenderedByMap.set(service._id, res.locals.currentUser.username);
                    populatedUpdatedVisit.servicesRenderedDateMap.set(service._id, Date.now());
                    await populatedUpdatedVisit.save();
                    } 
                }
            // check for any newly marked-pending services; update their completedBy and completionDate props
            for (var service of preupdateVisit.servicesRendered) {
                const test = (element: IServiceDoc) => element.name === service.name;
                if (!populatedUpdatedVisit.servicesRendered.some(test) ) {
                        populatedUpdatedVisit.servicesRenderedByMap.delete(service._id);
                        populatedUpdatedVisit.servicesRenderedDateMap.delete(service._id);
                        await populatedUpdatedVisit.save();
                    }       
                }
            req.flash("success", "Service status updated.");
            res.redirect(`/visit-records/${visit._id}`);
        } else {
            throw new AppError(400);
        }
    };

// visit records: toggle service status - edit on server
module.exports.markVisitPaid =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const visit = await Visit.findById(id)

        if (visit) {
            visit.paid = true;
            await visit.save();
            res.redirect(`/visit-records/${visit._id}`);
        } else {
            throw new AppError(400);
        }
    };

// visit records: delete single record
module.exports.deleteVisit =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deletedVisit = await Visit.findByIdAndDelete(id);
        if (!deletedVisit) {
            throw new AppError(404);
        } else {
            await Kennel.findByIdAndUpdate(
                    deletedVisit.assignedKennel._id, {
                    occupant: null,
                    });

            req.flash("success", "Successfully deleted visit.");
            res.redirect(`/guest-records/${deletedVisit.guest._id}`);
        }
    };