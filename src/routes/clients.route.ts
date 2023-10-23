import express = require("express");
import { Request, Response, NextFunction } from "express";
import AppError = require("../utils/appError");
import catchAsync = require("../utils/catchAsync");
import { Guest } from "../models/guest.model";
import { Client } from "../models/client.model";
const { clientValidationSchema } = require("../validationSchemas");
import { stateInfo } from "../utils/staticData";

/*
===========================================================================
clients.route.ts
- 
===========================================================================
*/

// init router
const router = express.Router();

// Client route constants
const clientRecordsDir = "employee/records/clients";
const title = "Pet Resort · Client Records";
const user = "employee";

// model validation using Joi before sending to Mongoose
const validateClient = (req: Request, res: Response, next: NextFunction) => {
    const { error } = clientValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details
            .map((element: any) => element.message)
            .join(",");
        throw new AppError(400, msg);
        console.log(error);
    } else {
        next();
    }
};

// client records: view all / index
router.get(
    "/",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const title = "Pet Resort · Client Records";
        var user = "employee";
        var query = JSON.stringify(req.query);
        if (query.includes("nameSearch")) {
            const clients = await Client.find({
                name: req.query.nameSearch,
            })
                .populate("pets")
                .populate("address");
            var data = { title, user, clients };
            res.render(clientRecordsDir + "/index", { ...data });
        } else {
            const clients = await Client.find({})
                .populate("pets")
                .populate("address");
            var data = { title, user, clients };
            res.render(clientRecordsDir + "/index", { ...data });
        }
    })
);

// client records: create new record - form entry
router.get("/new", (req: Request, res: Response) => {
    const title = "Pet Resort · Client Records";
    var user = "employee";
    var data = { title, user, stateInfo };
    res.render(clientRecordsDir + "/new", { ...data });
});

// client records: create new record - add on server
router.post(
    "/",
    validateClient,
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const newClient = new Client(req.body.client);
        if (!newClient) {
            throw new AppError(400);
        } else {
            await newClient.save();
            req.flash('success', 'Successfully added new client.')
            res.redirect(`/client-records/${newClient._id}`);
        }
    })
);

// client records: view single record details
router.get(
    "/:id",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const title = "Pet Resort · Client Records";
        var user = "employee";
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
    })
);

// client records: update single record - form entry
router.get(
    "/:id/edit",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const title = "Pet Resort · Client Records";
        var user = "employee";
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
    })
);

// client records: update single record - edit on server
router.put(
    "/:id",
    validateClient,
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
    })
);

// client records: delete single record
router.delete(
    "/:id",
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deletedClient = await Client.findByIdAndDelete(id);
        // NOTE: client model query middleware will also delete any associated pets!
        if (!deletedClient) {
            throw new AppError(404);
        } else {
            req.flash('success', 'Successfully deleted client.')
            res.redirect("/client-records");
        }
    })
);

module.exports = router;

