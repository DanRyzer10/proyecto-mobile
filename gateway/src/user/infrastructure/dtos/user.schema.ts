import z, { string } from "zod";

export const createUserSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3),
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    role: z.string().min(1).optional(),
    courseid:z.number().int().positive().optional(),
    password: z.string()
        .min(6)
        .refine((val) => /[A-Z]/.test(val), { message: "Password must contain at least one uppercase letter" })
});

export const createUserPayloadSchema = z.object({
    data: createUserSchema
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type CreateUserPayload = z.infer<typeof createUserPayloadSchema>;