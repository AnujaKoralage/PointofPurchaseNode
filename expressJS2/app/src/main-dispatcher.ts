import express = require("express");
import cors = require("cors");
import customer from "./customer-dispatcher"
import item from "./item-dispatcher"
import order from "./order-dispatcher"

const router = express.Router();

export default router;

router.use(express.json());
router.use(cors());

router.use("/api/v1/customers",customer);
router.use("/api/v1/items",item);
router.use("/api/v1/orders", order);