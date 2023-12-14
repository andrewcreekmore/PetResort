import { Visit } from "../models/visit.model";
import { Guest } from "../models/guest.model";
import { Service } from "../models/service.model";
import { randIntInRange, randDateInRange } from "../utils/random"

/*
===========================================================================
seedVisitServices.ts
- defines services for initial/starter visits data + seeding function
===========================================================================
*/

const addVisitServicesData = async () => {
	for (var i = 0; i < visitServicesSeed.length; i++) {
		const guest = await Guest.findOne({ name: visitServicesSeed[i].guest });

		if (guest) {
			for (var j = 0; j < visitServicesSeed[i].visits.length; j++) {
				const visit = await Visit.findOne({
					guest: guest._id,
					number: visitServicesSeed[i].visits[j].number,
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

							if (visit.checkedOut) {
								visitServicesSeed[i].servicesRendered[j].push(service);
							}
						}
					}
					// adding services rendered
					for (
						var k = 0;
						k < visitServicesSeed[i].servicesRendered[j].length;
						k++
					) {
						const service = await Service.findOne({
							name: visitServicesSeed[i].servicesRendered[j][k].name,
							petType: visitServicesSeed[i].servicesRendered[j][k].petType,
						});

						if (service) {
							visit.servicesRendered.push(service);

							const possibleGroomers = [
								"ftaggart",
								"scastellanos",
								"cfrazer",
								"hmason",
								"acasey",
								"blazko",
							];

							visit.servicesRenderedByMap.set(
								service._id,
								possibleGroomers[randIntInRange(0, possibleGroomers.length - 1)]
							);

							var startDate = new Date(+visit.startDate);
							var endDate = new Date(+visit.endDate);

							var completionDate = randDateInRange(startDate, endDate);
							visit.servicesRenderedDateMap.set(service._id, +completionDate);
						}
					}

					await visit.save();
				}
			}
		}
	}
};

