import { Application, Request, Response, NextFunction } from "express";
import express = require("express");
import mongoose, { Document, PassportLocalModel } from "mongoose";
import passport = require('passport');
//const localStrategy = require("passport-local");
import AppError = require("./utils/appError");
import { registerSchemas } from "./models/client.model";
const Employee = require("./models/employee.model");


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

	constructor(appInitParams: { port: number; middlewares: any; routes: any }) {
		// setup express instance on passed port
		this.app = express();
		this.port = appInitParams.port;

		// setup static resources
		this.app.use(express.static("public"));
		this.app.use(express.static("views"));

		// setup templating engine
		this.app.set("view engine", "ejs");

		// setup database
		this.initDatabase();

		// setup middleware and routes
		this.initMiddleware(appInitParams.middlewares);
		this.initRoutes(appInitParams.routes);
	}

	// setup app middleware
	private initMiddleware(middlewares: { forEach: (arg0: (middleware: any) => void) => void; }) {

		// run on every request:
		middlewares.forEach((middleware) => {
			this.app.use(middleware);
		});

		// setup Employee authentication
		passport.use(Employee.createStrategy());
		passport.serializeUser(Employee.serializeUser());
		passport.deserializeUser(Employee.deserializeUser());
	}

	// setup routing
	private initRoutes(routes: { forEach: (arg0: (route: any) => void) => void; }) {

		routes.forEach((route) => {
					this.app.use(route.path, route.router);
				});

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
	private async initDatabase() {

		// determine which db to connect to (dev/production)
		var dbUrl: string = process.env.DB_URL || "mongodb://127.0.0.1:27017/petResort";
		// if (process.env.NODE_ENV === "production" && process.env.DB_URL) {
		// 	dbUrl = process.env.DB_URL;
		// }

		// async function connect() {
		// 	await mongoose.connect(dbUrl);
		// }

		try {
			await mongoose.connect(dbUrl);
			const db = mongoose.connection;
			//db.on("error", console.error.bind(console, "connection error:"));
			db.once("open", () => {
				console.log("Database connected.");
				registerSchemas();
				this.listen();
			});
		}

		catch (error) {
			console.error(error);
		}

		// connect to database + register models/schemas
		//mongoose.connect(dbUrl);
		// const db = mongoose.connection;
		// db.on("error", console.error.bind(console, "connection error:"));
		// db.once("open", () => {
		// 	console.log("Database connected.");
		// 	registerSchemas();
		// });

		// PRODUCTION
		// if (process.env.DB_URL) {
		// 	const dbUrl: string = process.env.DB_URL;
		// 	mongoose.connect(dbUrl);
		// 	const db = mongoose.connection;
		// 	db.on("error", console.error.bind(console, "connection error:"));
		// 	db.once("open", () => {
		// 		console.log("Database connected.");
		// 		// ensure all models/schemas are registered
		// 		registerSchemas();
		// 	});
		// }
		
		// DEVELOPMENT
		// connect to database + setup logging
		// mongoose.connect("mongodb://127.0.0.1:27017/petResort");
		// const db = mongoose.connection;
		// db.on("error", console.error.bind(console, "connection error:"));
		// db.once("open", () => {
		// 	console.log("Database connected.");
		// 	// ensure all models/schemas are registered
		// 	registerSchemas();
		// });
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
