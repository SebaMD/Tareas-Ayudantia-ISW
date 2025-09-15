import { Router } from "express";
import { updateUserById, deleteUserById } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.patch("/profile/private", updateUserById);
router.delete("/profile/private", deleteUserById);

export default router;