import z from 'zod';

export const signUpvalidations = z.object({
    username: z.string().min(2).max(30),
    password: z.string().min(8).max(30),
    email: z.string().email(),
    bio: z.string().min(10).max(200),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
    profilePic: z.string()
});

export const signInvalidations = z.object({
    username: z.string().min(2).max(30),
    password: z.string().min(8).max(30),
})