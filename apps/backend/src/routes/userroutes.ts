import express, { Request, Response } from 'express';
import { client } from '@repo/database/client'
import { signUpvalidations, signInvalidations } from '../validations/validations';

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

router.get('/getallconversations/:id', async (req: express.Request, res: any) => {
    try {
        // Fetch conversations along with their participants for the given user ID
        const conversations = await client.conversation.findMany({
            where: {
                participants: {
                    some: {
                        userId: req.params.id // Ensure we're getting conversations for this user
                    }
                }
            },
            include: {
                participants: {
                    select: {
                        userId: true,
                        conversationId:true
                    }
                }
            }
        });

        // Check if there are any conversations found
        if (!conversations.length) {
            return res.status(404).json({ message: "No conversations found for this user" });
        }

        const userConvoMap:any = {};

        conversations.forEach(conversation => {
            conversation.participants.forEach(participant => {
                if (participant.userId !== req.params.id) { // Exclude current user
                    if (!userConvoMap[participant.userId]) {
                        userConvoMap[participant.userId] = [];
                    }
                    userConvoMap[participant.userId].push(participant.conversationId);
                }
            });
        });

        // Get unique user IDs
        const uniqueUserIds = Object.keys(userConvoMap);

        // Fetch unique users based on the user IDs
        const uniqueUsers = await client.user.findMany({
            where: {
                id: {
                    in: uniqueUserIds
                }
            }
        });

        // Create the response object that includes user details and their associated conversation IDs
        const response = uniqueUsers.map(user => ({
            ...user,
            conversationIds: userConvoMap[user.id] || [] // Add conversation IDs for each user
        }));

        return res.json(response);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Error fetching user data" });
    }
});
router.get('/getmessages/:id', async (req: Request, res: any) => {
    try {
        const messages = await client.message.findMany({
            where: {
                conversationId: req.params.id, 
            }
        });

        if (messages.length === 0) {
            return res.status(404).json({ message: "No messages found for this conversation" });
        }

        return res.json(messages);
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/addconvp",async(req:any,res:any)=>{
    const {conversationId,senderId,body}=req.body;
    console.log(conversationId,senderId,body);
    try{
        const userExists = await client.user.findUnique({
            where: { id: senderId }
        });
        if (!userExists) {
            return res.status(400).json({ message: "Invalid senderId" });
        }

        const message = await client.message.create({
            data: {
                conversationId,
                senderId,
                body
            },
        });
          return res.status(201).json({"msg":"Success"});
    }
    catch(error){
        return res.status(error).json({ message:error})
    }
})
export default router;
