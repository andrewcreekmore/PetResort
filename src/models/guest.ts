import mongoose = require("mongoose");

// create schema: guests (pets)
const guestSchema = new mongoose.Schema({
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
	age: Number,
	breed: String,
	weight: Number,
	current: {
		type: Boolean,
		default: false,
	},
});

// create model from schema
const Guest = mongoose.model("Guest", guestSchema);

// setup indices
guestSchema.index({ name: 1, owner: 1 }, { unique: true });
Guest.createIndexes();

export = Guest;
