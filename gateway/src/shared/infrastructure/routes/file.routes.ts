import { Router } from "express";
import { AppContext } from "../app-context";
import { authMiddleware } from "@/auth/infrastructure/middlewares/auth-middleware";

const router = Router();
const fileController = AppContext.getFileControllerInstance();


router.post('/files/upload', authMiddleware, (req, res) => {
    fileController.uploadFile(req, res);
});

export default router;