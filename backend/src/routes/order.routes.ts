import { createOrder, getAllOrders, updateOrderStatus } from "../controllers/order.controller";
import express, { Request, Response } from "express";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);


export default router;
