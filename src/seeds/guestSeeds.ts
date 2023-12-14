
/*
===========================================================================
seedGuests.ts
- defines guest initial/starter data + seeding function
===========================================================================
*/

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
		ownerFirstName: "Lone",
		ownerLastName: "Wanderer",
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
		ownerFirstName: "Emerald",
		ownerLastName: "Herald",
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

export { seedGuests };
