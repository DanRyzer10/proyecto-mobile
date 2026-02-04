export interface IDeviceService {
    registerDevice( userid: string,fcmToken: string): Promise<void>;
}