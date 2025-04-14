import { Request, Response } from "express";
import { userDetailsValidation } from "../validations/validations";
import { client } from "@repo/database/client";
import jwt ,{JwtPayload} from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET||"ujjawal";


async function UserDetails(req: Request, res: any) {
    const { token, ...userDetails } = req.body; 
    console.log("Token:", token);

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        const email = decoded.email;
        console.log("Email:", email);

        if (!email) {
            return res.status(400).json({ message: "Invalid token", errors: "Email not found in token" });
        }

        // Validate user details
        const validation = userDetailsValidation.safeParse(userDetails);
        if (!validation.success) {
            const formattedErrors = validation.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            }));
            return res.status(400).json({ message: "Validation failed", errors: formattedErrors });
        }

        const { bio, gender, interests, profilePic, location, lookingFor, RelationShipType } = validation.data;
        console.log("Interests:", interests);

        // Update user details in the database
        const updatedUser = await client.user.update({
            where: { email },
            data: {
                bio,
                gender,
                interests,
                profilePic,
                location,
                lookingFor,
                RelationShipType,
            },
        });

        return res.status(200).json({ message: "User details updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function handleDeleteMessage(req: Request, res: any) {
    try {
        const response = await client.message.delete({
            where: { id: req.params.id },
        });
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error deleting message:", error);
        return res.status(400).send("Error occurred");
    }
}


// Send a request to another user
 async function sendRequest(req: Request, res: Response) {
    const { recieverId, senderId } = req.body;

    try {
        await client.user.update({
            where: { id: recieverId },
            data: { requests: { push: senderId } },
        });
        res.status(200).json({ message: "Request sent successfully" });
    } catch (error) {
        console.error("Error sending request:", error);
        res.status(500).json({ error: "Failed to send request" });
    }
}

// Fetch users matching a user's criteria
 async function fetchUsers(req: Request, res: any) {
    const { userId } = req.body;

    try {
        const user = await client.user.findUnique({
            where: { id: userId },
            select: { lookingFor: true, gender: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const genderToMatch = user.lookingFor as "male" | "female" | "other";

        const users = await client.user.findMany({
            where: {
                gender: genderToMatch,
                id: { not: userId },
            },
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                profilePic: true,
                interests: true,
                location: true,
                lookingFor: true,
                RelationShipType: true,
            },
            take: 10,
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Fetch requests sent to a user
 async function fetchRequestData(req: Request, res: any) {
    const { userId } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        const user = await client.user.findUnique({
            where: { id: userId },
            select: { requests: true },
        });

        if (!user || !user.requests || user.requests.length === 0) {
            return res.status(404).json({ error: "No requests available" });
        }

        const requestedUsers = await client.user.findMany({
            where: { id: { in: user.requests } },
            select: {
                id: true,
                username: true,
                bio: true,
                gender: true,
                profilePic: true,
                interests: true,
                location: true,
                lookingFor: true,
                RelationShipType: true,
            },
        });

        res.status(200).json(requestedUsers);
    } catch (error) {
        console.error("Error fetching request data:", error);
        res.status(500).json({ error: "Failed to fetch request data" });
    }
}

// Delete or accept a request
 async function handleRequest(req: Request, res: any) {
    const { reqComeId, userId, accepted } = req.body;

    try {
        if (!reqComeId || !userId) {
            return res.status(400).json({ error: "Request ID and User ID are required" });
        }

        const user = await client.user.findUnique({
            where: { id: userId },
            select: { requests: true },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedRequests = user.requests.filter((requestId: string) => requestId !== reqComeId);

        await client.user.update({
            where: { id: userId },
            data: {
                Accepted: accepted,
                requests: updatedRequests,
            },
        });

        res.status(200).json({
            message: `Request ${accepted ? "accepted" : "deleted"}`,
            Accepted: accepted,
        });
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ error: "Failed to handle request" });
    }
}


export { UserDetails,handleDeleteMessage,sendRequest,handleRequest,fetchRequestData,fetchUsers };
// 295dd90d-5459-4574-87b0-b2ce2bd7effa