import { Router } from "express";
import { getOwnerDashboard } from "../controllers/ownerController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(authenticate, authorize("STORE_OWNER"));

router.get("/dashboard", getOwnerDashboard);

export default router;
