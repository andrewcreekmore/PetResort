const indexRoutes = require("./index.route");
const guestRoutes = require("./guests.route");
const clientRoutes = require("./clients.route");
const visitRoutes = require("./visits.route");
const adminRoutes = require("./admin/admin.route");
const employeeRoutes = require("./admin/employees.route");
const serviceRoutes = require("./admin/services.route");
const kennelRoutes = require("./admin/kennels.route");

/*
===========================================================================
all.route.ts
- bundles + exports all routes, for server use
===========================================================================
*/

const allRoutes = [ 
    indexRoutes, 
    guestRoutes, 
    clientRoutes, 
    visitRoutes, 
    adminRoutes, 
    employeeRoutes, 
    serviceRoutes, 
    kennelRoutes
]

export default allRoutes;