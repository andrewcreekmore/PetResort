import mongoose = require("mongoose");

// create schema: clients (pet owners)
const clientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    //guests: [guestSchema],
});

// create model from schema
const Client = mongoose.model("Client", clientSchema);

// setup fullName virtual method for clients
clientSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// setup indices
clientSchema.index({ firstName: 1, lastName: 1 }, { unique: true });
Client.createIndexes();

export = Client;