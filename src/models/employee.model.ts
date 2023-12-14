import mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

/*
===========================================================================
employee.model.ts
- schema, model, interface for Employees
===========================================================================
*/

// create schema: employee
const EmployeeSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	adminAccess: {
		type: Boolean,
		default: false,
	},
	phoneNumber: {
		type: Number,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
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
	resetPasswordToken: {
		type: String,
	},
	resetPasswordExpires: {
		type: Date,
	},
	image: {
		url: {
			type: String,
			default:
				"https://res.cloudinary.com/doawnm5zz/image/upload/v1702403502/PetResort/user_okivqa.png",
		},
		filename: {
			type: String,
			default: "user.png",
		},
	},
});

// adds req. username, hash, and salt fields to schema, additional methods, etc
EmployeeSchema.plugin(passportLocalMongoose);

interface IEmployee {
	firstName: string;
	lastName: string;
	role: string;
	adminAccess?: boolean;
	phoneNumber: number;
	email: string;
	address?: object;
	username: string;
	hash: string;
	salt: string;
	resetPasswordToken?: string;
	resetPasswordExpires?: Date;
	image?: object;
}

interface IEmployeeDoc extends IEmployee, mongoose.PassportLocalDocument, Document {}

// full name virtual method
EmployeeSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// formatted (with hyphens) phone number virtual method
EmployeeSchema.virtual("formattedPhone").get(function () {
	const phoneStr: String = String(this.phoneNumber);
	return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6, 10)}`;
});

// formatted street address (for card display) virtual method
EmployeeSchema.virtual("formattedAddress").get(function () {
	if (this.address && this.address.streetAddress) {
		var aptStr = "";
		if (this.address.apartment) {
			return `${this.address.streetAddress} Apt. ${this.address.apartment}`;
		} else {
			return `${this.address.streetAddress}`;
		}
	} else {
		return "";
	}
});

const Employee = mongoose.model<IEmployeeDoc>("Employee", EmployeeSchema);

// setup indices
EmployeeSchema.index({ firstName: 1, lastName: 1 }, { unique: true });
Employee.createIndexes();

export = Employee;