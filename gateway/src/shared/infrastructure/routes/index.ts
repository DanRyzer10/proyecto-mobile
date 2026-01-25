import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import courseRoutes from "./course.routes";
import assignmentRoutes from "./assignment.routes";
import fileRoutes from "./file.routes";

const router = Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(courseRoutes);
router.use(assignmentRoutes);
router.use(fileRoutes)

export default router;
