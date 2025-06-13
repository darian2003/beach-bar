import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";

// Import routes (update file extensions if needed)
import orderRoutes from "./routes/order.routes";
import menuRoutes from "./routes/menu.routes";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("🌴 Beach Bar API Running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
