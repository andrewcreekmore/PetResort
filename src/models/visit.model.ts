import mongoose, { Schema, Document, Types, Date } from "mongoose";
import { Guest, IGuestDoc, GuestSchema } from "./guest.model";
import { Kennel, IKennelDoc } from "./kennel.model";
import { Service, IServiceDoc } from "./service.model";
import {
	formatDuration,
	intervalToDuration,
	differenceInDays,
	isFuture,
} from "date-fns";


/*
===========================================================================
visit.model.ts
- schema, model, interface for Visits
===========================================================================
*/

// create schema: visit
const VisitSchema = new Schema({
	guest: {
		type: Schema.Types.ObjectId,
		ref: "Guest",
		required: true,
		index: true,
	},
	number: {
		type: Number,
		min: 1,
		required: true,
		index: true,
	},
	assignedKennel: {
		type: Schema.Types.ObjectId,
		ref: "Kennel",
	},
	startDate: {
		type: Date,
		required: true,
	},
	endDate: {
		type: Date,
	},
	services: [
		{
			type: Schema.Types.ObjectId,
			ref: "Service",
		},
	],
	servicesRendered: [
		{
			type: Schema.Types.ObjectId,
			ref: "Service",
		},
	],
	clearServicesRenderedFlag: {
		type: Boolean,
		default: false,
	},
	paid: {
		type: Boolean,
		default: false,
	},
	checkedIn: {
		type: Boolean,
		default: false,
	},
	checkedOut: {
		type: Boolean,
		default: false,
	},
	notes: {
		type: String,
	},
});

interface IVisit {
	guest: IGuestDoc["_id"];
	number: number;
	assignedKennel: IKennelDoc["_id"];
	startDate: Date;
	endDate: Date;
	services: Types.DocumentArray<IServiceDoc>;
	servicesRendered: Types.DocumentArray<IServiceDoc>;
	clearServicesRenderedFlag: boolean;
	paid?: boolean;
	notes?: string;
	current: boolean;
	checkedIn: boolean;
	checkedOut: boolean;
}

interface IVisitDoc extends IVisit, Document {}

// returns whether visit is currently taking place
VisitSchema.virtual("current").get(function () {
	if (this.endDate) {
		return isFuture(this.endDate)
	} else {
		return false;
	}
});

// returns whether all services have been rendered
VisitSchema.virtual("allServicesRendered").get(function () {
	return this.services.length === this.servicesRendered.length;
});

// returns a date in 'yyyy-MM-dd' format
VisitSchema.methods.formatDate = function(dateProperty: string) {
	const newDate = new Date(this[dateProperty]);
	let formattedDate = `${newDate.getFullYear()}-`;
	formattedDate += `${`0${newDate.getMonth() + 1}`.slice(-2)}-`; // for double digit month
	formattedDate += `${`0${newDate.getDate()}`.slice(-2)}`; // for double digit day
	return formattedDate;
}

// returns a date in 'MM-dd-yyyy' format
VisitSchema.methods.formatDateMonthFirst = function(dateProperty: string) {
	const newDate = new Date(this[dateProperty]);
	let formattedDate = `${`0${newDate.getMonth() + 1}`.slice(-2)}-`; // for double digit month
	formattedDate +=  `${`0${newDate.getDate()}`.slice(-2)}-`; // for double digit day
	formattedDate += `${newDate.getFullYear()}`;
	return formattedDate;
}

// start/end dates virtual method
VisitSchema.virtual("dates").get(function () {
	return `${VisitSchema.methods.formatDate(this.startDate)} - ${
		VisitSchema.methods.formatDate(this.endDate)
	}`;
});

// duration of visit virtual method
VisitSchema.virtual("duration").get(function () {
	if (this.endDate) {
		var unclampedDuration = formatDuration(
			intervalToDuration({ start: this.startDate, end: this.endDate }),
			{ format: ["days"] }
		);
		// ensure min duration of 1 day, for billing purposes
		return Math.min(Math.max(Number(unclampedDuration.split(" ")[0]), 1));
	} else {
		return 'TBD';
	}
});

// returns rate per day (based on: pet type, TBD...)
VisitSchema.methods.getRate = function () {
	const baseRate = this.type ? 15 : 10;
	return baseRate;
};

// virtual method for rate
VisitSchema.virtual("rate").get(function () {
	return VisitSchema.methods.getRate();
});

// returns base cost of visit based on duration/rate
VisitSchema.virtual("baseCost").get(function () {
	if (this.endDate) {
		// ensure minimum duration of 1 day, for billing purposes
		const durationDays = Math.min(
			Math.max(differenceInDays(this.endDate, this.startDate), 1)
		);
		return durationDays * VisitSchema.methods.getRate();
	} else {
		return 'TBD';
	}
})

const Visit = mongoose.model<IVisitDoc>("Visit", VisitSchema);

// setup indices
VisitSchema.index({ number: 1, guest: 1 }, { unique: true });
VisitSchema.index({ startDate: 1, guest: 1 }, { unique: true });
VisitSchema.index({ endDate: 1, guest: 1 }, { unique: true });
Visit.createIndexes();

export { Visit, IVisitDoc, VisitSchema };
