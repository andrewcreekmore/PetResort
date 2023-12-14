import { Client } from "../models/client.model";

/*
===========================================================================
seedClients.ts
- defines client initial/starter data
===========================================================================
*/

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
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702403822/PetResort/andrew_obxc85.jpg",
			filename: "andrew.jpg",
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
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702403992/PetResort/artorias_b8npc4.jpg",
			filename: "artorias.jpg",
		},
	},
	{
		firstName: "Lone",
		lastName: "Wanderer",
		phoneNumber: 2025550167,
		email: "101@vault-tec.com",
		address: {
			streetAddress: "781 Terry Fwy",
			city: "Domenicoshire",
			state: "Minnesota",
			zip: 44250,
		},
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702404070/PetResort/loneWanderer_hckmt6.png",
			filename: "loneWanderer_hckmt6.png",
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
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702403723/PetResort/raiden_pkitpc.jpg",
			filename: "raiden_pkitpc.jpg",
		},
	},
	{
		firstName: "Emerald",
		lastName: "Herald",
		phoneNumber: 7015550158,
		email: "bearseek@lest.com",
		address: {
			streetAddress: "468 Front St",
			apartment: "5375",
			city: "Detroit",
			state: "Michigan",
			zip: 48226,
		},
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702401493/PetResort/emerald_nikejz.png",
			filename: "emerald_nikejz.png",
		},
	},
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
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702404151/PetResort/jill_amtvpw.jpg",
			filename: "jill_amtvpw.jpg",
		},
	},
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
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702404316/PetResort/ellie_la9hlo.jpg",
			filename: "ellie_la9hlo.jpg",
		},
	},
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
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702404378/PetResort/wesker_qpdu9o.png",
			filename: "wesker_qpdu9o.png",
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
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702404459/PetResort/henry_mwhe2e.png",
			filename: "henry_mwhe2e.png",
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
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702404624/PetResort/liara_lgxsht.png",
			filename: "liara_lgxsht.png",
		},
	},
];

export { seedClients };
