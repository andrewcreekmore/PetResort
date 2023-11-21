import { Application, Request, Response, NextFunction } from "express";
import express = require("express");
import bodyParser = require("body-parser");
import methodOverride = require('method-override');
import mongoose, { Document, PassportLocalModel } from "mongoose";
import session = require('express-session');
import flash = require('connect-flash');
import passport = require('passport');
const localStrategy = require("passport-local");

import AppError = require("./utils/appError");
import { registerSchemas } from "./models/client.model";
const Employee = require("./models/employee.model");
const indexRoutes = require('./routes/index.route')
const guestRoutes = require("./routes/guests.route")
const clientRoutes = require("./routes/clients.route")
const visitRoutes = require("./routes/visits.route")
const adminRoutes = require("./routes/admin/admin.route");
const employeeRoutes = require("./routes/admin/employees.route");
const serviceRoutes = require("./routes/admin/services.route");
const kennelRoutes = require("./routes/admin/kennels.route");


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
			saveUninitialized: true,
			cookie: {
				httpOnly: true,
				expire: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
				maxAge: 1000 * 60 * 60 * 24 * 7,
			},
		};

		this.app.use(session(sessionConfig));
		this.app.use(flash());
		this.app.use(passport.initialize());
		this.app.use(passport.session());
	
		passport.use(Employee.createStrategy());
		passport.serializeUser(Employee.serializeUser());
		passport.deserializeUser(Employee.deserializeUser());

		// store currently logged-in employee user; activeAdminTab values
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			res.locals.currentUser = req.user;
			res.locals.activeAdminTab = req.session.activeAdminTab;
			res.locals.activeGuestsTab = req.session.activeGuestsTab;
			next();
		})

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

		// INDEX / EMPLOYEE ROUTES
		//=====================
		this.app.use('/', indexRoutes);
		this.app.use("/admin", adminRoutes);
		this.app.use("/guest-records", guestRoutes);
		this.app.use("/client-records", clientRoutes);
		this.app.use("/visit-records", visitRoutes);
		this.app.use("/employee-records", employeeRoutes);
		this.app.use("/service-records", serviceRoutes);
		this.app.use("/kennel-records", kennelRoutes);

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
