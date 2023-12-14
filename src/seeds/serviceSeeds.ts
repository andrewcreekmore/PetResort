
/*
===========================================================================
seedServices.ts
- defines services initial/starter data 
===========================================================================
*/

const seedServices = [
	{
		petType: "cat",
		name: "Nail Trim",
		price: 10,
		description: "Nails carefully trimmed and electronically filed.",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "dog",
		name: "Nail Buff & Trim",
		price: 10,
		description:
			"Nails carefully buffed and trimmed for a smooth, rounded finish.",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "cat",
		name: "Haircut",
		price: 10,
		description:
			"Keeps your long-haired feline trimmed to reduce matting and ease maintenance.",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "dog",
		name: "Haircut",
		price: 15,
		description:
			"Reduces matting and eases mainteance. Includes sanitary trim.",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "cat",
		name: "Ear Cleaning",
		price: 10,
		description: "Thorough yet gentle ear cleaning to prevent infection.",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "dog",
		name: "Ear Cleaning",
		price: 10,
		description: "Thorough yet gentle ear cleaning to prevent infection.",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "cat",
		name: "Bath & Brush",
		price: 10,
		description:
			"Special de-shed rejuvenating shampoo and conditioner and a coat brushing to bring out softness and shine.",
		serviceType: "basic",
		displayOrder: 1,
	},
	{
		petType: "dog",
		name: "Bath & Brush",
		price: 15,
		description:
			"Special de-shed rejuvenating shampoo and conditioner and a coat brushing to bring out softness and shine.",
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
		petType: "cat",
		name: "Deluxe",
		price: 10,
		description:
			"Base service PLUS premium shampoo & conditioner, teeth brushing & breath freshener, spritz, and bandana or bow.",
		serviceType: "add-on",
		displayOrder: 3,
	},
	{
		petType: "dog",
		name: "Deluxe",
		price: 10,
		description:
			"Base service PLUS premium shampoo & conditioner, teeth brushing & breath freshener, spritz, and bandana or bow.",
		serviceType: "add-on",
		displayOrder: 3,
	},
	{
		petType: "cat",
		name: "Luxury",
		price: 15,
		description:
			"Deluxe service PLUS luxury shampoo, conditioner & spritz, paw & nose balm and premium face wash.",
		serviceType: "add-on",
		displayOrder: 3,
	},
	{
		petType: "dog",
		name: "Luxury",
		price: 15,
		description:
			"Deluxe service PLUS luxury shampoo, conditioner & spritz, paw & nose balm and premium face wash.",
		serviceType: "add-on",
		displayOrder: 3,
	},
];

export { seedServices };
