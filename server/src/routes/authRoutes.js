import { Router } from "express";
import { register, login, getMe, changePassword, logout } from "../controllers/authController.js";
import { registerValidator, loginValidator, changePasswordValidator } from "../validators/authValidator.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/me", authenticate, getMe);
router.post("/change-password", authenticate, changePasswordValidator, changePassword);
router.post("/logout", authenticate, logout);

export default router;
