import { Router } from "express";
import { getAllStores, getStoreId, createStore, updateStore, deleteStore } from "../controllers/storeController.js";
import { authenticate, optionalAuthenticated } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { createStoreValidator, updateStoreValidator } from "../validators/storeValidator.js";

const router = Router();

router.get("/", optionalAuthenticated, getAllStores);
router.get("/:id", optionalAuthenticated, getStoreId);
router.post("/", authenticate, authorize("SYSTEM_ADMIN"), createStoreValidator, createStore);
router.put("/:id", authenticate, authorize("SYSTEM_ADMIN"), updateStoreValidator, updateStore);
router.delete("/:id", authenticate, authorize("SYSTEM_ADMIN"), deleteStore);

export default router;