import mongoose = require("mongoose");
import { Guest, IGuestDoc } from "./models/guest.model";
import { Client, IClientDoc } from "./models/client.model";
import { Visit, IVisitDoc } from "./models/visit.model";
import { Service, IServiceDoc } from "./models/service.model";



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

const seedGuests = [
	{
		name: "Alvina",
		type: "cat",
		breed: "Domestic Shorthair",
		ownerFirstName: "Andrew",
		ownerLastName: "Creekmore",
		age: 2,
		weight: 10.5,
		image: "../img/alvi.jpg",
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
		image: "../img/eleanor.jpg",
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
		image: "../img/sif.jpg",
		notes: "",
	},
	{
		name: "Dogmeat",
		type: "dog",
		breed: "German Shepherd",
		ownerFirstName: "JC",
		ownerLastName: "Denton",
		age: 5,
		weight: 67,
		image: "../img/dogmeat.png",
		notes: "",
	},
	{
		name: "Blade Wolf",
		type: "dog",
		breed: "Unmanned Weapon",
		ownerFirstName: "Jack",
		ownerLastName: "Raiden",
		age: 3,
		weight: 114,
		image: "../img/bladeWolf.jpg",
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
		image: "../img/shalquoir.png",
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
			streetAddress: "421 Nitsche Lock",
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
		firstName: "JC",
		lastName: "Denton",
		phoneNumber: 2025550167,
		email: "unatco29@email.com",
		address: {
			streetAddress: "781 Terry Freeway",
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
			streetAddress: "11075 Kamille Field",
			city: "Bellside",
			state: "Washington",
			zip: 88860,
		},
	},
	{
		firstName: "Adam",
		lastName: "Jensen",
		phoneNumber: 7015550158,
		email: "adam.jensen@si.det.usa ",
		address: {
			streetAddress: "468 Front St",
			apartment: "5375",
			city: "Detroit",
			state: "Michigan",
			zip: 48226,
		},
	},
];

const seedServices = [
	{
		// petType: ["cat"],
		name: "Nail Trim",
		price: 10,
		description: "",
	},
	{
		// petType: ["dog"],
		name: "Nail Grind & Trim",
		price: 15,
		description: "",
	},
	{
		// petType: ["cat", "dog"],
		name: "Haircut",
		price: 10,
		description: "",
	},
	{
		// petType: ["cat", "dog"],
		name: "Ear Cleaning",
		price: 10,
		description: "",
	},
	{
		// petType: ["cat"],
		name: "Bath & Brush",
		price: 10,
		description: "",
	},
	// {
	// 	petType: ["dog"],
	// 	name: "Bath & Brush",
	// 	price: 15,
	// 	description: "",
	// },
	{
		// petType: ["cat"],
		name: "Full Service",
		price: 30,
		description:
			"Includes bath, brushing, haircut, nail trim, and ear cleaning.",
	},
	{
		// petType: ["dog"],
		name: "Full Service",
		price: 40,
		description:
			"Includes bath, brushing, haircut, nail trim, and ear cleaning.",
	},
	// add-on service packages
	{
		// petType: ["dog"],
		name: "Deluxe",
		price: 10,
		description:
			"Base service PLUS premium shampoo & conditioner, teeth brushing & breath freshener, cologne spritz, and bandana or bow.",
	},
	{
		// petType: ["dog"],
		name: "Luxury",
		price: 10,
		description:
			"Deluxe service PLUS luxury shampoo, conditioner & spritz, paw & nose balm and premium face wash.",
	},
];

// function to seed database with initial data
const seedDB = async () => {
	// delete all addresses
	// await Address.deleteMany({});
	// // add seedAddresses
	// for (var i = 0; i < seedAddresses.length; i++) {
	// 	const address = new Address({
	// 		zip: seedAddresses[i].zip,
	// 		state: seedAddresses[i].state,
	// 		city: seedAddresses[i].city,
	// 		street: seedAddresses[i].street,
	// 		houseNumber: seedAddresses[i].houseNumber,
	// 		apartment: seedAddresses[i].apartment,
	// 	});
	// 	await address.save();
	// }

	//console.log(`Added ${seedAddresses.length} address records.`);

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
			// petType: seedServices[i].petType,
			name: seedServices[i].name,
			price: seedServices[i].price,
			description: seedServices[i].description,
		});
		await service.save();
	}

	console.log(`Added ${seedServices.length} service records.`);
};

