import { Application, Request, Response, NextFunction } from "express";
import express = require("express");
import bodyParser = require("body-parser");
import methodOverride = require('method-override');
import mongoose = require('mongoose');
import session = require('express-session');
import flash = require('connect-flash')

import AppError = require("./utils/appError");
import { registerSchemas } from "./models/client.model";
const guestRoutes =  require('./routes/guests.route')
const adminRoutes = require('./routes/admin.route')
const clientRoutes = require('./routes/clients.route')
const visitRoutes = require('./routes/visits.route')

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

		// express session options
		const sessionConfig = {
			secret: "tempSecret",
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				expire: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
				maxAge: 1000 * 60 * 60 * 24 * 7,
			},
		};

		this.app.use(session(sessionConfig));
		this.app.use(flash());

		// store any flash messages in locals
		const storeFlashMessages = function (req: Request, res: Response, next: NextFunction){
			res.locals.success = req.flash('success');
			res.locals.error = req.flash('error');
			next();
		}

		this.app.use(storeFlashMessages)
	}

	// setup routing
	private initRoutes() {

		// HOME / ROOT ROUTES
		//=====================

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
			res.render("employee/employeePortal", { ...data });
		});

		// customer portal
		this.app.get("/customer", (req: Request, res: Response) => {
			const title = "Pet Resort · Customer Site";
			var user = "customer";
			var data = { title, user };
			res.render("customer/customerPortal", { ...data });
		});

		// EMPLOYEE ROUTES
		//=====================
		this.app.use("/admin", adminRoutes);
		this.app.use("/guest-records", guestRoutes);
		this.app.use("/client-records", clientRoutes);
		this.app.use("/visit-records", visitRoutes);

		// CUSTOMER ROUTES
		//=====================

		// services
		this.app.get("/services", (req: Request, res: Response) => {
			const title = "Pet Resort · Services";
			const user = "customer";
			const data = { title, user };
			res.render("customer/services", { ...data });
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
