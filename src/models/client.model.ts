import mongoose, { Schema, Document, Types } from "mongoose";
import { Guest, IGuestDoc, GuestSchema } from "./guest.model";
import { Visit, IVisitDoc, VisitSchema } from "./visit.model";
import { IServiceDoc, ServiceSchema } from "./service.model";

/*
===========================================================================
client.model.ts
- schema, model, interface for Client
===========================================================================
*/

// create schema: client (pet owners)
const ClientSchema: Schema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: Number,
		required: true,
	},
	email: {
		type: String,
	},
	address: {
		streetAddress: {
			type: String,
		},
		apartment: {
			type: String,
		},
		city: {
			type: String,
		},
		state: {
			type: String,
		},
		zip: {
			type: Number,
		},
	},
	pets: [
		{
			type: Schema.Types.ObjectId,
			ref: "Guest",
		},
	],
	accountCredit: {
		type: Number,
		default: 0,
		min: 0,
	},
	accountBalance: {
		type: Number,
		default: 0,
		min: 0,
	},
});

interface IClient {
	firstName: string;
	lastName: string;
	phoneNumber: number;
	email?: string;
	address?: object;
	pets: Types.DocumentArray<IGuestDoc>
}

interface IClientDoc extends IClient, Document {}

// full name virtual method
ClientSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// formatted (with hyphens) phone number virtual method
ClientSchema.virtual('formattedPhone').get(function () {
	const phoneStr: String = String(this.phoneNumber);
	return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6,10)}`;
})


// formatted street address (for card display) virtual method
ClientSchema.virtual('formattedAddress').get(function () {
	if (this.address.streetAddress) {
		var aptStr = ''
		if (this.address.apartment) {
			return `${this.address.streetAddress} Apt. ${this.address.apartment}`;
		} else {
			return `${this.address.streetAddress}`;
		}
		
	} else {
		return "";
	}
})

// setup query middleware: delete owned pets (guests) when deleting client
ClientSchema.post('findOneAndDelete', async function (deletedClient) {
	if (deletedClient.pets.length) {
		const responseData = await Guest.deleteMany({ _id: { $in: deletedClient.pets }})
	}
})

const Client = mongoose.model<IClientDoc>("Client", ClientSchema);

// setup indices
ClientSchema.index({ firstName: 1, lastName: 1 }, { unique: true });
Client.createIndexes();

export { Client, IClientDoc}

// register client, guest schemas (for use in app.ts during initDatabase())
export const registerSchemas = () => {
	//const Address = mongoose.model<IAddressDoc>("Address", AddressSchema);
	const Client = mongoose.model<IClientDoc>("Client", ClientSchema);
	const Guest = mongoose.model<IGuestDoc>("Guest", GuestSchema);
	const Visit = mongoose.model<IVisitDoc>("Visit", VisitSchema);
	const Service = mongoose.model<IServiceDoc>("Service", ServiceSchema);
};