// ADDING CLIENT-GUEST RELATIONSHIP

// const clientGuestSeed = [
// 	{ guest: "Alvina", clientFirstName: "Andrew", clientLastName: "Creekmore" },
// 	{ guest: "Eleanor Rigby", clientFirstName: "Andrew", clientLastName: "Creekmore" },
// ];

const makeRelationships = async () => {
	// for (var i = 0; i < clientGuestSeed.length; i++) {
	// 	const guest = await Guest.findOne({ name: clientGuestSeed[i].guest });
	// 	const client = await Client.findOne({
	// 		firstName: clientGuestSeed[i].clientFirstName,
	// 		lastName: clientGuestSeed[i].clientLastName,
	// 	});

	// 	if (guest && client) {
	// 		guest.owner = client;
	// 		client.pets.push(guest);
	// 		await guest.save();
	// 		await client.save();
	// 	}
	// }
}

// ADDING ADDRESS RECORDS TO SEEDED CLIENTS

// const addClientAdresses = async () => {
// 	for (var i = 0; i < seedAddresses.length; i++) {
// 		const client = await Client.findOne({
// 			firstName: seedClients[i].firstName,
// 			lastName: seedClients[i].lastName,
// 		});

// 		if (client) {
// 			const address = await Address.findOne( 
// 				{ zip: seedAddresses[i].zip }, 
// 				{ street: seedAddresses[i].street },
// 				{ houseNumber: seedAddresses[i].houseNumber });
// 			if (address) {
// 				client.address = address;
// 				await client.save();
// 			}
// 		}
// 	}
// }

// ADDING VISITS RECORDS TO SEEDED GUESTS
const guestVisitsSeed = [
	{
		guest: "Alvina",
		visits: [
			{ startDate: "2021-10-24", endDate: "2021-10-29" },
			{ startDate: "2022-3-6", endDate: "2022-3-17" },
		],
	},
	{
		guest: "Eleanor Rigby",
		visits: [
			{ startDate: "2014-4-18", endDate: "2014-4-23" },
			{ startDate: "2016-6-2", endDate: "2016-6-11" },
		],
	},
];

const addVisitsData = async () => {
	for (var i = 0; i < guestVisitsSeed.length; i++) {
		const guest = await Guest.findOne({ name: guestVisitsSeed[i].guest });

		if (guest) {

			for (var j = 0; j < guestVisitsSeed[i].visits.length; j++) {
				const newVisit = new Visit({
					guest: guest, 
					number: j + 1, // start at 1, not 0 
					startDate: guestVisitsSeed[i].visits[j].startDate,
					endDate: guestVisitsSeed[i].visits[j].endDate,
				});
				await newVisit.save();
				guest.visits?.push(newVisit);
			}
			await guest.save();
		}
	}
}

// ADDING SERVICE RECORDS TO SEEDED VISITS
const visitServicesSeed = [
	{
		guest: "Alvina",
		visits: [
			{ startDate: "2022-3-6" },
			{ startDate: "2021-10-24" },
		],
		services: [
			[
				{ name: "Nail Trim" }, { name: 'Bath & Brush' }
			],
			[
				{ name: 'Full Service'},
			],
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
					for (var k = 0; k < visitServicesSeed[i].services[j].length; k++) {
						const service = await Service.findOne({
							name: visitServicesSeed[i].services[j][k].name
						});
						
						if (service) {
							visit.services.push(service);
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
	//addClientAdresses().then(() => 
		makeRelationships().then(() => 
			addVisitsData().then(() => 
				addServicesData().then(() => {
					mongoose.connection.close();
					console.log("Connection to database closed.");
				})
			)
		)
	)	
//)
