// services/conversationService.ts
import { client } from "@repo/database/client";
import express, { Request, Response } from 'express';

// Function to get all conversations for a user
 async function getAllConversations(req: express.Request, res: any) {
    try {
        const userId = req.params.id;

        const conversations = await client.conversation.findMany({
            where: {
                participants: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                participants: {
                    select: {
                        userId: true,
                        conversationId: true,
                    },
                },
            },
        });

        if (!conversations.length) {
            return res.status(404).json({ message: "No conversations found for this user" });
        }

        const userConvoMap:any = {};

        conversations.forEach((conversation) => {
            conversation.participants.forEach((participant) => {
                if (participant.userId !== userId) {
                    if (!userConvoMap[participant.userId]) {
                        userConvoMap[participant.userId] = [];
                    }
                    userConvoMap[participant.userId].push(participant.conversationId);
                }
            });
        });

        const uniqueUserIds = Object.keys(userConvoMap);

        const uniqueUsers = await client.user.findMany({
            where: {
                id: {
                    in: uniqueUserIds,
                },
            },
        });

        const response = uniqueUsers.map((user) => ({
            ...user,
            conversationIds: userConvoMap[user.id] || [],
        }));

        return res.json(response);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Error fetching user data" });
    }
}

// Function to get all messages in a conversation
async function getMessages(req: Request, res: any) {
    try {
        const conversationId = req.params.id;
    
        if (!conversationId) {
          return res.status(400).json({ message: "Missing conversation ID" });
        }
    
        const primaryMessage = {
          id: "1",
          conversationId: conversationId,
          senderId: "system",
          body: "Messages are end-to-end encrypted. No one outside of this chat can read them.",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
    
        const messages = await client.message.findMany({
          where: {
            conversationId,
          },
          orderBy: {
            createdAt: "asc",
          },
        });
    
        return res.status(200).json({
          success: true,
          data: [primaryMessage, ...messages],
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
}



// Function to add a message to a conversation
 async function addConversationMessage(req: Request, res: any) {
    const { conversationId, senderId, body } = req.body;
    console.log(conversationId, senderId, body);

    try {
        const userExists = await client.user.findUnique({
            where: { id: senderId },
        });
        if (!userExists) {
            return res.status(400).json({ message: "Invalid senderId" });
        }

        const message = await client.message.create({
            data: {
                conversationId,
                senderId,
                body,
            },
        });

        return res.status(201).json({ msg: "Success", message });
    } catch (error) {
        console.error("Error adding conversation message:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Function to link users and create a conversation if one doesn't exist
 async function linkUsersToConversation(req: Request, res: any) {
    const { userId1, userId2 } = req.body;
    console.log(userId1, userId2);

    if (!userId1 || !userId2) {
        return res.status(400).json({ message: "Both userId1 and userId2 are required" });
    }

    try {
        const existingConversation = await client.conversation.findFirst({
            where: {
                participants: {
                    every: {
                        OR: [
                            { userId: userId1 },
                            { userId: userId2 },
                        ],
                    },
                },
            },
            include: { participants: true },
        });

        let conversation;
        if (existingConversation) {
            conversation = existingConversation;
        } else {
            conversation = await client.conversation.create({
                data: {
                    participants: {
                        create: [
                            { userId: userId1 },
                            { userId: userId2 },
                        ],
                    },
                },
                include: { participants: true },
            });
        }

        return res.status(200).json({
            message: "Conversation linked successfully",
            conversationId: conversation.id,
            participants: conversation.participants,
        });
    } catch (error) {
        console.error("Error linking users to conversation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
// GET /api/accepted-users

// async function getAcceptedUsers(req: Request, res: any) {
//     try {
//         const acceptedUsers = await client.user.findMany({
//             where: {
//                 Accepted: true,
//             },
//         });

//         return res.status(200).json(acceptedUsers);
//     } catch (error) {
//         console.error("Error fetching accepted users:", error);
//         return res.status(500).json({ message: "Error fetching accepted users" });
//     }
// }

async function getAcceptedUsers(req: Request, res: any) {
    try {
        const {id} = req.params; // or however you get current user ID
        const currentUserId=id;
        const friendships = await client.friendship.findMany({
          where: {
            accepted: true,
            OR: [
              { senderId: currentUserId },
              { receiverId: currentUserId },
            ],
          },
          include: {
            sender: true,
            receiver: true,
          },
        });
    
        const partners = friendships.map((friendship) => {
          const isSender = friendship.senderId === currentUserId;
          const partner = isSender ? friendship.receiver : friendship.sender;
    
          return {
            id: partner.id,
            username: partner.username,
            profilePic: partner.profilePic,
            bio: partner.bio,
            gender: partner.gender,
          };
        });
    
        res.status(200).json(partners);
      } catch (error) {
        console.error("Error fetching chat partners:", error);
        res.status(500).json({ error: "Something went wrong" });
      }
    
}


export {getAllConversations,getMessages,addConversationMessage,linkUsersToConversation,getAcceptedUsers}