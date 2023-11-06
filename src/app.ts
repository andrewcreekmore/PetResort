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
const guestRoutes = require("./routes/guests.route")
const adminRoutes = require('./routes/admin.route')
const clientRoutes = require("./routes/clients.route")
const visitRoutes = require("./routes/visits.route")
const { storeReturnTo } = require('./middleware')


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
		this.app.use(passport.initialize());
		this.app.use(passport.session());
	
		passport.use(Employee.createStrategy());
		passport.serializeUser(Employee.serializeUser());
		passport.deserializeUser(Employee.deserializeUser());

		// store currently logged in employee user; activeTab value
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			res.locals.currentUser = req.user;
			res.locals.activeTab = req.session.activeTab;
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
			res.render("employee/dashboard", { ...data });
		});

		// employee login - form entry
		this.app.get('/login', (req: Request, res: Response) => {
			const title = "Pet Resort · Employee Login";
			var user = "employee";
			var data = { title, user };
			res.render("employee/login", { ...data });
		})

		// employee login - authentication
		this.app.post('/login', 
			storeReturnTo, // save returnTo url value from session to res.locals
			passport.authenticate(
				'local', 
				{ failureFlash: true, failureRedirect: '/login'}
				), (req: Request, res: Response) => {
			req.flash('success', 'Welcome back!');
			const redirectUrl = res.locals.returnTo;
			if (redirectUrl) {
				res.redirect(redirectUrl);
			} else {
				res.redirect('/employee')
			}
		})

		// employee logout
		this.app.get('/logout', (req: Request, res: Response, next: NextFunction) => {
			req.logout(function (err) {
				if (err) {
					return next(err);
				}
				req.flash("success", "Goodbye!");
				res.redirect("/employee");
			})
		})

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
