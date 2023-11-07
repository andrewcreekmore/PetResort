import App from './app'
import bodyParser = require('body-parser')
const cloudinary = require("cloudinary").v2;

/*
===========================================================================
server.ts
- main entry-point
-- creates instance of App as server, passing port from .env
-- calls App's listen function, starting server
===========================================================================
*/

// setup environment (dev)
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

// setup cloud storage for uploaded images
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

// instantiate server app
const envPort = process.env.PORT;
const app = new App({
    port: Number(envPort)
})

// start server
app.listen()
