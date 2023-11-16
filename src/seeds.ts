import mongoose = require("mongoose");
import { Guest, IGuestDoc } from "./models/guest.model";
import { Client, IClientDoc } from "./models/client.model";
import { Visit, IVisitDoc } from "./models/visit.model";
import { Service, IServiceDoc } from "./models/service.model";
import { IKennelDoc, Kennel } from "./models/kennel.model";
import Employee = require("./models/employee.model");
import { isFuture } from "date-fns";


/*
===========================================================================
seeds.ts
- for manually adding initial/starter records to database
===========================================================================
*/


// setup connection logging + connect to database
connect().then(() => console.log("Connection to database is open."));
connect().catch((err) => console.log(err));
async function connect() {
    await mongoose.connect("mongodb://127.0.0.1:27017/petResort");
}

const seedEmployees = [
	{
		firstName: "GLaDOS",
		lastName: "_",
		role: "Owner",
		adminAccess: true,
		username: 'admin',
		password: 'admin',
		phoneNumber: 5707903431,
		email: "admin@aperture.com",
		address: {
			streetAddress: "2545 High Meadow Ln",
			city: "Hazleton",
			state: "Pennsylvania",
			zip: 18201,
		},
	},
];

const seedGuests = [
	{
		name: "Alvina",
		type: "cat",
		breed: "Domestic Shorthair",
		ownerFirstName: "Andrew",
		ownerLastName: "Creekmore",
		age: 2,
		weight: 10.5,
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1699384679/PetResort/alvi_rumvjx.jpg",
			filename: "alvi_rumvjx.jpg",
		},
		notes: "",
	},
	{
		name: "Eleanor Rigby",
		type: "cat",
		breed: "Domestic Shorthair",
		ownerFirstName: "Andrew",
		ownerLastName: "Creekmore",
		age: 14,
		weight: 6.2,
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1699384685/PetResort/eleanor_faaard.jpg",
			filename: "eleanor_faaard.jpg",
		},
		notes: "",
	},
	{
		name: "Sif",
		type: "dog",
		breed: "Great Grey Wolf",
		ownerFirstName: "Knight",
		ownerLastName: "Artorias",
		age: 12,
		weight: 73,
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1699384676/PetResort/sif_tat8yg.jpg",
			filename: "sif_tat8yg.jpg",
		},
		notes: "",
	},
	{
		name: "Dogmeat",
		type: "dog",
		breed: "German Shepherd",
		ownerFirstName: "J.C.",
		ownerLastName: "Denton",
		age: 5,
		weight: 67,
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1699384683/PetResort/dogmeat_okyvne.png",
			filename: "dogmeat_okyvne.png",
		},
		notes: "",
	},
	{
		name: "Blade Wolf",
		type: "dog",
		breed: "Unmanned Weapon",
		ownerFirstName: "Jack",
		ownerLastName: "Raiden",
		age: 3,
		weight: 264,
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1699384681/PetResort/bladeWolf_a6hfdn.jpg",
			filename: "bladeWolf_a6hfdn.jpg",
		},
		notes: "Possesses an intellect far beyond human reckoning.",
	},
	{
		name: "Sweet Shalquoir",
		type: "cat",
		breed: "Norwegian Forest Cat",
		ownerFirstName: "Adam",
		ownerLastName: "Jensen",
		age: 6,
		weight: 11,
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1699384675/PetResort/shalquoir_swxsdt.png",
			filename: "shalquoir_swxsdt.png",
		},
		notes: "",
	},
	{
		name: "Cerebus",
		type: "dog",
		breed: "Doberman Pinscher",
		ownerFirstName: "Albert",
		ownerLastName: "Wesker",
		age: 3,
		weight: 172,
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1699640954/PetResort/cerebus_csifid.png",
			filename: "cerebus_csifid.png",
		},
		notes: "",
	},
	{
		name: "KEI-9",
		type: "dog",
		breed: "FENRIS Mech",
		ownerFirstName: "Liara",
		ownerLastName: "T'Soni",
		age: 2,
		weight: 76,
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1699641645/PetResort/kei-9_txkrzr.png",
			filename: "kei-9_txkrzr.png",
		},
		notes: "",
	},
	{
		name: "Nemesis",
		type: "dog",
		breed: "Bio Organic Weapon",
		ownerFirstName: "Jill",
		ownerLastName: "Valentine",
		age: 1,
		weight: 432,
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1699643111/PetResort/nemesis_ghlk0n.png",
			filename: "nemesis_ghlk0n.png",
		},
		notes: "",
	},
	{
		name: "Alice",
		type: "dog",
		breed: "Belgian Malinois",
		ownerFirstName: "Ellie",
		ownerLastName: "Williams",
		age: 3,
		weight: 84,
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1699643795/PetResort/alice2_ivpyuy.png",
			filename: "alice2_ivpyuy.png",
		},
		notes: "",
	},
	{
		name: "Sniffer",
		type: "dog",
		breed: "Hound of Tindalos",
		ownerFirstName: "Henry",
		ownerLastName: "Townshend",
		age: 4,
		weight: 91,
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1699644448/PetResort/sniffer_rn3sai.png",
			filename: "sniffer_rn3sai.png",
		},
		notes: "",
	},
];

