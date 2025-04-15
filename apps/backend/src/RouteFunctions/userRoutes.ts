import { Request, Response } from "express";
import { userDetailsValidation } from "../validations/validations";
import { client } from "@repo/database/client";
import jwt ,{JwtPayload} from "jsonwebtoken";
import { PrismaClient, Gender } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET||"ujjawal";


async function UserDetails(req: Request, res: any) {
    const { email, ...userDetails } = req.body; 
    console.log("Email:", email);
    console.log("User details:", userDetails);

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Validate user details
        const validation = userDetailsValidation.safeParse(userDetails);
        if (!validation.success) {
            const formattedErrors = validation.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            }));
            console.log("Validation errors:", formattedErrors);
            return res.status(400).json({ message: "Validation failed", errors: formattedErrors });
        }

        // Check if user exists
        const existingUser = await client.user.findUnique({
            where: { email }
        });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const { bio, gender, interests, profilePic, location, lookingFor, RelationShipType } = validation.data;
        console.log("Validated data:", { bio, gender, interests, profilePic, location, lookingFor, RelationShipType });

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
    } catch (error: any) {
        console.error("Error updating user details:", error);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error?.message || "Unknown error occurred" 
        });
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
    const { receiverId, senderId } = req.body;

    try {
        // Create a new friendship request
        const friendship = await client.friendship.create({
            data: {
                senderId: senderId,
                receiverId: receiverId,
                accepted: false
            }
        });

        res.status(200).json({ 
            success: true,
            message: "Request sent successfully",
            friendship 
        });
    } catch (error) {
        console.error("Error sending request:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to send request" 
        });
    }
}

// Fetch users matching a user's criteria
async function fetchUsers(req: Request, res: any) {
    const { userId } = req.body;
    console.log("Received request for userId:", userId);

    try {
        if (!userId) {
            console.log("No userId provided");
            return res.status(400).json({ message: "User ID is required" });
        }

        // Get current user's gender
        console.log("Fetching current user details...");
        const currentUser = await client.user.findUnique({
            where: { id: userId },
            select: { gender: true },
        });

        if (!currentUser) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        if (!currentUser.gender) {
            console.log("User gender not set");
            return res.status(400).json({ message: "User's gender is not set" });
        }

        // Fetch existing interactions
        console.log("Fetching existing interactions...");
        const existingInteractions = await client.friendship.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            select: {
                senderId: true,
                receiverId: true
            }
        });

        const interactedUserIds = new Set(
            existingInteractions.flatMap(interaction => [interaction.senderId, interaction.receiverId])
        );
        console.log("Interacted user IDs:", Array.from(interactedUserIds));

        // Determine target gender(s)
        let targetGenders: Gender[] = [];

        if (currentUser.gender === 'male') {
            targetGenders = ['female'];
        } else if (currentUser.gender === 'female') {
            targetGenders = ['male'];
        } else {
            // For 'other' or undefined genders, match both male and female
            targetGenders = ['male', 'female'];
        }

        console.log("Target genders:", targetGenders);

        // Fetch matching users
        console.log("Fetching matching users...");
        const users = await client.user.findMany({
            where: {
                AND: [
                    { gender: { in: targetGenders } },
                    { id: { not: userId } },
                    { id: { notIn: Array.from(interactedUserIds) } }
                ]
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
                gender: true
            },
            take: 10,
        });

        console.log("Found matching users:", users);
        res.status(200).json(users);

    } catch (error: any) {
        console.error("Error in fetchUsers:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error?.message || "Unknown error occurred"
        });
    }
}

// Fetch requests sent to a user
async function fetchRequestData(req: Request, res: any) {
    const { userId } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        // Get all pending friendship requests where the user is the receiver
        const pendingRequests = await client.friendship.findMany({
            where: {
                receiverId: userId,
                accepted: false
            },
            include: {
                sender: {
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
                    }
                }
            }
        });

        if (!pendingRequests || pendingRequests.length === 0) {
            return res.status(200).json({ requests: [] });
        }

        // Transform the data to match the expected format
        const requests = pendingRequests.map(request => ({
            id: request.sender.id,
            username: request.sender.username,
            bio: request.sender.bio,
            gender: request.sender.gender,
            profilePic: request.sender.profilePic,
            interests: request.sender.interests,
            location: request.sender.location,
            lookingFor: request.sender.lookingFor,
            RelationShipType: request.sender.RelationShipType,
        }));

        res.status(200).json({ requests });
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

        // Use a transaction to ensure both friendship and conversation are created atomically
        const result = await client.$transaction(async (prisma) => {
            // Update friendship status
            const friendship = await prisma.friendship.upsert({
                where: {
                    senderId_receiverId: {
                        senderId: reqComeId,
                        receiverId: userId,
                    },
                },
                create: {
                    senderId: reqComeId,
                    receiverId: userId,
                    accepted: accepted,
                },
                update: {
                    accepted: accepted,
                },
            });

            // If accepted, create a conversation
            if (accepted) {
                // Check for existing conversation
                const existingConversation = await prisma.conversation.findFirst({
                    where: {
                        AND: [
                            {
                                participants: {
                                    some: {
                                        userId: userId
                                    }
                                }
                            },
                            {
                                participants: {
                                    some: {
                                        userId: reqComeId
                                    }
                                }
                            }
                        ]
                    },
                    include: {
                        participants: true
                    }
                });

                let conversation;
                if (existingConversation) {
                    console.log("Found existing conversation:", existingConversation.id);
                    conversation = existingConversation;
                } else {
                    console.log("Creating new conversation");
                    conversation = await prisma.conversation.create({
                        data: {
                            participants: {
                                create: [
                                    { userId: userId },
                                    { userId: reqComeId }
                                ]
                            }
                        },
                        include: {
                            participants: true
                        }
                    });

                    // Create welcome message only for new conversations
                    await prisma.message.create({
                        data: {
                            conversationId: conversation.id,
                            senderId: reqComeId,
                            body: "Messages are end-to-end encrypted. No one outside of this chat can read them."
                        }
                    });
                }

                return { friendship, conversation };
            }

            return { friendship };
        });

        res.status(200).json({
            message: `Request ${accepted ? "accepted" : "deleted"}`,
            accepted: accepted,
            conversationId: result.conversation?.id
        });
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ error: "Failed to handle request" });
    }
}

// Get user details by ID
async function getUserById(req: Request, res: any) {
    try {
        const userId = req.params.id;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        
        const user = await client.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                profilePic: true,
                bio: true,
                gender: true,
            },
        });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { UserDetails,handleDeleteMessage,sendRequest,handleRequest,fetchRequestData,fetchUsers,getUserById };
// 295dd90d-5459-4574-87b0-b2ce2bd7effa