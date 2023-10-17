import { Application, Request, Response, NextFunction } from "express";
import express = require("express");
import bodyParser = require("body-parser");
import methodOverride = require('method-override');
import mongoose = require('mongoose');
import dateFns = require('date-fns');

import AppError = require("./utils/appError");
import { Guest, IGuestDoc } from "./models/guest.model";
import { Client, IClientDoc, registerSchemas } from "./models/client.model";
import { Visit } from "./models/visit.model";
import Service = require("./models/service.model");
import catchAsync = require('./utils/catchAsync');
const { guestValidationSchema, clientValidationSchema, visitValidationSchema } = require('./validationSchemas');
import { stateInfo } from "./utils/staticData"


/*
===========================================================================
app.ts
- wrapper class for Express server Application. on construct:
-- creates Express instance on passed port
-- initializes middleware & routes
-- sets static resource folders (public, views) and templating engine (ejs)
===========================================================================
*/



class App {
	public app: Application;
	public port: number;

	constructor(appInitParams: { port: number }) {
		// setup express instance on passed port
		this.app = express();
		this.port = appInitParams.port;

		// setup static resources
		this.app.use(express.static("public"));
		this.app.use(express.static("views"));

		// setup templating engine
		this.app.set("view engine", "ejs");

		// setup middleware and routes
		this.initMiddleware();
		this.initRoutes();

		// setup database
		this.initDatabase();
	}

