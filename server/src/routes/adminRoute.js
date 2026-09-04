import { Router } from "express";
import { getDashboardStats, getAllUsers, createUser } from "../controllers/adminController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { createAdminUserValidator } from "../validators/adminValidator.js";

const router = Router();

router.use(authenticate, authorize("SYSTEM_ADMIN"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.post("/users", createAdminUserValidator, createUser);

export default router;
