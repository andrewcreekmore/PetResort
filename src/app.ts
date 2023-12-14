import { Application, Request, Response, NextFunction } from "express";
import express = require("express");
import mongoose from "mongoose";
import passport = require('passport');
import AppError = require("./utils/appError");
import { registerSchemas } from "./models/client.model";
const Employee = require("./models/employee.model");

/*
===========================================================================
app.ts
- wrapper class for Express server Application. on construct:
-- creates Express instance on passed port
-- initializes passed middleware & routes
-- inits static assets, templating engine, & database
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

		// setup middleware and routes
		this.initMiddleware(appInitParams.middlewares);
		this.initRoutes(appInitParams.routes);

		// setup database
		this.initDatabase();
	}

	// setup app middleware
	private initMiddleware(middlewares: {
		forEach: (arg0: (middleware: any) => void) => void;
	}) {
		// trust first proxy (Heroku: allow HTTPS)
		this.app.set("trust proxy", 1);

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
	private initRoutes(routes: {
		forEach: (arg0: (route: any) => void) => void;
	}) {
		routes.forEach((route) => {
			this.app.use(route.path, route.router);
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
		var dbUrl: string =  "mongodb://127.0.0.1:27017/petResort";
		if (process.env.NODE_ENV === "production" && process.env.DB_URL) {
			dbUrl = process.env.DB_URL;
		}

		try {
			// connect to database + register models/schemas
			await mongoose.connect(dbUrl);
			const db = mongoose.connection;
			db.once("open", () => {
				console.log("Database connected.");
				registerSchemas();
			});
		} catch (error) {
			console.error(error);
		}
	}

	// define listener
	public listen() {
		this.app.listen(this.port, '0.0.0.0', () => {
			console.log(
				`Server is running at http://localhost:${this.port}; ctrl + C to stop.`
			);
		});
	}
}


export default App;