const seedClients = [
	{
		firstName: "Andrew",
		lastName: "Creekmore",
		phoneNumber: 3035550110,
		email: "ac85@email.com",
		address: {
			streetAddress: "421 Nitsche Rd",
			apartment: "926",
			city: "Howeshire",
			state: "Mississippi",
			zip: 13882,
		},
	},
	{
		firstName: "Knight",
		lastName: "Artorias",
		phoneNumber: 2676380329,
		email: "abysswalker@email.com",
		address: {
			streetAddress: "9532 Peyton Cliffs",
			apartment: "532",
			city: "McClurehaven",
			state: "Oklahoma",
			zip: 37921,
		},
	},
	{
		firstName: "J.C.",
		lastName: "Denton",
		phoneNumber: 2025550167,
		email: "unatco29@email.com",
		address: {
			streetAddress: "781 Terry Fwy",
			city: "Domenicoshire",
			state: "Minnesota",
			zip: 44250,
		},
	},
	{
		firstName: "Jack",
		lastName: "Raiden",
		phoneNumber: 6035550146,
		email: "whitedevil@email.com",
		address: {
			streetAddress: "11075 Kamille Rd",
			city: "Bellside",
			state: "Washington",
			zip: 88860,
		},
	},
	{
		firstName: "Adam",
		lastName: "Jensen",
		phoneNumber: 7015550158,
		email: "adam.jensen@si.det.usa",
		address: {
			streetAddress: "468 Front St",
			apartment: "5375",
			city: "Detroit",
			state: "Michigan",
			zip: 48226,
		},
	},
	// {
	// 	firstName: "B.J.",
	// 	lastName: "Blazkowicz",
	// 	phoneNumber: 4025522235,
	// 	email: "terrorbilly@osa.gov",
	// 	address: {
	// 		streetAddress: "1533 Commerce Blvd",
	// 		apartment: "",
	// 		city: "Mesquite",
	// 		state: "Texas",
	// 		zip: 75150,
	// 	},
	// },
	{
		firstName: "Jill",
		lastName: "Valentine",
		phoneNumber: 8082522072,
		email: "sammich@stars.gov",
		address: {
			streetAddress: "4391 Stratford Dr",
			apartment: "6F",
			city: "Raccoon City",
			state: "Missouri",
			zip: 63052,
		},
	},
	// {
	// 	firstName: "Flynn",
	// 	lastName: "Taggart",
	// 	phoneNumber: 9528546136,
	// 	email: "slayer@uac.org",
	// 	address: {
	// 		streetAddress: "4351 Orchard St",
	// 		apartment: "",
	// 		city: "Bloomington",
	// 		state: "Minnesota",
	// 		zip: 55431,
	// 	},
	// },
	// {
	// 	firstName: "Seb",
	// 	lastName: "Castellanos",
	// 	phoneNumber: 4154834342,
	// 	email: "seb@kcpd.gov",
	// 	address: {
	// 		streetAddress: "3191 Palmer Rd",
	// 		apartment: "",
	// 		city: "Krimson City",
	// 		state: "Ohio",
	// 		zip: 43085,
	// 	},
	// },
	{
		firstName: "Ellie",
		lastName: "Williams",
		phoneNumber: 6107851319,
		email: "brickmaster@firefly.org",
		address: {
			streetAddress: "1811 Filbert St",
			apartment: "",
			city: "Jackson",
			state: "Wyoming",
			zip: 83001,
		},
	},
	// {
	// 	firstName: "Alex",
	// 	lastName: "Casey",
	// 	phoneNumber: 3478818217,
	// 	email: "payne@nypd.gov",
	// 	address: {
	// 		streetAddress: "1144 Redbud Dr",
	// 		apartment: "4A",
	// 		city: "Brooklyn",
	// 		state: "New York",
	// 		zip: 11227,
	// 	},
	// },
	// {
	// 	firstName: "Chloe",
	// 	lastName: "Frazer",
	// 	phoneNumber: 9252712160,
	// 	email: "ganesh@shoreline.org",
	// 	address: {
	// 		streetAddress: "4048 Water St",
	// 		apartment: "",
	// 		city: "Oakland",
	// 		state: "California",
	// 		zip: 94612,
	// 	},
	// },
	{
		firstName: "Albert",
		lastName: "Wesker",
		phoneNumber: 9175078656,
		email: "saturation@umbrella.org",
		address: {
			streetAddress: "50 Geneva Street",
			apartment: "",
			city: "New York",
			state: "New York",
			zip: 10031,
		},
	},
	{
		firstName: "Henry",
		lastName: "Townshend",
		phoneNumber: 5707946258,
		email: "21sacraments@wishhouse.org",
		address: {
			streetAddress: "2021 Cooper Rd",
			apartment: "302",
			city: "South Ashfield",
			state: "Pennsylvania",
			zip: 18640,
		},
	},
	{
		firstName: "Liara",
		lastName: "T'Soni",
		phoneNumber: 7722639498,
		email: "shadowbroker@n7.org",
		address: {
			streetAddress: "4115 Elkview Dr",
			apartment: "",
			city: "Batavia",
			state: "New York",
			zip: 14020,
		},
	},
];

