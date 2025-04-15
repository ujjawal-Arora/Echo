import z from 'zod';

export const signUpvalidations = z.object({
    username: z.string().min(2).max(30),
    password: z.string().min(8).max(30),
    email: z.string().email(),
    // bio: z.string().min(10).max(200),
    // gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
    // profilePic: z.string()
});

export const signInvalidations = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(30),
})
export const userDetailsValidation = z.object({
    bio: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']),
    interests: z.array(z.string()).default([]),
    profilePic: z.string().default(""),
    location: z.string().optional(),
    lookingFor: z.string().optional(),
    RelationShipType: z.enum(["LongTerm", "ShortTerm", "Living"]).nullable()
});
