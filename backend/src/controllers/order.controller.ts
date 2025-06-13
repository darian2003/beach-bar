import { Request, Response } from "express";
import { CreateOrderRequest } from "../types/order";
import pool from "../config/db";
import { v4 as uuidv4 } from "uuid";


export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { umbrellaId, items } = req.body as CreateOrderRequest;

  if (!umbrellaId || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Invalid order format" });
    return;
  }

  const client = await pool.connect();
  const orderId = uuidv4();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO orders (id, umbrella_id, status) VALUES ($1, $2, 'new')`,
      [orderId, umbrellaId]
    );

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3)`,
        [orderId, item.id, item.quantity]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order created",
      orderId,
      status: "new"
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {

  const status = req.query.status as string;
  const validStatuses = ["new", "preparing", "delivered"];
  const useFilter = status && (validStatuses.includes(status));

  try {
    const query = `
      SELECT
        o.id,
        o.umbrella_id AS umbrellaId,
        o.status,
        o.timestamp,
        json_agg(
          json_build_object(
            'itemId', oi.item_id, 
            'quantity', oi.quantity
          )
        ) AS items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        ${useFilter ? `WHERE o.status = $1` : ``}
        GROUP BY o.id
        ORDER BY o.timestamp DESC
      `;

      const result = useFilter
        ? await pool.query(query, [status]) 
        : await pool.query(query);

      res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const orderId = req.params.id;
  const { status } = req.body as { status: string };

  if (!orderId || !status) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const validStatuses = ["new", "preparing", "delivered"];

  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  try {
    const result = await pool.query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", [status, orderId]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
  
    res.json({ message: "Status updated", order: result.rows[0] });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrdersByUmbrellaId = async (req: Request, res: Response): Promise<void> => {
  const umbrellaId = req.query;

  if (!umbrellaId || isNaN(Number(umbrellaId))) {
    res.status(400).json({ error: "Invalid or missing umbrellaId" });
    return;
  }

  try {
    const query = `
      SELECT
        o.id,
        o.umbrella_id AS umbrellaId,
        o.status,
        o.timestamp,
        json_agg(
          json_build_object(
            'itemId', oi.item_id, 
            'quantity', oi.quantity
          )
        ) AS items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.umbrella_id = $1
        GROUP BY o.id
        ORDER BY o.timestamp DESC
      `;

      const result = await pool.query(query, [umbrellaId]);

      res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  
};