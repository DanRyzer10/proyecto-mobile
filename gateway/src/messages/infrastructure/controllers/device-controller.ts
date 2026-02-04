import { Request, Response } from "express";
import { registerDevicePayloadSchema } from "../schemas/register-device.schema";
import { IDeviceService } from "@/messages/domain/device-service";


export class DeviceController {
    constructor(private deviceService : IDeviceService) {}
    async registerDevice(req: Request,res:Response):Promise<void> {
        try {
            const user = (req as any).user;
            const validation = registerDevicePayloadSchema.safeParse(req.body);
            if ( !validation.success ) {
                res.status(400).json({ error: "Invalid request payload" });
                return;
            }
            const userId = user.userid;
            const wsToken  = user.token;
            const fcmToken = validation.data.data.fcmToken;
            await this.deviceService.registerDevice(userId,fcmToken);
            res.status(200).json({ message: "Device registered successfully" });
        }catch (error) {
            res.status(500).json({ error: "Failed to register device" });
        }
    }
}