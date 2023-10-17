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

// address schema/interface/model (for clients)
// const AddressSchema = new Schema({
// 	zip: String,
// 	state: String,
// 	city: String,
// 	street: String,
// 	houseNumber: String,
// 	apartment: String
// })

// interface IAddress {
// 	zip: string;
// 	state: String,
// 	city: string;
// 	street: string;
// 	houseNumber: string;
// 	apartment?: string;
// }



// interface IAddressDoc extends IAddress, Document {}
// const Address = mongoose.model<IAddressDoc>("Address", AddressSchema);

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
	// address: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: "Address",
	// },
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
	//address: IAddressDoc['_id']
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


// // formatted (with hyphens) phone number virtual method
// ClientSchema.virtual('formattedAddress').get(function () {
// 	if (this.address) {
// 		var aptStr = ''
// 		if (this.address.apartment) {
// 			return `${this.address.houseNumber} ${this.address.street} Apt. ${this.address.apartment}`;
// 		} else {
// 			return `${this.address.houseNumber} ${this.address.street}`;
// 		}
		
// 	} else {
// 		return "";
// 	}
// })

// formatted (with hyphens) phone number virtual method
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


const Client = mongoose.model<IClientDoc>("Client", ClientSchema);

// setup indices
//AddressSchema.index({ zip: 1, street: 1, houseNumber: 1}, { unique: true });
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