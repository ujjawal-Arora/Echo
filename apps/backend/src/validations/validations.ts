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
    token: z.string(),
    email: z.string().email(),
    bio: z.string().min(1, "Bio is required"),
    gender: z.enum(['male', 'female', 'other']),
    lookingFor: z.string().min(1, "Looking for is required"),
    interests: z.array(z.string()).default([]),
    location: z.string().min(1, "Location is required"),
    profilePic: z.string().default(""),
    relationshipType: z.enum(['LongTerm', 'ShortTerm', 'Living']).optional()
});
