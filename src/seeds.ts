import mongoose = require("mongoose");
import Guest = require("./models/guest");
import Client = require("./models/client");

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
		age: 2,
		breed: "Domestic Shorthair",
	},
	{
		name: "Sif",
		type: "dog",
		age: 12,
		breed: "Great Grey Wolf",
	},
	{
		name: "Dogmeat",
		type: "dog",
		age: 5,
		breed: "German Shepherd",
	},
	{
		name: "Blade Wolf",
		type: "dog",
		age: 3,
		breed: "Unmanned Weapon",
	},
	{
		name: "Sweet Shalquoir",
		type: "cat",
		age: 6,
		breed: "Norwegian Forest Cat",
	}
];

// insert initial guest records
Guest.insertMany(seedGuests)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
})

const seedClients = [
    {
        firstName: 'Andrew',
        lastName: 'Creekmore'
    }
]

// insert initial client records
Client.insertMany(seedClients)
	.then((res) => {
		console.log(res);
	})
	.catch((err) => {
		console.log(err);
});