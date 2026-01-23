import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import { getMe } from "../controllers/user.controller.js";
import { authLimiter } from "../middlewares/rateLimit.js";

const router = Router();

router.use(authMiddleware);
router.get("/me", authLimiter, getMe);

export default router;
