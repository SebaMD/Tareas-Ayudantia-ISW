import { Router } from "express";
import { getUserById, updateUserById, deleteUserById } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/profile/private", getUserById);
router.patch("/profile/private", updateUserById);
router.delete("/profile/private/:id", deleteUserById);

export default router;