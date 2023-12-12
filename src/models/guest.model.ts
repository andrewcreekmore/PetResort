import mongoose, { Schema, Document, Types } from "mongoose";
import { Client, IClientDoc } from "./client.model";
import { IVisitDoc } from "./visit.model";
import { isFuture } from "date-fns";

/*
===========================================================================
guest.model.ts
- schema, model, interface for Guest
===========================================================================
*/

// create schema: guests (pets)
const GuestSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},
	type: {
		type: String,
		required: true,
		lowercase: true,
		enum: ["cat", "dog"],
	},
	breed: {
		type: String,
		required: true,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "Client",
		required: true,
	},
	age: {
		type: Number,
		default: 0,
	},
	weight: {
		type: Number,
		default: 0,
	},
	image: {
		url: {
			type: String,
			default:
				"https://res.cloudinary.com/doawnm5zz/image/upload/v1702403491/PetResort/pawPrint_tj5awj.png",
		},
		filename: {
			type: String,
			default: "pawPrint.png",
		},
	},
	notes: {
		type: String,
	},
	visits: [
		{
			type: Schema.Types.ObjectId,
			ref: "Visit",
		},
	],
});

interface IGuest {
	name: string;
	type: string;
	breed: string;
	owner: IClientDoc["_id"];
	age?: number;
	weight?: number;
	mostRecentVisit: Date;
	current: boolean;
	image?: object;
	notes?: string;
	visits?: Types.DocumentArray<IVisitDoc>;
}

interface IGuestDoc extends IGuest, Document {}

GuestSchema.virtual('mostRecentVisit').get(function () {
	if (this.visits.length > 0) {
		const sortedVisitsArr = [...this.visits].sort(
			(b, a) => a.endDate - b.endDate
		);
		
		const mostRecentEndDate =
			sortedVisitsArr[sortedVisitsArr.length - 1].endDate;
		return mostRecentEndDate;
	} else {
		// TEMP/DEV - UNTIL ALL SEEDS DATE UPDATED
		const tempStaticDate = new Date('1996-01-01')
		return tempStaticDate;
	}
})

GuestSchema.virtual("current").get(function () {
	if (this.visits.length > 0) {
		const sortedVisitsArr = [...this.visits].sort(
			(a, b) => a.endDate - b.endDate
		);
		
		const mostRecentVisit = sortedVisitsArr[sortedVisitsArr.length - 1];
		return mostRecentVisit.checkedIn && !mostRecentVisit.checkedOut;

	} else {
		return false;
	}
});

GuestSchema.virtual("fullName").get(function () {
	if (this.owner) {
		return `${this.name} ${this.owner.lastName}`
	} else {
		return ''
	}
})

const Guest = mongoose.model<IGuestDoc>("Guest", GuestSchema);

// setup indices
GuestSchema.index({ name: 1, owner: 1 }, { unique: true });
Guest.createIndexes();

export { Guest, IGuestDoc, GuestSchema };
