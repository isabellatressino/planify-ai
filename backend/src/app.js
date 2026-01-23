import express from "express";
import cors from "cors";

import planRoutes from "./routes/plan.routes.js";
import userRoutes from "./routes/user.routes.js";
import { buildCorsOptions } from "./config/cors.js";

const app = express();
const corsOptions = buildCorsOptions();

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/plans", planRoutes);
app.use("/", userRoutes);

export default app;
