import mongoose, { Schema, Document, Types } from "mongoose";
import { Client, IClientDoc } from "./client.model";
import { IVisitDoc } from "./visit.model";
import { lightFormat, isFuture, isPast } from "date-fns";

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
			default: "../img/pawPrint.png",
		},
		filename: {
			type: String,
			default: 'pawPrint.png',
		}
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
	current?: Boolean;
	image?: object;
	notes?: string;
	visits?: Types.DocumentArray<IVisitDoc>;
}

interface IGuestDoc extends IGuest, Document {}

GuestSchema.virtual("current").get(function () {
	if (this.visits.length > 0) {
		const sortedVisitsArr = [...this.visits].sort(
			(b, a) => a.endDate - b.endDate
		);
		
		const mostRecentEndDate =
			sortedVisitsArr[sortedVisitsArr.length - 1].endDate;
		//console.log(sortedVisitsArr[sortedVisitsArr.length - 1].endDate)
		const today = new Date('2023-10-5')
		const result = isFuture(today);
		//console.log(result)

		if (result === true) {
			return `Active: Checks out ${mostRecentEndDate}`
		} else {
			return `Last checkout: ${lightFormat(mostRecentEndDate, 'yyyy-MM-dd')}`;
		}

	} else {
		return 'TBD';
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