const seedKennels = [
	{
		kennel_id: "1",
		size: "s",
	},
	{
		kennel_id: "2",
		size: "m",
	},
	{
		kennel_id: "3",
		size: "l",
	},
];

const seedServices = [
	{
		petType: "cat",
		name: "Nail Trim",
		price: 10,
		description: "",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "dog",
		name: "Nail Grind & Trim",
		price: 15,
		description: "",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "cat",
		name: "Haircut",
		price: 10,
		description: "",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "dog",
		name: "Haircut",
		price: 15,
		description: "",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "cat",
		name: "Ear Cleaning",
		price: 10,
		description: "",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "dog",
		name: "Ear Cleaning",
		price: 15,
		description: "",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "cat",
		name: "Bath & Brush",
		price: 10,
		description: "",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "dog",
		name: "Bath & Brush",
		price: 15,
		description: "",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "cat",
		name: "Full Service",
		price: 30,
		description:
			"Includes bath, brushing, haircut, nail trim, and ear cleaning.",
		serviceType: "package",
		displayOrder: 2,
	},
	{
		petType: "dog",
		name: "Full Service",
		price: 40,
		description:
			"Includes bath, brushing, haircut, nail trim, and ear cleaning.",
		serviceType: "package",
		displayOrder: 2,
	},
	// add-on service packages
	{
		petType: "dog",
		name: "Deluxe",
		price: 10,
		description:
			"Base service PLUS premium shampoo & conditioner, teeth brushing & breath freshener, cologne spritz, and bandana or bow.",
		serviceType: "add-on",
		displayOrder: 3,
	},
	{
		petType: "dog",
		name: "Luxury",
		price: 10,
		description:
			"Deluxe service PLUS luxury shampoo, conditioner & spritz, paw & nose balm and premium face wash.",
		serviceType: "add-on",
		displayOrder: 3,
	},
];

