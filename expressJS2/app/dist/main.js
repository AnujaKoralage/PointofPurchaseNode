"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const main_dispatcher_1 = __importDefault(require("./main-dispatcher"));
const app = express();
app.use(main_dispatcher_1.default);
app.listen(6060, () => {
});
