import { Request, Response, NextFunction } from "express";
import AppError = require("../../utils/appError");
import { Service } from "../../models/service.model";

/*
===========================================================================
services.controller.ts
- methods containing route logic for export
- coverage: service-model CUD; R is a tab on index @ admin.controller
===========================================================================
*/

// service route constants
const servicesDir = "employee/records/services";
const title = "PetResort · Service Records";

// add new service - form entry
module.exports.renderNewForm = 
    (req: Request, res: Response) => {
        const petType = JSON.parse(JSON.stringify(req.query.petType));
		var breadcrumbs = req.session.breadcrumbs;
        var data = { title, petType, breadcrumbs };
        req.session.activeAdminTab = petType === 'cat' ? "catServices" : "dogServices";
        res.render(servicesDir + "/new", { ...data });
    };

// service records: create new record - add on server
module.exports.createService = 
    async (req: Request, res: Response, next: NextFunction) => {
            const newService = new Service(req.body.service);
            if (newService) {
                await newService.save();
                req.flash("success", "Successfully added new Service.");
                req.session.activeAdminTab =
                    newService.petType === "cat" ? "catServices" : "dogServices";
                res.redirect(`/admin`);
            } else {
                throw new AppError(400);
            }
        };

// service records: update single record - form entry
module.exports.renderEditForm =
    async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const service = await Service.findById(id);
		if (!service) {
			req.flash("error", `Couldn't find that service.`);
			return res.redirect("/admin");
		} else {
			var recordName = service.name + ' (' + service.petType + ')';
			var breadcrumbs = req.session.breadcrumbs;
			var data = { title, service, recordName, breadcrumbs };
			req.session.activeAdminTab =
				service.petType === "cat" ? "catServices" : "dogServices";
			res.render(servicesDir + "/edit", { ...data });
		}
	};

// service records: update single record - edit on server
module.exports.updateService =
    async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const service = await Service.findByIdAndUpdate(id, req.body.service, {
			runValidators: true,
			new: true,
		});
		if (service) {
			req.flash("success", "Successfully updated Service.");
			req.session.activeAdminTab =
				service.petType === "cat" ? "catServices" : "dogServices";
			res.redirect(`/admin`);
		}
	};

// service records: delete single record
module.exports.deleteService =
    async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const deletedService = await Service.findByIdAndDelete(id);
		if (!deletedService) {
			throw new AppError(404);
		} else {
			req.flash("success", "Successfully deleted Service.");
			req.session.activeAdminTab =
				deletedService.petType === "cat" ? "catServices" : "dogServices";
			res.redirect(`/admin`);
		}
	};
