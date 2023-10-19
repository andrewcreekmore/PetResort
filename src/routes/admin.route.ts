
import express = require("express");
import { Request, Response, NextFunction } from "express";

/*
===========================================================================
admin.route.ts
- 
===========================================================================
*/

const router = express.Router();
const employeeDir = "employee";

// administration
router.get("/", (req: Request, res: Response) => {
    const title = "Pet Resort · Admin";
    var user = "employee";
    var adminAccess: boolean = true;
    var data = { title, user, adminAccess };
    res.render(employeeDir + "/admin", { ...data });
});

module.exports = router;