	// setup app middleware
	private initMiddleware() {
		// run on every request:
		this.app.use(bodyParser.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(methodOverride("_method"));
	}

	// setup routing
	private initRoutes() {
		// TODO: (should be moved into separate file)
		// validate data with Joi before sending to Mongoose
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

		const validateClient = (
			req: Request,
			res: Response,
			next: NextFunction
		) => {
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

		const validateVisit = (req: Request, res: Response, next: NextFunction) => {
			const { error } = visitValidationSchema.validate(req.body);
			if (error) {
				const msg = error.details
					.map((element: any) => element.message)
					.join(",");
				throw new AppError(400, msg);
			} else {
				next();
			}
		};

		const customerDir = "customer";
		const employeeDir = "employee";

		// home page
		this.app.get("/", (req: Request, res: Response) => {
			const title = "Pet Resort · Home";
			const user = "NONE";
			const data = { title, user };
			res.render("home", { ...data });
		});

		// employee portal
		this.app.get("/employee", (req: Request, res: Response) => {
			const title = "Pet Resort · Employee Portal";
			var user = "employee";
			var adminAccess: boolean = true;
			var data = { title, user, adminAccess };
			res.render(employeeDir + "/employeePortal", { ...data });
		});

		// customer portal
		this.app.get("/customer", (req: Request, res: Response) => {
			const title = "Pet Resort · Customer Site";
			var user = "customer";
			var data = { title, user };
			res.render(customerDir + "/customerPortal", { ...data });
		});

		// EMPLOYEE ROUTES
		//=====================

		const guestRecordsDir = "employee/records/guests";

		// administration
		this.app.get("/admin", (req: Request, res: Response) => {
			const title = "Pet Resort · Admin";
			var user = "employee";
			var adminAccess: boolean = true;
			var data = { title, user, adminAccess };
			res.render(employeeDir + "/admin", { ...data });
		});

		// guest records: view all / index
		this.app.get(
			"/guest-records",
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const title = "Pet Resort · Guest Records";
				var user = "employee";
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
		this.app.get(
			"/guest-records/new",
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const title = "Pet Resort · Guest Records";
				var user = "employee";
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
		this.app.post(
			"/guest-records",
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
				res.redirect(`/guest-records/${newGuest._id}`);
			})
		);

		// guest records: view single record details
		this.app.get(
			"/guest-records/:id",
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const title = "Pet Resort · Guest Records";
				var user = "employee";
				const { id } = req.params;
				const guest = await Guest.findById(id)
					.populate("owner")
					.populate([
						{
							path: "visits",
							populate: {
								path: "services",
								model: "Service",
							},
						},
					]);
				if (!guest) {
					throw new AppError(404);
				} else {
					var bUseAltImgPath = false;
					var data = { title, user, guest, bUseAltImgPath };
					res.render(guestRecordsDir + "/details", { ...data });
				}
			})
		);

		// guest records: update single record - form entry
		this.app.get(
			"/guest-records/:id/edit",
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const title = "Pet Resort · Guest Records";
				var user = "employee";
				const { id } = req.params;
				const guest = await Guest.findById(id).populate("owner");
				var allClients = await Client.find({});
				if (!guest) {
					throw new AppError(404);
				} else {
					var data = { title, user, guest, allClients };
					res.render(guestRecordsDir + "/edit", { ...data });
				}
			})
		);

		// guest records: update single record - edit on server
		this.app.put(
			"/guest-records/:id",
			validateGuest,
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const { id } = req.params;
				const guest = await Guest.findByIdAndUpdate(id, req.body.guest, {
					runValidators: true,
					new: true,
				});
				if (guest) {
					res.redirect(`/guest-records/${guest._id}`);
				}
			})
		);

		// guest records: delete single record
		this.app.delete(
			"/guest-records/:id",
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const { id } = req.params;
				const deletedGuest = await Guest.findByIdAndDelete(id);
				if (!deletedGuest) {
					throw new AppError(404);
				} else {
					res.redirect("/guest-records");
				}
			})
		);

		// CLIENT RECORDS
		const clientRecordsDir = "employee/records/clients";

		// client records: view all / index
		this.app.get(
			"/client-records",
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
		this.app.get("/client-records/new", (req: Request, res: Response) => {
			const title = "Pet Resort · Client Records";
			var user = "employee";
			var data = { title, user, stateInfo };
			res.render(clientRecordsDir + "/new", { ...data });
		});

		// client records: create new record - add on server
		this.app.post(
			"/client-records",
			validateClient,
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const newClient = new Client(req.body.client);
				if (!newClient) {
					throw new AppError(400);
				} else {
					await newClient.save();
					res.redirect(`/client-records/${newClient._id}`);
				}
			})
		);

		// client records: view single record details
		this.app.get(
			"/client-records/:id",
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
					throw new AppError(404);
				} else {
					var data = { title, user, singleClient };
					res.render(clientRecordsDir + "/details", { ...data });
				}
			})
		);

		// client records: update single record - form entry
		this.app.get(
			"/client-records/:id/edit",
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
					throw new AppError(404);
				} else {
					var data = { title, user, singleClient, stateInfo };
					res.render(clientRecordsDir + "/edit", { ...data });
				}
			})
		);

		// client records: update single record - edit on server
		this.app.put(
			"/client-records/:id",
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
					res.redirect(`/client-records/${singleClient._id}`);
				}
			})
		);

		// client records: delete single record
		this.app.delete(
			"/client-records/:id",
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const { id } = req.params;
				const deletedClient = await Client.findByIdAndDelete(id);
				if (!deletedClient) {
					throw new AppError(404);
				} else {
					res.redirect("/client-records");
				}
			})
		);

		// VISIT RECORDS
		const visitRecordsDir = "employee/records/visits";

		// visit records: view single record details
		this.app.get(
			"/visit-records/:id",
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const title = "Pet Resort · Visit Records";
				var user = "employee";
				const { id } = req.params;
				const visit = await Visit.findById(id)
					.populate("guest")
					.populate("services");
				if (!visit) {
					throw new AppError(404);
				} else {
					const guest = await Guest.findById(visit.guest).populate("owner");
					var bUseAltImgPath = false;
					var data = { title, user, visit, guest, bUseAltImgPath };
					res.render(visitRecordsDir + "/details", { ...data });
				}
			})
		);

		// visit records: create new record - form entry
		this.app.get(
			"/visit-records/new/:id",
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const title = "Pet Resort · Visit Records";
				var user = "employee";
				const { id } = req.params;
				var guest = await Guest.findOne({ _id: id })
					.populate("owner")
					.populate("visits");
				if (guest && guest.visits) {
					const sortedVisitsArr = guest.visits.sort(
						(b, a) => a.number - b.number
					);
					var mostRecentVisitNumber = sortedVisitsArr[0].number;
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
		this.app.post(
			"/visit-records",
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
				res.redirect(`/visit-records/${newVisit._id}`);
			})
		);

		// visit records: update single record - form entry
		this.app.get(
			"/visit-records/:id/edit",
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const title = "Pet Resort · Visit Records";
				var user = "employee";
				const { id } = req.params;
				const visit = await Visit.findById(id)
					.populate([
						{
							path: 'guest',
							populate: {
								path: 'owner',
								model: 'Client',
							},
						},
					])
	
				if (!visit) {
					throw new AppError(404);
				} else {
					var data = { title, user, visit };
					res.render(visitRecordsDir + "/edit", { ...data });
				}
			})
		);

		// visit records: update single record - edit on server
		this.app.put(
			"/visit-records/:id", // NEED TO ADD VALIDATEVISIT FUNC (like guest)
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

		// visit records: delete single record
		this.app.delete(
			"/visit-records/:id",
			catchAsync(async (req: Request, res: Response, next: NextFunction) => {
				const { id } = req.params;
				const deletedVisit = await Visit.findByIdAndDelete(id);
				if (!deletedVisit) {
					throw new AppError(404);
				} else {
					res.redirect(`/guest-records/${deletedVisit.guest._id}`);
				}
			})
		);

		// CUSTOMER ROUTES
		//=====================

		// services
		this.app.get("/services", (req: Request, res: Response) => {
			const title = "Pet Resort · Services";
			const user = "customer";
			const data = { title, user };
			res.render(customerDir + "/services", { ...data });
		});

		// ERROR HANDLING
		//=====================

		// 404 not found
		this.app.all("*", (req: Request, res: Response, next: NextFunction) => {
			next(new AppError(404));
		});

		// generic error handler
		this.app.use(
			(err: any, req: Request, res: Response, next: NextFunction) => {
				const {
					statusCode = 500,
					message = "Error",
					template = "error",
					longMessage = "Something went wrong.",
				} = err;
				console.log(err.name);
				res.status(statusCode).render(template, { err });
				next(err);
			}
		);
	}

	// setup app database
	private initDatabase() {
		// connect to database + setup logging
		mongoose.connect("mongodb://127.0.0.1:27017/petResort");
		const db = mongoose.connection;
		db.on("error", console.error.bind(console, "connection error:"));
		db.once("open", () => {
			console.log("Database connected.");
			// ensure all models/schemas are registered
			registerSchemas();
		});
	}

	// define listener
	public listen() {
		this.app.listen(this.port, () => {
			console.log(
				`Server is running at http://localhost:${this.port}; ctrl + C to stop.`
			);
		});
	}
}


export default App;
