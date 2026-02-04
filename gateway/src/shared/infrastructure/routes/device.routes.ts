import { Router } from "express";
import { AppContext } from "../app-context";
import { authMiddleware } from "@/auth/infrastructure/middlewares/auth-middleware";


const router = Router();
const deviceController = AppContext.getDeviceControllerInstance()
router.post('/devices/register', authMiddleware, (req, res) => {
    deviceController.registerDevice(req, res);
});

export default router;