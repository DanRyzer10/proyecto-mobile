import z from "zod";

export const createUserSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3),
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    password: z.string()
        .min(6)
        .refine((val) => /[A-Z]/.test(val), { message: "Password must contain at least one uppercase letter" })
});

export const createUsersSchema = z.array(createUserSchema).nonempty(); // .nonempty() opcional

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type CreateUsersRequest = z.infer<typeof createUsersSchema>;