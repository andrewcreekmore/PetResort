import { Request, Response, NextFunction } from "express";
import AppError = require("../../utils/appError");
import { Kennel } from "../../models/kennel.model";

/*
===========================================================================
kennels.controller.ts
- methods containing route logic for export
- coverage: kennel-model CUD; R is a tab on index @ admin.controller
===========================================================================
*/

// kennel records route constants
const kennelsDir = "employee/records/kennels";
const title = "PetResort · Kennel Records";

// registration of new employees - form entry
module.exports.renderNewForm = 
    async (req: Request, res: Response, next: NextFunction) => {
        const newKennelID = await Kennel.count({}) + 1;
		var breadcrumbs = req.session.breadcrumbs;
        var data = { title, newKennelID, breadcrumbs };
        req.session.activeAdminTab = "kennels";
        res.render(kennelsDir + "/new", { ...data });
    };

// registration of new employees - add on server
module.exports.createKennel =
    async (req: Request, res: Response, next: NextFunction) => {
        req.session.activeAdminTab = "kennels";
        const newKennel = new Kennel(req.body.kennel);

        if (newKennel) {
            await newKennel.save();
            req.flash("success", "Successfully registered new Kennel.");
            res.redirect("/admin");
        } else {
            req.flash("error", "Unable to register kennel.");
            res.redirect(kennelsDir + "/new");
        }
    };

// kennel records: update single record - form entry
module.exports.renderEditForm =
    async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const kennel = await Kennel.findById(id);
		if (!kennel) {
			req.flash("error", `Couldn't find that kennel.`);
			return res.redirect("/admin");
		} else {
            var recordName = kennel.kennel_id + '-' + kennel.size.toUpperCase();
			var breadcrumbs: Array<any> = req.session.breadcrumbs;
			// kennels have no details page to link to; instead will link to self (edit) 
			breadcrumbs[1].breadcrumbUrl = null;
			var data = { title, kennel, recordName, breadcrumbs };
			req.session.activeAdminTab = 'kennels';
			res.render(kennelsDir + "/edit", { ...data });
		}
	};

// kennel records: update single record - edit on server
module.exports.updateKennel =
    async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const kennel = await Kennel.findByIdAndUpdate(id, req.body.kennel, {
			runValidators: true,
			new: true,
		});
		if (kennel) {
			req.flash("success", "Successfully updated Kennel.");
			req.session.activeAdminTab = 'kennels'
			res.redirect(`/admin`);
		}
	};

// kennel records: delete single record
module.exports.deleteKennel =
    async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const deletedKennel = await Kennel.findByIdAndDelete(id);
		if (!deletedKennel) {
			throw new AppError(404);
		} else {
			req.flash("success", "Successfully deleted Kennel.");
			req.session.activeAdminTab = "kennels"
			res.redirect(`/admin`);
		}
	};