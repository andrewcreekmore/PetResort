import { Request, Response, NextFunction } from "express";
import AppError = require("../utils/appError");
import { Client, IClientDoc } from "../models/client.model";
import { stateInfo } from "../utils/staticData";
import escapeRegex = require("../utils/escapeRegex");
import { Guest, IGuestDoc } from "../models/guest.model";

/*
===========================================================================
clients.controller.ts
- methods containing route logic for export
===========================================================================
*/

// client route constants
const clientRecordsDir = "employee/records/clients";
const title = "Pet Resort · Client Records";
const user = "employee";

// client records: view all / index
module.exports.index = 
    async (req: Request, res: Response, next: NextFunction) => {
        const currentOnly: boolean = Boolean(req.query.current) || false;
        const isSearch: boolean = Boolean(req.query.search) || false;

        // pagination
        const page = Number(req.query.p) || 1;
        const clientsPerPage = 8;
        // for use in both query types
        const populatePets = [
                                {
                                    path: "pets",
                                    populate: [
                                        {
                                            path: "visits",
                                            model: "Visit",
                                        },
                                    ],
                                },
                            ];
        // search by client name
        if (isSearch) {
            const regex = new RegExp(escapeRegex(String(req.query.search)), 'gi');
            const findParams = {
							$expr: {
								$regexMatch: {
									input: { $concat: ["$firstName", " ", "$lastName"] },
									regex: regex,
								},
							},
						};
            var totalClientCount = await Client.count(findParams);
            var clients = await Client.find(findParams)
							.populate("address")
							.populate(populatePets);
        } else {
            var totalClientCount = await Client.count({});
            var clients = await Client.find({})
                .populate("address")
                .populate(populatePets)
                .skip((page - 1) * clientsPerPage)
                .limit(clientsPerPage);
        }

        // sorting by recency, then filtering to current only if needed
        var sortedClients = clients.sort(
            (b: IClientDoc, a: IClientDoc) =>
                a.mostRecentPet.mostRecentVisit.valueOf() - b.mostRecentPet.mostRecentVisit.valueOf()
        );
        if (currentOnly) {
            sortedClients = sortedClients.filter((client) => client.mostRecentPet.current);
            var totalClientCount = sortedClients.length;
        }

        // for populating pets <td> if currentGuests includes them
        var allGuests = await Guest.find({}).populate('visits')
        var currentGuests = allGuests.filter((guest) => guest.current);
        
        clients = sortedClients;
        var pageCount = Math.ceil(totalClientCount / clientsPerPage);
        var data = {
            title,
            user,
            clients,
            page,
            pageCount,
            currentOnly,
            currentGuests,
            isSearch,
        };
        res.render(clientRecordsDir + "/index", { ...data });
    };

// client records: create new record - form entry
module.exports.renderNewForm = 
    (req: Request, res: Response) => {
        var data = { title, user, stateInfo };
        res.render(clientRecordsDir + "/new", { ...data });
    };

// client records: create new record - add on server
module.exports.createClient =
    async (req: Request, res: Response, next: NextFunction) => {
        const newClient = new Client(req.body.client);
        if (!newClient) {
            throw new AppError(400);
        } else {
            await newClient.save();
            req.flash('success', 'Successfully added new client.')
            res.redirect(`/client-records/${newClient._id}`);
        }
    };

// client records: view single record details
module.exports.showDetails =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const singleClient = await Client.findById(id)
            .populate("address")
            .populate([
                {
                    path: "pets",
                    populate: {
                        path: "visits",
                        model: "Visit",
                        populate: {
                            path: "services",
                            model: "Service",
                        },
                    },
                },
            ]);
        if (!singleClient) {
            req.flash("error", `Couldn't find that client.`);
            return res.redirect("/client-records");
        } else {
            var data = { title, user, singleClient };
            res.render(clientRecordsDir + "/details", { ...data });
        }
    };

// client records: update single record - form entry
module.exports.renderEditForm =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const singleClient = await Client.findById(id)
            .populate("address")
            .populate([
                {
                    path: "pets",
                    populate: {
                        path: "visits",
                        model: "Visit",
                        populate: {
                            path: "services",
                            model: "Service",
                        },
                    },
                },
            ]);
        if (!singleClient) {
            req.flash("error", `Couldn't find that client.`);
            return res.redirect("/client-records");
        } else {
            var data = { title, user, singleClient, stateInfo };
            res.render(clientRecordsDir + "/edit", { ...data });
        }
    };

// client records: update single record - edit on server
module.exports.updateClient =
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const singleClient = await Client.findByIdAndUpdate(
            id,
            req.body.client,
            {
                runValidators: true,
                new: true,
            }
        );
        if (singleClient) {
            req.flash('success', 'Successfully updated client.')
            res.redirect(`/client-records/${singleClient._id}`);
        }
    };

// client records: delete single record
module.exports.deleteClient = 
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deletedClient = await Client.findByIdAndDelete(id);
        // NOTE: client model query middleware will also delete any associated pets!
        if (!deletedClient) {
            throw new AppError(404);
        } else {
            req.flash('success', 'Successfully deleted client.')
            res.redirect("/client-records");
        }
    };