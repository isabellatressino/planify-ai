import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import { planLimiter } from "../middlewares/rateLimit.js";
import {
  createPlan,
  deletePlan,
  getPlanById,
  listPlans,
  updateTask,
} from "../controllers/plan.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", planLimiter, createPlan);
router.get("/", listPlans);
router.get("/:id", getPlanById);
router.patch("/:id/task", updateTask);
router.delete("/:id", deletePlan);

export default router;
