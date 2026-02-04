import {z} from 'zod'
export const registerDeviceSchema = z.object({
    fcmToken : z.string().min(10).max(512),
})
export const registerDevicePayloadSchema = z.object({
    data: registerDeviceSchema
});
export type RegisterDeviceRequest = z.infer<typeof registerDeviceSchema>;
export type RegisterDevicePayload = z.infer<typeof registerDevicePayloadSchema>;