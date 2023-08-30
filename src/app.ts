import {Application, Request, Response} from 'express';
import express = require('express');
import bodyParser = require('body-parser');

/*
===========================================================================
app.ts
- wrapper class for Express server Application. on construct:
-- creates Express instance on passed port
-- initializes middleware & routes
-- sets static resource folders (public, views) and templating engine (ejs)
===========================================================================
*/


class App 
{
    public app: Application
    public port: number

    constructor(appInitParams: { port: number; }) 
    {
        // setup express instance on passed port
        this.app = express()
        this.port = appInitParams.port

        // setup middleware and routes
        this.initMiddleware()
        this.initRoutes()
        
        // setup static resources
        this.app.use(express.static('public'))
        this.app.use(express.static('views'))

        // setup templating engine 
        this.app.set('view engine', 'ejs')
    }

    // setup app middlewares
    private initMiddleware() 
    {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    // setup routing 
    private initRoutes()
    {
        const customerDir = 'customer';
        const employeeDir = 'employee';

        // home page
        this.app.get('/', (req: Request, res: Response) => {
          const title = 'Pet Resort · Home';
          const user = 'NONE'
          const data = {title, user};
          res.render('home', {...data});
        });

        // employee portal
        this.app.get('/employee', (req: Request, res: Response) => {
          const title = 'Pet Resort · Employee Portal';
          var user = 'employee';
          var adminAccess: boolean = true;
          var data = {title, user, adminAccess};
          res.render(employeeDir + '/employeePortal', { ...data });
        });

        // customer portal
        this.app.get('/customer', (req: Request, res: Response) => {
          const title = 'Pet Resort · Customer Site';
          var user = 'customer';
          var data = {title, user};
          res.render(customerDir + '/customerPortal', { ...data });
        });

        // EMPLOYEE ROUTES
        //=====================

        // administration
        this.app.get('/admin', (req: Request, res: Response) => {
          const title = 'Pet Resort · Admin';
          var user = 'employee';
          var adminAccess: boolean = true;
          var data = {title, user, adminAccess};
          res.render(employeeDir + '/admin', { ...data });
        });

        // guest records
        this.app.get('/guest-records', (req: Request, res: Response) => {
          const title = 'Pet Resort · Guest Records';
          var user = 'employee';
          var adminAccess: boolean = true;
          var data = {title, user, adminAccess};
          res.render(employeeDir + '/guestRecords', { ...data });
        });

        // CUSTOMER ROUTES
        //=====================

        // services
        this.app.get('/services', (req: Request, res: Response) => {
          const title = 'Pet Resort · Services';
          const user = 'customer';
          const data = {title, user};
          res.render(customerDir + '/services', { ...data });
        });
    }

    // define listener
    public listen() 
    {
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}; ctrl + C to stop.`)
        })
    }
}

export default App
