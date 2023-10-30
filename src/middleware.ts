import { Request, Response, NextFunction } from "express";

/*
===========================================================================
middleware.ts
- 
===========================================================================
*/

module.exports.isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to access this page.');
        return res.redirect('/login');
	}
    next();
}