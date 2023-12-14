import App from './app'
const cloudinary = require("cloudinary").v2;
import allRoutes from './routes/all.route'
import allMiddlewares from './middleware';

/*
===========================================================================
server.ts
- main entry-point
-- creates instance of App, passing port, routes, & middlewares
-- calls App's listen function, starting server
===========================================================================
*/

// setup environment (if dev)
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
const envPort = process.env.PORT || 8080;
const app = new App({
	port: Number(envPort),
	middlewares: allMiddlewares,
	routes: allRoutes,
});

// start server
app.listen()