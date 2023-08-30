import App from './app'

import bodyParser = require('body-parser')
import dotenv from 'dotenv';

/*
===========================================================================
server.ts
- main entry-point
-- creates instance of App as server, passing port from .env
-- calls App's listen function, starting server
===========================================================================
*/


// setup environment
dotenv.config();
const envPort = process.env.PORT;

// instantiate server app
const app = new App({
    port: Number(envPort)
})

// start server
app.listen()
