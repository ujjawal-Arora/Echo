import { Request, Response } from "express";
import jwt ,{JwtPayload} from "jsonwebtoken";
import { client } from "@repo/database/client";
import { signUpvalidations, signInvalidations } from '../validations/validations';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

async function createUser({ username, password, email }: { username: string; password: string; email: string }) {
    return await client.user.create({
        data: { username, password, email },
    });
}

function generateToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

async function findUserByEmailAndPassword(email: string, password: string) {
    return await client.user.findUnique({
        where: { email, password },
    });
}

async function handleSignUp(req: Request, res: any) {
    const validation = signUpvalidations.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ message: "Failed to sign up", errors: validation.error });
    }

    const { username, password, email } = validation.data;

    try {
        const newUser = await createUser({ username, password, email });
        const token = generateToken({
            id: newUser.id,
            email: newUser.email,
        });

        return res.status(201).json({ message: "User created successfully", user: newUser, token });
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).json({ message: "Error creating user" });
    }
}

 async function handleSignIn(req: Request, res: any) {
    const validation = signInvalidations.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ message: "Failed to sign in", errors: validation.error });
    }

    const { email, password } = validation.data;

    try {
        const user = await findUserByEmailAndPassword(email, password);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
        });

        return res.json({
            message: "Logged in successfully",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error signing in:", error);
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

export {handleSignUp,handleSignIn}