import { Server } from "socket.io";
import axios from "axios";

const appusers = new Map<string, string>();

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

        socket.on("message-delete", async (data) => {
            const { id, recieverId } = data;
            console.log("Receiver ID reached:", recieverId);
            try {
                const response: any = await axios.delete(
                    `http://localhost:5173/api/deleteMessage/${id}`
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
                const response: any = await axios.post("http://localhost:5173/api/addconvp", {
                    conversationId,
                    senderId,
                    body,
                });

                console.log("Message added:", response.data);
                const recipientSocketId = appusers.get(recieverId);
                console.log("Recipient socket ID:", recipientSocketId);

                if (recipientSocketId) {
                    socket.to(recipientSocketId).emit("receive-Message", {
                        conversationId,
                        senderId,
                        body,
                        createdAt,
                        updatedAt: response.data.message.updatedAt,
                        id: response.data.message.id,
                    });
                } else {
                    console.log(`User ${recieverId} is not connected. Message saved to DB.`);
                }
            } catch (error) {
                console.error("Error adding conversation:", error);
                socket.emit("error", { message: "Failed to add conversation" });
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
