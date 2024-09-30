import express, { Request, Response } from 'express';
import { client } from '@repo/db/client';
import { signUpvalidations, signInvalidations } from '../validations/validations';
import { isAsync } from 'zod';

const router = express.Router();

// User signup route
router.post("/signup", async (req: Request, res: any) => {
    const validation = signUpvalidations.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ message: "Failed to sign up", errors: validation.error });
    }

    const { username, password, email, bio, gender, profilePic } = validation.data;

    try {
        const newUser = await client.user.create({
            data: {
                username,
                password,
                email,
                bio,
                gender,
                profilePic,
            },
        });

        return res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).json({ message: "Error creating user" });
    }
});
router.post("/signin", async (req: Request, res: any) => {
    const validations = signInvalidations.safeParse(req.body);
    if (!validations.success) {
        return res.status(400).json({ message: "Failed to sign in", errors: validations.error })
    }
    try {
        const user = await client.user.findUnique({
            where: {
                username: validations.data.username,
                password: validations.data.password
            }
        })
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        return res.json({ message: "Logged in successfully", user })
    } catch (error) {
        return res.status(401).json({ message: "Something went wrong", error });
    }
})

router.post("/addconvp",async(req:any,res:any)=>{
    try{
        await client.message.create({
            data: {
                conversationId:'ea4a7787-de65-490f-adbd-5a7ab1c5a6a9',
                senderId:'f792550a-95a1-4ca3-92d6-7a8ba77369ee',
                body:'HI world and Fuck World'
            },
          });
          return res.status(201).json({"msg":"Success"});
    }
    catch(error){
        return res.status(error).json({ message:error})
    }
})
export default router;
