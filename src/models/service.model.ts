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
    petType: [
        {
            type: String,
            required: true,
        }
    ],
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
	}
});

interface IService {
    petType: Types.Array<String>;
	name: string;
	price: number;
    description: string;
	type: string;
}

interface IServiceDoc extends IService, Document {}

const Service = mongoose.model<IServiceDoc>("Service", ServiceSchema);

// setup indices
ServiceSchema.index({ petType: 1, name: 1 }, { unique: true });
Service.createIndexes();

export { Service, IServiceDoc, ServiceSchema };
