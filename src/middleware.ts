import { Request, Response, NextFunction } from "express";
import bodyParser = require("body-parser");
import methodOverride = require("method-override");
import session = require("express-session");
import flash = require("connect-flash");
import passport = require("passport");
import mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
import MongoStore = require("connect-mongo");
const { IEmployeeDoc } = require("./models/employee.model");

/*
===========================================================================
middleware.ts
- defines custom & inits third-party middlewares 
- bundles + exports allMiddlewares array for server use
===========================================================================
*/

// to be run on SOME requests
//=====================

module.exports.isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to access this page.');
        return res.redirect('/login');
	}
    next();
}

module.exports.isAdmin = (req: Request, res: Response, next: NextFunction) => {

	const user: typeof IEmployeeDoc = req.user;
    if (!user.adminAccess) {
        req.session.returnTo = req.originalUrl;
        req.flash(
					"error",
					"You must have administrator privileges to access that page."
				);
        return res.redirect('/admin');
	}
    next();
}

module.exports.storeReturnTo = (req: Request, res: Response, next: NextFunction) => {
	if (req.session.returnTo) {
		res.locals.returnTo = req.session.returnTo;
	}
	next();
};

// to be run on EVERY request
//=====================

const storeActive = (req: Request, res: Response, next: NextFunction) => {
	res.locals.currentUser = req.user;
	res.locals.activeAdminTab = req.session.activeAdminTab;
	next();
};

const storeFlashMessages = (req: Request, res: Response, next: NextFunction) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
};

const getBreadcrumbs = (req: Request, res: Response, next: NextFunction) => {

	const getBreadcrumbName = (url: string) => {

		function hasNumber(myString: string) {
			return /\d/.test(myString);
		}

		if (url === '') {
			return 'Home';
		} else if (url === 'edit') {
			return 'Edit';
		} else if (url === "new" || url === "new?petType=dog" || url=== "new?petType=cat") {
			return "New";
		} else if (hasNumber(url)) {
			return "recordName?"; // flag to be populated client side
		} else {
			const rootName = url.split("-");
			return url.charAt(0).toUpperCase() + rootName[0].slice(1) + "s";
		}
	}

	const getValidatedUrl = (url: string, i: number) => {
		if (
			url === "employee-records" ||
			url === "kennel-records" ||
			url === "service-records"
		) {
			return "/admin";
		} else if (url === 'visit-records') {
			return "makeGuestDetailLink";
		} else if (url === 'add-service') {
			return "addServicesPage";
		} else {
			return `/${urls.slice(0, i + 1).join("/")}`;
		}
	}

	const urls = req.originalUrl.split('/');
	urls.shift();

	req.session.breadcrumbs = urls.map((url, i) => {
		return {
			breadcrumbName: getBreadcrumbName(url),
			breadcrumbUrl: getValidatedUrl(url, i),
		};
	})

	next();
    }

// setting up mongoStore for session
// + session options config
//=====================

// production || dev
var dbUrl: string = process.env.DB_URL || "mongodb://127.0.0.1:27017/petResort";
const sessionSecret = process.env.SESSION_SECRET || 'tempSecret';

const sessionStore = MongoStore.create({
	mongoUrl: dbUrl,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret: sessionSecret,
	},
});

sessionStore.on("error", function (err) {
	console.log("Session store error: ", err);
});


const sessionConfig = {
	store: sessionStore,
	name: "session",
	secret: sessionSecret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production" ? true : false,
		expire: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

// helmet content policy:
// config options
//=====================

const scriptSrcUrls = [
	"https://stackpath.bootstrapcdn.com/",
	"https://cdnjs.cloudflare.com/",
	"https://cdn.jsdelivr.net",
	"https://unpkg.com/imask",
];

const styleSrcUrls = [
	"https://stackpath.bootstrapcdn.com/",
];

const contentSecurityPolicyConfig = {
	directives: {
		defaultSrc: ["'self'"],
		connectSrc: ["'self'"],
		scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
		styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
		workerSrc: ["'self'", "blob:"],
		objectSrc: [],
		imgSrc: [
			"'self'",
			"blob:",
			"data:",
			"https://res.cloudinary.com/doawnm5zz/",
			"https://images.unsplash.com/",
		],
		fontSrc: ["'self'"],
	},
};

// all middlewares that are to be run on every request
const allMiddlewares = [
	bodyParser.json(),
	bodyParser.urlencoded({ extended: true }),
	methodOverride("_method"),
	session(sessionConfig),
	flash(),
	passport.initialize(),
	passport.session(),
	storeActive,
	storeFlashMessages,
	getBreadcrumbs,
    mongoSanitize(),
    helmet(),
    helmet.contentSecurityPolicy(contentSecurityPolicyConfig),
];

export default allMiddlewares;