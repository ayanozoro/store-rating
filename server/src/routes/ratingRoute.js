import { Router } from "express";
import { submitRating, getMyRatings, deleteMyRating } from "../controllers/ratingController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { ratingValidator } from "../validators/ratingValidator.js";

const router = Router();

router.post("/", authenticate, authorize("NORMAL_USER"), ratingValidator, submitRating);
router.get("/my", authenticate, getMyRatings);
router.delete("/:storeId", authenticate, deleteMyRating);

export default router;
