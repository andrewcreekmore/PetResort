"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
/*
===========================================================================
server.ts
- main entry-point
-- creates instance of App as server, passing port from .env
-- calls App's listen function, starting server
===========================================================================
*/
// setup environment
dotenv_1.default.config();
const envPort = process.env.PORT;
// instantiate server app
const app = new app_1.default({
    port: Number(envPort)
});
// start server
app.listen();
//# sourceMappingURL=server.js.map