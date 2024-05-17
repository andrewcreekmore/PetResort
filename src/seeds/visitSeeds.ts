import { Visit } from "../models/visit.model";
import { Guest } from "../models/guest.model";
import { Kennel } from "../models/kennel.model";

/*
===========================================================================
seedVisits.ts
- defines visit initial/starter data + seeding function
===========================================================================
*/

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
					paid: guestVisitsSeed[i].visits[j].paid,
					checkedIn: guestVisitsSeed[i].visits[j].checkedIn,
					checkedInBy: guestVisitsSeed[i].visits[j].checkedInBy,
					checkedOut: guestVisitsSeed[i].visits[j].checkedOut,
					checkedOutBy: guestVisitsSeed[i].visits[j].checkedOutBy,
					servicesRenderedByMap: new Map(),
					servicesRenderedDateMap: new Map(),
				});
				await newVisit.save();
				guest.visits?.push(newVisit);

				// add Guest as property on corresponding Kennel if occupancy is current
				if (newVisit.current && kennel) {
					kennel.occupant = guest;
					await kennel.save();
				}
			}
			await guest.save();
		}
	}
};

// actual starter data: visits
const guestVisitsSeed = [
	{
		guest: "Alvina",
		visits: [
			{
				startDate: "2021-10-24",
				endDate: "2021-10-29",
				assignedKennel: "2",
				paid: true,
				checkedIn: true,
				checkedInBy: "cfrazer",
				checkedOut: true,
				checkedOutBy: "blazko",
			},
			{
				startDate: "2022-11-27",
				endDate: "2022-12-4",
				assignedKennel: "4",
				paid: true,
				checkedIn: true,
				checkedInBy: "ftaggart",
				checkedOut: true,
				checkedOutBy: "acasey",
			},
			// CURRENT
			{
				startDate: "2024-3-4",
				endDate: "2023-3-18",
				assignedKennel: "6",
				paid: true,
				checkedIn: true,
				checkedInBy: "hmason",
				checkedOut: false,
				checkedOutBy: "",
			},
		],
	},
	{
		guest: "Eleanor Rigby",
		visits: [
			{
				startDate: "2018-4-18",
				endDate: "2018-4-23",
				assignedKennel: "1",
				paid: true,
				checkedIn: true,
				checkedInBy: "blazko",
				checkedOut: true,
				checkedOutBy: "scastellanos",
			},
			{
				startDate: "2019-6-2",
				endDate: "2019-6-11",
				assignedKennel: "1",
				paid: true,
				checkedIn: true,
				checkedInBy: "acasey",
				checkedOut: true,
				checkedOutBy: "cfrazer",
			},
			{
				startDate: "2020-11-20",
				endDate: "2020-11-26",
				assignedKennel: "6",
				paid: true,
				checkedIn: true,
				checkedInBy: "hmason",
				checkedOut: true,
				checkedOutBy: "ftaggart",
			},
			// FUTURE
			{
				startDate: "2024-11-20",
				endDate: "2024-11-26",
				assignedKennel: "",
				paid: false,
				checkedIn: false,
				checkedInBy: "",
				checkedOut: false,
				checkedOutBy: "",
			},
		],
	},
	{
		guest: "Blade Wolf",
		visits: [
			{
				startDate: "2020-2-17",
				endDate: "2020-2-22",
				assignedKennel: "20",
				paid: true,
				checkedIn: true,
				checkedInBy: "hmason",
				checkedOut: true,
				checkedOutBy: "acasey",
			},
			{
				startDate: "2022-9-12",
				endDate: "2022-9-17",
				assignedKennel: "21",
				paid: true,
				checkedIn: true,
				checkedInBy: "blazko",
				checkedOut: true,
				checkedOutBy: "scastellanos",
			},
			// CURRENT
			{
				startDate: "2024-3-4",
				endDate: "2024-3-19",
				assignedKennel: "21",
				paid: false,
				checkedIn: true,
				checkedInBy: "acasey",
				checkedOut: false,
				checkedOutBy: "",
			},
		],
	},
	{
		guest: "Cerebus",
		visits: [
			{
				startDate: "2020-3-2",
				endDate: "2020-3-6",
				assignedKennel: "22",
				paid: true,
				checkedIn: true,
				checkedInBy: "acasey",
				checkedOut: true,
				checkedOutBy: "hmason",
			},
			// FUTURE
			{
				startDate: "2024-8-11",
				endDate: "2024-8-23",
				assignedKennel: "22",
				paid: false,
				checkedIn: false,
				checkedInBy: "",
				checkedOut: false,
				checkedOutBy: "",
			},
		],
	},
	{
		guest: "Sif",
		visits: [
			{
				startDate: "2019-7-3",
				endDate: "2019-7-14",
				assignedKennel: "24",
				paid: true,
				checkedIn: true,
				checkedInBy: "ftaggart",
				checkedOut: true,
				checkedOutBy: "acasey",
			},
			{
				startDate: "2019-9-7",
				endDate: "2019-9-11",
				assignedKennel: "21",
				paid: true,
				checkedIn: true,
				checkedInBy: "scastellanos",
				checkedOut: true,
				checkedOutBy: "blazko",
			},
			{
				startDate: "2020-1-9",
				endDate: "2020-1-14",
				assignedKennel: "23",
				paid: true,
				checkedIn: true,
				checkedInBy: "cfrazer",
				checkedOut: true,
				checkedOutBy: "hmason",
			},
			// CURRENT
			{
				startDate: "2024-3-4",
				endDate: "2024-3-21",
				assignedKennel: "23",
				paid: true,
				checkedIn: true,
				checkedInBy: "blazko",
				checkedOut: false,
				checkedOutBy: "",
			},
		],
	},
	{
		guest: "Dogmeat",
		visits: [
			{
				startDate: "2021-2-9",
				endDate: "2021-2-15",
				assignedKennel: "19",
				paid: true,
				checkedIn: true,
				checkedInBy: "blazko",
				checkedOut: true,
				checkedOutBy: "cfrazer",
			},
			{
				startDate: "2022-4-2",
				endDate: "2021-4-8",
				assignedKennel: "13",
				paid: true,
				checkedIn: true,
				checkedInBy: "cfrazer",
				checkedOut: true,
				checkedOutBy: "acasey",
			},
			// CURRENT
			{
				startDate: "2024-3-4",
				endDate: "2024-3-23",
				assignedKennel: "15",
				paid: false,
				checkedIn: true,
				checkedInBy: "scastellanos",
				checkedOut: false,
				checkedOutBy: "",
			},
		],
	},
	{
		guest: "Sweet Shalquoir",
		visits: [
			{
				startDate: "2018-5-13",
				endDate: "2018-5-19",
				assignedKennel: "3",
				paid: true,
				checkedIn: true,
				checkedInBy: "scastellanos",
				checkedOut: true,
				checkedOutBy: "acasey",
			},
			{
				startDate: "2021-9-16",
				endDate: "2021-9-27",
				assignedKennel: "1",
				paid: true,
				checkedIn: true,
				checkedInBy: "cfrazer",
				checkedOut: true,
				checkedOutBy: "hmason",
			},
			// FUTURE
			{
				startDate: "2024-8-11",
				endDate: "2024-8-16",
				assignedKennel: "",
				paid: false,
				checkedIn: false,
				checkedInBy: "",
				checkedOut: false,
				checkedOutBy: "",
			},
		],
	},
	{
		guest: "KEI-9",
		visits: [
			{
				startDate: "2017-7-12",
				endDate: "2017-7-23",
				assignedKennel: "17",
				paid: true,
				checkedIn: true,
				checkedInBy: "blazko",
				checkedOut: true,
				checkedOutBy: "ftaggart",
			},
			{
				startDate: "2019-10-4",
				endDate: "2019-10-15",
				assignedKennel: "15",
				paid: true,
				checkedIn: true,
				checkedInBy: "acasey",
				checkedOut: true,
				checkedOutBy: "scastellanos",
			},
			{
				startDate: "2020-4-9",
				endDate: "2020-4-21",
				assignedKennel: "20",
				paid: true,
				checkedIn: true,
				checkedInBy: "ftaggart",
				checkedOut: true,
				checkedOutBy: "hmason",
			},
			// CURRENT
			{
				startDate: "2024-3-4",
				endDate: "2024-3-24",
				assignedKennel: "20",
				paid: true,
				checkedIn: true,
				checkedInBy: "hmason",
				checkedOut: false,
				checkedOutBy: "",
			},
		],
	},
	{
		guest: "Nemesis",
		visits: [
			{
				startDate: "2018-1-10",
				endDate: "2018-1-22",
				assignedKennel: "23",
				paid: true,
				checkedIn: true,
				checkedInBy: "blazko",
				checkedOut: true,
				checkedOutBy: "acasey",
			},
			{
				startDate: "2019-3-7",
				endDate: "2019-3-16",
				assignedKennel: "20",
				paid: true,
				checkedIn: true,
				checkedInBy: "scastellanos",
				checkedOut: true,
				checkedOutBy: "ftaggart",
			},
			{
				startDate: "2020-9-17",
				endDate: "2020-9-23",
				assignedKennel: "22",
				paid: true,
				checkedIn: true,
				checkedInBy: "hmason",
				checkedOut: true,
				checkedOutBy: "cfrazer",
			},
			// CURRENT
			{
				startDate: "2024-3-4",
				endDate: "2024-3-26",
				assignedKennel: "22",
				paid: false,
				checkedIn: true,
				checkedInBy: "cfrazer",
				checkedOut: false,
				checkedOutBy: "",
			},
		],
	},
	{
		guest: "Alice",
		visits: [
			{
				startDate: "2020-5-3",
				endDate: "2020-5-11",
				assignedKennel: "13",
				paid: true,
				checkedIn: true,
				checkedInBy: "hmason",
				checkedOut: true,
				checkedOutBy: "acasey",
			},
			{
				startDate: "2021-3-1",
				endDate: "2021-3-6",
				assignedKennel: "17",
				paid: true,
				checkedIn: true,
				checkedInBy: "scastellanos",
				checkedOut: true,
				checkedOutBy: "cfrazer",
			},
			{
				startDate: "2023-2-9",
				endDate: "2023-2-14",
				assignedKennel: "13",
				paid: true,
				checkedIn: true,
				checkedInBy: "blazko",
				checkedOut: true,
				checkedOutBy: "ftaggart",
			},
			// FUTURE
			{
				startDate: "2024-11-20",
				endDate: "2024-11-26",
				assignedKennel: "",
				paid: false,
				checkedIn: false,
				checkedInBy: "",
				checkedOut: false,
				checkedOutBy: "",
			},
		],
	},
	{
		guest: "Sniffer",
		visits: [
			{
				startDate: "2019-7-4",
				endDate: "2019-7-9",
				assignedKennel: "14",
				paid: true,
				checkedIn: true,
				checkedInBy: "ftaggart",
				checkedOut: true,
				checkedOutBy: "acasey",
			},
			{
				startDate: "2021-8-11",
				endDate: "2021-8-23",
				assignedKennel: "12",
				paid: true,
				checkedIn: true,
				checkedInBy: "blazko",
				checkedOut: true,
				checkedOutBy: "cfrazer",
			},
		],
	},
];



export  { addVisitsData }