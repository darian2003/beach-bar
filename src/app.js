require("dotenv").config();
const express = require("express");
const cors = require("cors");

const orderRoutes = require("./routes/order.routes");
const menuRoutes = require("./routes/menu.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);

app.get("/", (req, res) => res.send("🌴 Beach Bar API Running"));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
