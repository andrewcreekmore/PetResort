import { Request, Response, NextFunction } from "express";
import bodyParser = require("body-parser");
import methodOverride = require("method-override");
import session = require("express-session");
import flash = require("connect-flash");
import passport = require("passport");
import mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
import MongoStore = require("connect-mongo");

/*
===========================================================================
middleware.ts
- 
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
	res.locals.activeGuestsTab = req.session.activeGuestsTab;
	next();
};

const storeFlashMessages = (req: Request, res: Response, next: NextFunction) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
};

// setting up mongoStore for session
// + session options config
//=====================
var dbUrl: string = "mongodb://127.0.0.1:27017/petResort";
if (process.env.NODE_ENV === "production" && process.env.DB_URL) {
	dbUrl = process.env.DB_URL;
}
const sessionStore = MongoStore.create({
	mongoUrl: dbUrl,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret: "tempSecret",
	},
});

sessionStore.on("error", function (err) {
	console.log("Session store error: ", err);
});

const sessionConfig = {
	store: sessionStore,
	name: "session",
	secret: "tempSecret",
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
];

const styleSrcUrls = [
	"https://stackpath.bootstrapcdn.com/",
];

const contentSecurityPolicyConfig = {
	directives: {
		defaultSrc: [],
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

// all middlewares to be run on every request
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
    mongoSanitize(),
    helmet(),
    helmet.contentSecurityPolicy(contentSecurityPolicyConfig),
];

export default allMiddlewares;