// ADDING SERVICE RECORDS TO SEEDED VISITS
const visitServicesSeed = [
	{
		guest: "Alvina",
		visits: [{ number: 3 }, { number: 2 }, { number: 1 }],
		services: [
			[
				{ petType: "cat", name: "Nail Trim" },
				{ petType: "cat", name: "Bath & Brush" },
			],
			[
				{ petType: "cat", name: "Nail Trim" },
				{ petType: "cat", name: "Haircut" },
			],
			[{ petType: "cat", name: "Full Service" }],
		],
		servicesRendered: [
			[
				{ petType: "cat", name: "Nail Trim" },
				{ petType: "cat", name: "Bath & Brush" },
			],
			[],
			[],
		],
	},
	{
		guest: "Eleanor Rigby",
		visits: [{ number: 4 }, { number: 3 }, { number: 2 }, { number: 1 }],
		services: [
			[{ petType: "cat", name: "Full Service" }],
			[
				{ petType: "cat", name: "Ear Cleaning" },
				{ petType: "cat", name: "Haircut" },
				{ petType: "cat", name: "Bath & Brush" },
			],
			[
				{ petType: "cat", name: "Full Service" },
				{ petType: "cat", name: "Deluxe" },
			],
			[
				{ petType: "cat", name: "Nail Trim" },
				{ petType: "cat", name: "Bath & Brush" },
			],
		],
		servicesRendered: [[], [], [], []],
	},
	{
		guest: "Blade Wolf",
		visits: [{ number: 3 }, { number: 2 }, { number: 1 }],
		services: [
			[
				{ petType: "dog", name: "Ear Cleaning" },
				{ petType: "dog", name: "Bath & Brush" },
			],
			[
				{ petType: "dog", name: "Full Service" },
				{ petType: "dog", name: "Deluxe" },
			],
			[
				{ petType: "dog", name: "Haircut" },
				{ petType: "dog", name: "Bath & Brush" },
			],
		],
		servicesRendered: [[{ petType: "dog", name: "Ear Cleaning" }], [], []],
	},
	{
		guest: "Sif",
		visits: [{ number: 4 }, { number: 3 }, { number: 2 }, { number: 1 }],
		services: [
			[
				{ petType: "dog", name: "Nail Buff & Trim" },
				{ petType: "dog", name: "Bath & Brush" },
			],
			[
				{ petType: "dog", name: "Full Service" },
				{ petType: "dog", name: "Deluxe" },
			],
			[
				{ petType: "dog", name: "Haircut" },
				{ petType: "dog", name: "Bath & Brush" },
			],
			[{ petType: "dog", name: "Haircut" }],
		],
		servicesRendered: [
			[
				{ petType: "dog", name: "Nail Buff & Trim" },
				{ petType: "dog", name: "Bath & Brush" },
			],
			[],
			[],
			[],
		],
	},
	{
		guest: "Dogmeat",
		visits: [{ number: 3 }, { number: 2 }, { number: 1 }],
		services: [
			[{ petType: "dog", name: "Bath & Brush" }],
			[
				{ petType: "dog", name: "Ear Cleaning" },
				{ petType: "dog", name: "Haircut" },
			],
			[
				{ petType: "dog", name: "Nail Buff & Trim" },
				{ petType: "dog", name: "Bath & Brush" },
			],
		],
		servicesRendered: [[{ petType: "dog", name: "Bath & Brush" }], [], []],
	},
	{
		guest: "Sweet Shalquoir",
		visits: [{ number: 3 }, { number: 2 }, { number: 1 }],
		services: [
			[
				{ petType: "cat", name: "Full Service" },
				{ petType: "cat", name: "Luxury" },
			],
			[
				{ petType: "cat", name: "Full Service" },
				{ petType: "cat", name: "Luxury" },
			],
			[
				{ petType: "cat", name: "Ear Cleaning" },
				{ petType: "cat", name: "Nail Trim" },
				{ petType: "cat", name: "Bath & Brush" },
			],
		],
		servicesRendered: [[], [], []],
	},
	{
		guest: "Cerebus",
		visits: [{ number: 2 }, { number: 1 }],
		services: [
			[{ petType: "dog", name: "Bath & Brush" }],
			[
				{ petType: "dog", name: "Nail Buff & Trim" },
				{ petType: "dog", name: "Bath & Brush" },
				{ petType: "dog", name: "Ear Cleaning" },
			],
		],
		servicesRendered: [[], []],
	},
	{
		guest: "KEI-9",
		visits: [{ number: 4 }, { number: 3 }, { number: 2 }, { number: 1 }],
		services: [
			[
				{ petType: "dog", name: "Nail Buff & Trim" },
				{ petType: "dog", name: "Bath & Brush" },
				{ petType: "dog", name: "Ear Cleaning" },
			],
			[
				{ petType: "dog", name: "Full Service" },
				{ petType: "dog", name: "Deluxe" },
			],
			[
				{ petType: "dog", name: "Haircut" },
				{ petType: "dog", name: "Bath & Brush" },
			],
			[{ petType: "dog", name: "Full Service" }],
		],
		servicesRendered: [[{ petType: "dog", name: "Ear Cleaning" }], [], [], []],
	},
	{
		guest: "Nemesis",
		visits: [{ number: 4 }, { number: 3 }, { number: 2 }, { number: 1 }],
		services: [
			[
				{ petType: "dog", name: "Haircut" },
				{ petType: "dog", name: "Ear Cleaning" },
			],
			[
				{ petType: "dog", name: "Full Service" },
				{ petType: "dog", name: "Deluxe" },
			],
			[
				{ petType: "dog", name: "Haircut" },
				{ petType: "dog", name: "Bath & Brush" },
			],
			[{ petType: "dog", name: "Full Service" }],
		],
		servicesRendered: [[{ petType: "dog", name: "Haircut" }], [], [], []],
	},
	{
		guest: "Alice",
		visits: [{ number: 4 }, { number: 3 }, { number: 2 }, { number: 1 }],
		services: [
			[{ petType: "dog", name: "Bath & Brush" }],
			[
				{ petType: "dog", name: "Full Service" },
				{ petType: "dog", name: "Deluxe" },
			],
			[
				{ petType: "dog", name: "Full Service" },
				{ petType: "dog", name: "Luxury" },
			],
			[{ petType: "dog", name: "Haircut" }],
		],
		servicesRendered: [[], [], [], []],
	},
	{
		guest: "Sniffer",
		visits: [{ number: 2 }, { number: 1 }],
		services: [
			[{ petType: "dog", name: "Haircut" }],
			[
				{ petType: "dog", name: "Bath & Brush" },
				{ petType: "dog", name: "Ear Cleaning" },
			],
		],
		servicesRendered: [[], []],
	},
];

export { addVisitServicesData };
