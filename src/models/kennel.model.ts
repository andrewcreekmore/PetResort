import mongoose, { Schema, Document, Types } from "mongoose";
import { IGuestDoc } from "./guest.model";

/*
===========================================================================
kennel.model.ts
- schema, model, interface for Kennel
===========================================================================
*/

// create schema: kennel
const KennelSchema = new Schema({
	kennel_id: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},
	size: {
		type: String,
		required: true,
	},
	occupant: {
		type: Schema.Types.ObjectId,
		ref: "Guest",
	    default: null,
	},
});

interface IKennel {
	kennel_id: string;
	size: string;
	occupant?: IGuestDoc["_id"];
}

interface IKennelDoc extends IKennel, Document {}

KennelSchema.virtual("formatted_id").get(function () {
    return `${this.kennel_id}-${this.size.toUpperCase()}`
});

const Kennel = mongoose.model<IKennelDoc>("Kennel", KennelSchema);

// setup indices
KennelSchema.index({ kennel_id: 1 }, { unique: true });
Kennel.createIndexes();

export { Kennel, IKennelDoc, KennelSchema };
