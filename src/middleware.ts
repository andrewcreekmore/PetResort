import { Request, Response, NextFunction } from "express";


/*
===========================================================================
middleware.ts
- 
===========================================================================
*/

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

