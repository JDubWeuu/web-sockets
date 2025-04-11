"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// const http = require("http");
// const server = http.createServer();
app.get("/", (req, res, next) => {
    res.set("Content-Type", "text/plain");
    res.status(200).send("The api is good to go!");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("App is up and running!");
});
