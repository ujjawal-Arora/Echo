import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import axios from "axios";
import { config } from '../config';
import { PrismaClient } from '@prisma/client';

const appusers = new Map<string, string>();
const client = new PrismaClient();

interface UserResponse {
    success: boolean;
    data: {
        username: string;
        profilePic: string;
    };
}

export const initializeSocket = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on("connectUser", (data) => {
            appusers.set(data.userId, data.socketId);
            console.log("Current appusers:", appusers);
        });

        socket.on("join-conversation", (data) => {
            const { conversationId } = data;
            socket.join(`conversation:${conversationId}`);
            console.log(`Socket ${socket.id} joined conversation room: conversation:${conversationId}`);
        });

        socket.on("leave-conversation", (data) => {
            const { conversationId } = data;
            socket.leave(`conversation:${conversationId}`);
            console.log(`Socket ${socket.id} left conversation room: conversation:${conversationId}`);
        });

        socket.on("conversation-opened", (data) => {
            const { conversationId } = data;
            console.log(`Conversation opened: ${conversationId}`);
            
            // Emit an event to reset the unread count for this conversation
            socket.emit("reset-unread-count", { conversationId });
        });

        socket.on("message-delete", async (data) => {
            const { id, recieverId } = data;
            console.log("Receiver ID reached:", recieverId);
            try {
                const response: any = await axios.delete(
                    `${config.baseUrl}/api/deleteMessage/${id}`
                );

                const recipientSocketId = appusers.get(recieverId);
                console.log(response);

                if (recipientSocketId) {
                    console.log("Reached here");
                    socket.to(recipientSocketId).emit("revised-Message", {
                        conversationId: response.data.conversationId,
                        senderId: response.data.senderId,
                        body: response.data.body,
                        createdAt: response.data.createdAt,
                        updatedAt: response.data.updatedAt,
                        id: response.data.id,
                    });
                }
            } catch (error) {
                console.error("Error deleting message:", error);
            }
        });

        socket.on("new-message", async (data) => {
            const { conversationId, senderId, body, socketId, recieverId, createdAt } = data;
            try {
                console.log("Received new message:", { conversationId, senderId, body, socketId, recieverId });
                
                // First verify the conversation exists
                const conversation = await client.conversation.findUnique({
                    where: { id: conversationId },
                });
                
                if (!conversation) {
                    console.error("Conversation not found:", conversationId);
                    socket.emit("error", { message: "Conversation not found" });
                    return;
                }

                // Then verify the sender exists
                const userExists = await client.user.findUnique({
                    where: { id: senderId },
                });
                
                if (!userExists) {
                    console.error("User not found:", senderId);
                    socket.emit("error", { message: "Invalid sender" });
                    return;
                }

                // Create the message directly using Prisma client
                const message = await client.message.create({
                    data: {
                        conversationId,
                        senderId,
                        body,
                    },
                });

                console.log("Message created successfully:", message);
                
                const recipientSocketId = appusers.get(recieverId);
                console.log("Recipient socket ID:", recipientSocketId);

                const messageData = {
                    conversationId,
                    senderId,
                    body,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt,
                    id: message.id,
                };

                // Emit to recipient if they're connected
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit("receive-Message", messageData);
                    console.log(`Message sent to recipient: ${recieverId} at socket: ${recipientSocketId}`);
                } else {
                    console.log(`User ${recieverId} is not connected. Message saved to DB.`);
                }

                // Emit back to sender to confirm message was sent
                if (socketId !== recipientSocketId) {
                    io.to(socketId).emit("receive-Message", messageData);
                    console.log(`Message confirmation sent to sender: ${senderId} at socket: ${socketId}`);
                }
                
                // Also emit to all sockets in the conversation room
                io.to(`conversation:${conversationId}`).emit("receive-Message", messageData);
                console.log(`Message broadcast to conversation room: conversation:${conversationId}`);
            } catch (error) {
                console.error("Error saving message:", error);
                socket.emit("error", { message: "Failed to save message" });
            }
        });

        // Handle right-swipe notifications
        socket.on("right-swipe", async (data: { senderId: string; receiverId: string }) => {
            try {
                const { senderId, receiverId } = data;
                
                // Get sender's details
                const senderResponse = await axios.get<UserResponse>(`${config.baseUrl}/api/user/${senderId}`);
                if (!senderResponse.data.success) {
                    console.error('Failed to fetch sender details');
                    return;
                }

                const senderDetails = senderResponse.data.data;
                const receiverSocketId = appusers.get(receiverId);

                if (receiverSocketId) {
                    // Send notification to receiver if they're connected
                    io.to(receiverSocketId).emit('right-swipe-notification', {
                        senderId,
                        senderUsername: senderDetails.username,
                        senderProfilePic: senderDetails.profilePic,
                        timestamp: new Date().toISOString()
                    });
                    console.log(`Notification sent to user ${receiverId}`);
                } else {
                    // Store notification for later if receiver is not connected
                    console.log(`User ${receiverId} is not connected. Notification will be stored.`);
                }
            } catch (error) {
                console.error('Error handling right-swipe:', error);
            }
        });

        // Handle request acceptance notification
        socket.on("request-accepted", async (data: { receiverId: string; conversationId: string }) => {
            try {
                const { receiverId, conversationId } = data;
                const receiverSocketId = appusers.get(receiverId);

                if (receiverSocketId) {
                    // Send notification to the user whose request was accepted
                    io.to(receiverSocketId).emit('request-accepted-notification', {
                        conversationId,
                        timestamp: new Date().toISOString()
                    });
                    console.log(`Request acceptance notification sent to user ${receiverId}`);
                }
            } catch (error) {
                console.error('Error handling request acceptance:', error);
            }
        });

        // Handle request rejection notification
        socket.on("request-rejected", async (data: { receiverId: string }) => {
            try {
                const { receiverId } = data;
                const receiverSocketId = appusers.get(receiverId);

                if (receiverSocketId) {
                    // Send notification to the user whose request was rejected
                    io.to(receiverSocketId).emit('request-rejected-notification', {
                        timestamp: new Date().toISOString()
                    });
                    console.log(`Request rejection notification sent to user ${receiverId}`);
                }
            } catch (error) {
                console.error('Error handling request rejection:', error);
            }
        });

        socket.on("disconnect", () => {
            for (const [userId, id] of appusers.entries()) {
                if (id === socket.id) {
                    appusers.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
