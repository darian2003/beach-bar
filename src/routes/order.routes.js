const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.controller");

router.post("/", controller.createOrder);
router.get("/", controller.getAllOrders);
router.put("/:id/status", controller.updateOrderStatus);

module.exports = router;
