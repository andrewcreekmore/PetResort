
/*
===========================================================================
seedEmployees.ts
- defines employee initial/starter data
===========================================================================
*/

const seedEmployees = [
	{
		firstName: "_GLaDOS",
		lastName: "_",
		role: "Owner",
		adminAccess: true,
		username: "admin",
		password: "admin",
		phoneNumber: 5707903431,
		email: "admin@aperture.com",
		address: {
			streetAddress: "2545 High Meadow Ln",
			city: "Hazleton",
			state: "Pennsylvania",
			zip: 18201,
		},
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702405621/PetResort/glados_p9pops.png",
			filename: "glados_p9pops.png",
		},
	},
	{
		firstName: "Heather",
		lastName: "Mason",
		role: "Manager",
		adminAccess: true,
		username: "hmason",
		password: "alessa",
		phoneNumber: 2673502559,
		email: "bread@valtiel.org",
		address: {
			streetAddress: "4946 Valley Dr",
			city: "Silent Hill",
			state: "Pennsylvania",
			zip: 18640,
		},
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702404969/PetResort/heather_cmt8dr.jpg",
			filename: "heather_cmt8dr.jpg",
		},
	},
	{
		firstName: "B.J.",
		lastName: "Blazkowicz",
		role: "CSR",
		adminAccess: false,
		username: "blazko",
		password: "killthenazis",
		phoneNumber: 4025522235,
		email: "terrorbilly@osa.gov",
		address: {
			streetAddress: "1533 Commerce Blvd",
			city: "Mesquite",
			state: "Texas",
			zip: 75150,
		},
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702405026/PetResort/blazko_v1pjdm.jpg",
			filename: "blazko_v1pjdm.jpg",
		},
	},
	{
		firstName: "Chloe",
		lastName: "Frazer",
		role: "CSR",
		adminAccess: false,
		username: "cfrazer",
		password: "lostlegacy",
		phoneNumber: 9252712160,
		email: "ganesh@shoreline.org",
		address: {
			streetAddress: "4048 Water St",
			city: "Oakland",
			state: "California",
			zip: 94612,
		},
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702405102/PetResort/chloe_rq1n4t.png",
			filename: "chloe_rq1n4t.png",
		},
	},
	{
		firstName: "Alex",
		lastName: "Casey",
		role: "CSR",
		adminAccess: false,
		username: "acasey",
		password: "maximumpayne",
		phoneNumber: 3478818217,
		email: "payne@nypd.gov",
		address: {
			streetAddress: "1144 Redbud Dr",
			apartment: "4A",
			city: "Brooklyn",
			state: "New York",
			zip: 11227,
		},
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702405249/PetResort/alex_ok81s2.png",
			filename: "alex_ok81s2.png",
		},
	},
	{
		firstName: "Flynn",
		lastName: "Taggart",
		role: "Groomer",
		adminAccess: false,
		username: "ftaggart",
		password: "unionaerospace",
		phoneNumber: 9528546136,
		email: "doomslayer@uac.org",
		address: {
			streetAddress: "4351 Orchard St",
			city: "Bloomington",
			state: "Minnesota",
			zip: 55431,
		},
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702405513/PetResort/doomguy_v83jo7.png",
			filename: "doomguy_v83jo7.png",
		},
	},
	{
		firstName: "Seb",
		lastName: "Castellanos",
		role: "Groomer",
		adminAccess: false,
		username: "scastellanos",
		password: "evilwithin",
		phoneNumber: 4154834342,
		email: "seb@kcpd.gov",
		address: {
			streetAddress: "3191 Palmer Rd",
			city: "Krimson City",
			state: "Ohio",
			zip: 43085,
		},
		image: {
			url: "https://res.cloudinary.com/doawnm5zz/image/upload/v1702405556/PetResort/seb_wxnuoa.png",
			filename: "seb_wxnuoa.png",
		},
	},
];

export { seedEmployees };
