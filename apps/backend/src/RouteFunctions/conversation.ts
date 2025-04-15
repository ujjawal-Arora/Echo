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
        
        console.log(`Fetching messages for conversation: ${conversationId}`);
    
        // Check if the conversation exists
        const conversation = await client.conversation.findUnique({
            where: { id: conversationId },
        });
        
        if (!conversation) {
            console.error("Conversation not found:", conversationId);
            return res.status(404).json({ 
                success: false,
                message: "Conversation not found" 
            });
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
        
        console.log(`Found ${messages.length} messages for conversation: ${conversationId}`);
    
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
    console.log("Adding message to conversation:", { conversationId, senderId, body });

    try {
        // Check if the conversation exists
        const conversation = await client.conversation.findUnique({
            where: { id: conversationId },
        });
        
        if (!conversation) {
            console.error("Conversation not found:", conversationId);
            return res.status(404).json({ message: "Conversation not found" });
        }
        
        // Check if the sender exists
        const userExists = await client.user.findUnique({
            where: { id: senderId },
        });
        
        if (!userExists) {
            console.error("User not found:", senderId);
            return res.status(400).json({ message: "Invalid senderId" });
        }

        // Create the message
        const message = await client.message.create({
            data: {
                conversationId,
                senderId,
                body,
            },
        });

        console.log("Message created successfully:", message);
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
        const {id} = req.params;
        const currentUserId = id as string;
        console.log("Fetching accepted users for:", currentUserId);

        // First, get all conversations for the current user
        const userConversations = await client.conversation.findMany({
            where: {
                participants: {
                    some: {
                        userId: currentUserId
                    }
                }
            },
            include: {
                participants: true
            }
        });
        console.log("User's conversations:", JSON.stringify(userConversations, null, 2));

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
    
        console.log("Found friendships:", friendships.length);
        console.log("Friendships:", JSON.stringify(friendships, null, 2));
    
        // Get conversations for each friendship
        const partnersWithConversations = await Promise.all(friendships.map(async (friendship) => {
          const isSender = friendship.senderId === currentUserId;
          const partner = isSender ? friendship.receiver : friendship.sender;
          
          // Find the conversation between these users from the user's conversations
          const conversation = userConversations.find(conv => 
            conv.participants.some(p => p.userId === partner.id)
          );
    
          console.log(`Conversation for ${partner.username}:`, conversation?.id || 'not found');
    
          // Create a new conversation if one doesn't exist
          let conversationId = conversation?.id;
          if (!conversationId) {
            console.log(`Creating new conversation for ${partner.username}`);
            const newConversation = await client.conversation.create({
              data: {
                participants: {
                  create: [
                    { userId: currentUserId },
                    { userId: partner.id }
                  ]
                }
              },
              include: {
                participants: true
              }
            });
            conversationId = newConversation.id;
            console.log(`Created new conversation: ${conversationId}`);

            // Also create a conversation for the partner if they don't have one
            const partnerConversations = await client.conversation.findMany({
              where: {
                participants: {
                  some: {
                    userId: partner.id
                  }
                }
              },
              include: {
                participants: true
              }
            });

            const partnerHasConversation = partnerConversations.some(conv => 
              conv.participants.some(p => p.userId === currentUserId)
            );

            if (!partnerHasConversation) {
              console.log(`Creating conversation for partner ${partner.username}`);
              await client.conversation.create({
                data: {
                  participants: {
                    create: [
                      { userId: partner.id },
                      { userId: currentUserId }
                    ]
                  }
                },
                include: {
                  participants: true
                }
              });
            }
          }
    
          // Ensure conversationId is a string
          const finalConversationId = conversationId || "";
    
          return {
            id: partner.id,
            username: partner.username,
            profilePic: partner.profilePic,
            bio: partner.bio,
            gender: partner.gender,
            conversationIds: [finalConversationId],
          };
        }));
    
        console.log("Returning partners with conversations:", JSON.stringify(partnersWithConversations, null, 2));
        res.status(200).json(partnersWithConversations);
      } catch (error) {
        console.error("Error fetching chat partners:", error);
        res.status(500).json({ error: "Something went wrong" });
      }
}


export {getAllConversations,getMessages,addConversationMessage,linkUsersToConversation,getAcceptedUsers}