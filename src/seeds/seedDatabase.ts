import mongoose = require("mongoose");
import { Guest } from "../models/guest.model";
import { Client } from "../models/client.model";
import { Visit } from "../models/visit.model";
import { Service } from "../models/service.model";
import { Kennel } from "../models/kennel.model";
import Employee = require("../models/employee.model");
import { seedEmployees } from "./employeeSeeds";
import { seedClients } from "./clientSeeds";
import { seedGuests } from "./guestSeeds";
import { seedServices } from "./serviceSeeds";
import { addVisitsData } from "./visitSeeds";
import { addVisitServicesData } from "./visitServiceSeeds";

/*
===========================================================================
seedDatabase.ts
- manually adds initial/starter records to database
- uses specific order to maintain references between record types
===========================================================================
*/

// adds employees, clients, guests, base services
const seedBaseData = async () => {
	
	// delete all employees
	await Employee.deleteMany({});
	// add seedEmployees
	for (var i = 0; i < seedEmployees.length; i++) {
		const newEmployee = new Employee({
			firstName: seedEmployees[i].firstName,
			lastName: seedEmployees[i].lastName,
			username: seedEmployees[i].username,
			role: seedEmployees[i].role,
			adminAccess: seedEmployees[i].adminAccess,
			phoneNumber: seedEmployees[i].phoneNumber,
			email: seedEmployees[i].email,
			address: seedEmployees[i].address,
			image: seedEmployees[i].image,
		});

		// hash + salt password & save, via register func
		const password = seedEmployees[i].password;
		await Employee.register(newEmployee, password);
	}

	console.log(`Added ${seedEmployees.length} employee records.`);

	// delete all clients
	await Client.deleteMany({});
	// add seedClients
	for (var i = 0; i < seedClients.length; i++) {
		const client = new Client({
			firstName: seedClients[i].firstName,
			lastName: seedClients[i].lastName,
			phoneNumber: seedClients[i].phoneNumber,
			email: seedClients[i].email,
			address: seedClients[i].address,
			image: seedClients[i].image,
		});
		await client.save();
	}

	console.log(`Added ${seedClients.length} client records.`);

	// delete all guests
	await Guest.deleteMany({});
	// add seedGuests
	for (var i = 0; i < seedGuests.length; i++) {
		// lookup owner in clients
		const owner = await Client.findOne({
			firstName: seedGuests[i].ownerFirstName,
			lastName: seedGuests[i].ownerLastName,
		});
		// if found, add guest record
		if (owner) {
			const guest = new Guest({
				name: seedGuests[i].name,
				type: seedGuests[i].type,
				breed: seedGuests[i].breed,
				owner: owner,
				age: seedGuests[i].age,
				weight: seedGuests[i].weight,
				image: seedGuests[i].image,
				notes: seedGuests[i].notes,
			});
			await guest.save();
			// then add guest to client record as pet
			owner.pets.push(guest);
			await owner.save();
		}
	}

	console.log(`Added ${seedGuests.length} guest records.`);

	// delete all visits
	await Visit.deleteMany({});

	// delete all services
	await Service.deleteMany({});
	// add seedServices
	for (var i = 0; i < seedServices.length; i++) {
		const service = new Service({
			petType: seedServices[i].petType,
			name: seedServices[i].name,
			price: seedServices[i].price,
			description: seedServices[i].description,
			serviceType: seedServices[i].serviceType,
			displayOrder: seedServices[i].displayOrder,
		});
		await service.save();
	}

	console.log(`Added ${seedServices.length} service records.`);

	// delete all kennels
	await Kennel.deleteMany({});
	// add seedKennels
	var seededKennelCount = 0;

	for (var i = 1; i < 11; i++) {
		const kennel = new Kennel({
			kennel_id: i,
			size: 's',
		});
		await kennel.save();
		seededKennelCount++;
	}

	for (var i = 11; i < 21; i++) {
		const kennel = new Kennel({
			kennel_id: i,
			size: "m",
		});
		await kennel.save();
		seededKennelCount++;
	}

	for (var i = 21; i < 26; i++) {
		const kennel = new Kennel({
			kennel_id: i,
			size: "l",
		});
		await kennel.save();
		seededKennelCount++;
	}

	console.log(`Added ${seededKennelCount} kennel records.`);
};

// CONNECTING + SEEDING
//=====================

require("dotenv").config();

async function connect() {
	if (process.env.DB_URL) {
		//var dbUrl: string = "mongodb://127.0.0.1:27017/petResort"; // dev
		var dbUrl: string = process.env.DB_URL; // production

		await mongoose.connect(dbUrl);
		const db = mongoose.connection;
		db.once("open", () => {
			console.log("Database connected.");
		});
	}
};

// connect to database
connect().then(() => console.log("Attempting to connect..."));
connect().catch((err) => console.log(err));

// execute seed function
seedBaseData().then(() =>
	addVisitsData().then(() =>
		addVisitServicesData().then(() => {
			mongoose.connection.close();
			console.log("Connection to database closed.");
		})
	)
);
