import { Application, Request, Response } from "express";
import express = require("express");
import bodyParser = require("body-parser");
import methodOverride = require('method-override');
import { v4 as uuidv4 } from 'uuid';
import mongoose = require('mongoose');
import Guest = require('./models/guest');
import Client = require("./models/client");


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

		// setup middleware and routes
		this.initMiddleware();
		this.initRoutes();

		// setup static resources
		this.app.use(express.static("public"));
		this.app.use(express.static("views"));

		// setup templating engine
		this.app.set("view engine", "ejs");

		// setup database
		this.initDatabase();
	}

	// setup app middleware
	private initMiddleware() {
		// handle JSON and form data, method override
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(methodOverride("_method"));
	}

	// setup routing
	private initRoutes() {
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
		this.app.get("/guest-records", async (req: Request, res: Response) => {
			const title = "Pet Resort · Guest Records";
			var user = "employee";
			const guests = await Guest.find({});
			var data = { title, user, guests };
			res.render(guestRecordsDir + "/index", { ...data });
		});

		// guest records: create new record - form entry
		this.app.get("/guest-records/new", (req: Request, res: Response) => {
			const title = "Pet Resort · Guest Records";
			var user = "employee";
			var data = { title, user };
			res.render(guestRecordsDir + "/new", { ...data });
		});

		// guest records: create new record - add on server
		this.app.post("/guest-records", async (req: Request, res: Response) => {
			const newGuest = new Guest(req.body);
			await newGuest.save();
			res.redirect(`/guest-records/${newGuest._id}`);
		});

		// guest records: view single record details
		this.app.get("/guest-records/:id", async (req: Request, res: Response) => {
			const title = "Pet Resort · Guest Records";
			var user = "employee";
			const { id } = req.params;
			const guest = await Guest.findById(id);
			var data = { title, user, guest };
			res.render(guestRecordsDir + "/details", { ...data });
		});

		// guest records: edit single record
		this.app.get('/guest-records/:id/edit', async (req: Request, res: Response) => {
			const title = "Pet Resort · Guest Records";
			var user = "employee";
			const { id } = req.params;
			const guest = await Guest.findById(id);
			var data = { title, user, guest };
			res.render(guestRecordsDir + '/edit', { ...data });
		})

		// guest records: update single record
		this.app.put('/guest-records/:id', async (req: Request, res: Response) => {
			const { id } = req.params;
			const guest = await Guest.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
			const title = "Pet Resort · Guest Records";
			var user = "employee";
			var data = { title, user };
			if (guest) {
				res.redirect(`/guest-records/${guest._id}`);
			}
		})

		// guest records: delete single record
		this.app.delete('/guest-records/:id', async (req: Request, res: Response) => {
			const { id } = req.params;
			const deletedGuest = await Guest.findByIdAndDelete(id);
			res.redirect('/guest-records');
		})

		// CUSTOMER ROUTES
		//=====================

		// services
		this.app.get("/services", (req: Request, res: Response) => {
			const title = "Pet Resort · Services";
			const user = "customer";
			const data = { title, user };
			res.render(customerDir + "/services", { ...data });
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

	// setup app database
	private initDatabase() {
		// setup connection logging + connect to database
		connect().then(() => console.log("Connection to database is open."));
		connect().catch((err) => console.log(err));
		async function connect() {
			await mongoose.connect("mongodb://127.0.0.1:27017/petResort");
		}
	}
}

export default App;
