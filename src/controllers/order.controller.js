const { v4: uuidv4 } = require("uuid");
const orders = require("../data/orders");
const menu = require("../data/menu");

exports.createOrder = (req, res) => {
  const { umbrellaId, items } = req.body;
  if (!umbrellaId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid order format" });
  }

  const order = {
    id: uuidv4(),
    umbrellaId,
    items,
    status: "new",
    timestamp: new Date().toISOString(),
  };

  orders.push(order);
  res.status(201).json({ message: "Order created", order });
};

exports.getAllOrders = (req, res) => {
  res.json(orders);
};

exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find((o) => o.id === id);

  if (!order) return res.status(404).json({ error: "Order not found" });

  if (!["new", "preparing", "delivered"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  order.status = status;
  res.json({ message: "Status updated", order });
};

exports.getMenu = (req, res) => {
  res.json(menu);
};
