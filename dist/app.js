"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
/*
===========================================================================
app.ts
- wrapper class for Express server Application. on construct:
-- creates Express instance on passed port
-- initializes middleware & routes
-- sets static resource folders (public, views) and templating engine (ejs)
===========================================================================
*/
class App {
    constructor(appInitParams) {
        // setup express instance on passed port
        this.app = express();
        this.port = appInitParams.port;
        // setup middleware and routes
        this.initMiddleware();
        this.initRoutes();
        // setup static resources
        this.app.use(express.static('public'));
        this.app.use(express.static('views'));
        // setup templating engine 
        this.app.set('view engine', 'ejs');
    }
    // setup app middlewares
    initMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
    // setup routing 
    initRoutes() {
        const customerDir = 'customer';
        const employeeDir = 'employee';
        // home page
        this.app.get('/', (req, res) => {
            const title = 'Pet Resort · Home';
            const user = 'NONE';
            const data = { title, user };
            res.render('home', Object.assign({}, data));
        });
        // employee portal
        this.app.get('/employee', (req, res) => {
            const title = 'Pet Resort · Employee Portal';
            var user = 'employee';
            var adminAccess = true;
            var data = { title, user, adminAccess };
            res.render(employeeDir + '/employeePortal', Object.assign({}, data));
        });
        // customer portal
        this.app.get('/customer', (req, res) => {
            const title = 'Pet Resort · Customer Site';
            var user = 'customer';
            var data = { title, user };
            res.render(customerDir + '/customerPortal', Object.assign({}, data));
        });
        // EMPLOYEE ROUTES
        //=====================
        // administration
        this.app.get('/admin', (req, res) => {
            const title = 'Pet Resort · Admin';
            var user = 'employee';
            var adminAccess = true;
            var data = { title, user, adminAccess };
            res.render(employeeDir + '/admin', Object.assign({}, data));
        });
        // guest records
        this.app.get('/guest-records', (req, res) => {
            const title = 'Pet Resort · Guest Records';
            var user = 'employee';
            var adminAccess = true;
            var data = { title, user, adminAccess };
            res.render(employeeDir + '/guestRecords', Object.assign({}, data));
        });
        // CUSTOMER ROUTES
        //=====================
        // services
        this.app.get('/services', (req, res) => {
            const title = 'Pet Resort · Services';
            const user = 'customer';
            const data = { title, user };
            res.render(customerDir + '/services', Object.assign({}, data));
        });
    }
    // define listener
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}; ctrl + C to stop.`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map