"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const customer_dispatcher_1 = __importDefault(require("./customer-dispatcher"));
const item_dispatcher_1 = __importDefault(require("./item-dispatcher"));
const order_dispatcher_1 = __importDefault(require("./order-dispatcher"));
const router = express.Router();
exports.default = router;
router.use(express.json());
router.use(cors());
router.use("/api/v1/customers", customer_dispatcher_1.default);
router.use("/api/v1/items", item_dispatcher_1.default);
router.use("/api/v1/orders", order_dispatcher_1.default);
