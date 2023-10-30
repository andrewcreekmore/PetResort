import mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const EmployeeSchema = new mongoose.Schema({
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
		unique: true,
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
});

// adds req. username, hash, and salt fields to schema, additional methods, etc
EmployeeSchema.plugin(passportLocalMongoose);

interface IEmployee {
	firstName: string;
	lastName: string;
	phoneNumber: number;
	email?: string;
	address?: object;
	username: string;
	hash: string;
	salt: string;
}

interface IEmployeeDoc extends IEmployee, mongoose.PassportLocalDocument {}

//const Employee = mongoose.model<IEmployeeDoc>("Employee", EmployeeSchema);

// setup indices
// EmployeeSchema.index({ firstName: 1, lastName: 1 }, { unique: true });
// Employee.createIndexes();


//export { Employee } ;

const Employee = mongoose.model<IEmployeeDoc>("Employee", EmployeeSchema);

export = Employee;

//module.exports =  mongoose.model<IEmployeeDoc>("Employee", EmployeeSchema);