// function to seed database with initial data
const seedDB = async () => {
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
	for (var i = 0; i < seedKennels.length; i++) {
		const kennel = new Kennel({
			kennel_id: seedKennels[i].kennel_id,
			size: seedKennels[i].size,
		});
		await kennel.save();
	}

	console.log(`Added ${seedKennels.length} kennel records.`);
};

// ADDING VISITS RECORDS TO SEEDED GUESTS
const guestVisitsSeed = [
	{
		guest: "Alvina",
		visits: [
			{ startDate: "2021-10-24", endDate: "2021-10-29", assignedKennel: "2" },
			{ startDate: "2023-11-11", endDate: "2023-11-27", assignedKennel: "2" },
		],
	},
	{
		guest: "Eleanor Rigby",
		visits: [
			{ startDate: "2014-4-18", endDate: "2014-4-23", assignedKennel: "1" },
			{ startDate: "2016-6-2", endDate: "2016-6-11", assignedKennel: "1" },
		],
	},
	{
		guest: "Blade Wolf",
		visits: [
			{ startDate: "2023-11-21", endDate: "2023-11-26", assignedKennel: "3" },
			{ startDate: "2022-9-12", endDate: "2016-9-17", assignedKennel: "3" },
		],
	},
];

const addVisitsData = async () => {
	for (var i = 0; i < guestVisitsSeed.length; i++) {
		const guest = await Guest.findOne({ name: guestVisitsSeed[i].guest });

		if (guest) {

			for (var j = 0; j < guestVisitsSeed[i].visits.length; j++) {

				const kennel = await Kennel.findOne({
						kennel_id: guestVisitsSeed[i].visits[j].assignedKennel,
					});
		
				const newVisit = new Visit({
					guest: guest,
					number: j + 1, // start at 1, not 0
					assignedKennel: kennel,
					startDate: guestVisitsSeed[i].visits[j].startDate,
					endDate: guestVisitsSeed[i].visits[j].endDate,
					clearServicesRenderedFlag: false,
				});
				await newVisit.save();
				guest.visits?.push(newVisit);

				// add Guest as property on corresponding Kennel if occupancy is current
				if (isFuture(+(newVisit.endDate)) && kennel) {
					kennel.occupant = guest
					await kennel.save();
				}

			}
			await guest.save();
		}
	}
}

// ADDING SERVICE RECORDS TO SEEDED VISITS
const visitServicesSeed = [
	{
		guest: "Alvina",
		visits: [{ startDate: "2022-3-6" }, { startDate: "2021-10-24" }],
		services: [
			[
				{ petType: "cat", name: "Nail Trim" },
				{ petType: "cat", name: "Bath & Brush" },
			],
			[{ petType: "cat", name: "Full Service" }],
		],
		servicesRendered: [
			[{ petType: "cat", name: "Nail Trim" }],
			[],
		],
	},
];

const addServicesData = async () => {
	for (var i = 0; i < visitServicesSeed.length; i++) {
		const guest = await Guest.findOne({ name: visitServicesSeed[i].guest });

		if (guest) {
			for (var j = 0; j < visitServicesSeed[i].visits.length; j++) {
				const visit = await Visit.findOne({
					startDate: visitServicesSeed[i].visits[j].startDate,
				});

				if (visit) {
					// adding services
					for (var k = 0; k < visitServicesSeed[i].services[j].length; k++) {
						const service = await Service.findOne({
							name: visitServicesSeed[i].services[j][k].name,
							petType: visitServicesSeed[i].services[j][k].petType,
						});
						
						if (service) {
							visit.services.push(service);
						}
					}
					// adding services rendered
					for (var k = 0; k < visitServicesSeed[i].servicesRendered[j].length; k++) {
						const service = await Service.findOne({
							name: visitServicesSeed[i].servicesRendered[j][k].name,
							petType: visitServicesSeed[i].servicesRendered[j][k].petType,
						});

						if (service) {
							visit.servicesRendered.push(service);
						}
					}	
					await visit.save();
				}
			}
		}
	}
}

// execute seed function
seedDB().then(() => 
	addVisitsData().then(() => 
		addServicesData().then(() => {
			mongoose.connection.close();
			console.log("Connection to database closed.");
		})
	)
)
