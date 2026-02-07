import { CosmosProvider } from "@/shared/infrastructure/providers/cosmos.provider";
import { IDeviceService } from "../domain/device-service";
import { IDevice } from "../domain/device";

export class DeviceService implements IDeviceService {
    constructor(private cosmosProvider: CosmosProvider) {}
    async registerDevice(userid: string, fcmToken: string): Promise<any> {
        const exists = await this.cosmosProvider.readItem<IDevice>(userid, userid);
        if (exists) {
            return;
        }
        const item:IDevice = {
            userid,
            fcmToken,
            registeredAt: new Date().toISOString()
        }
        const response = await this.cosmosProvider.upsertItem(item);
        if (response.statusCode !== 200 && response.statusCode !== 201) {
            throw new Error("Failed to register device");
        }
        return response;
    }
}