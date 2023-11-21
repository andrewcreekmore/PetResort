import mongoose, { Schema, Document, Types } from "mongoose";
import { Visit, IVisitDoc } from "./visit.model";

/*
===========================================================================
service.model.ts
- schema, model, interface for Service
===========================================================================
*/

// create schema: service
const ServiceSchema = new Schema({
	petType: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
	},
	serviceType: {
		type: String,
		required: true,
	},
	displayOrder: {
		type: Number,
		default: 1,
	},
});

interface IService {
	petType: string;
	name: string;
	price: number;
	description: string;
	serviceType: string;
	displayOrder: number;
}

interface IServiceDoc extends IService, Document {}

// full name virtual method
ServiceSchema.virtual("formattedServiceType").get(function () {
	var serviceType: string = this.serviceType;
	return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
});

const Service = mongoose.model<IServiceDoc>("Service", ServiceSchema);

// setup indices
ServiceSchema.index({ petType: 1, name: 1 }, { unique: true });
Service.createIndexes();

export { Service, IServiceDoc, ServiceSchema };
