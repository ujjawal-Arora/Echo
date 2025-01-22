import { Server } from "socket.io";
import { createServer } from 'http';
import Express, { Request, Response } from "express";
import router from "./routes/userroutes";
import axios from 'axios';
import cors from 'cors';
const app = Express();
const server = createServer(app);
const appusers = new Map<string, string>();
app.use(cors({
    origin: '*'
}));

app.use(Express.json());
app.use("/api", router);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
let arr = {};
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on("connectUser", (data) => {
        appusers.set(data.userId, data.socketId);
        console.log(appusers);
    })

    socket.on('message-delete', async (data) => {
        const { id, recieverId } = data;
        console.log("Reciever id  reached,", recieverId);
        try {
            const response: any = await axios.delete(`http://localhost:5173/api/deleteMessage/${id}`);

            const recipientSocketId = appusers.get(recieverId);
            console.log(response);
            if (recipientSocketId) {
                console.log("reached  here");
                socket.to(recipientSocketId).emit('revised-Message', {
                    conversationId: response.data.conversationId,
                    senderId: response.data.senderId,
                    body: response.data.body,
                    createdAt: response.data.createdAt,
                    updatedAt: response.data.updatedAt,
                    id: response.data.id
                });
            }
        } catch (error) {

        }

    })
    socket.on("new-message", async (data) => {
        const { conversationId, senderId, body, socketId, recieverId, createdAt } = data;
        try {
            const response: any = await axios.post('http://localhost:5173/api/addconvp', {
                conversationId,
                senderId,
                body
            });
            console.log(response.data);
            const recipientSocketId = appusers.get(recieverId);
            console.log(recipientSocketId, recieverId);
            if (recipientSocketId) {
                socket.to(recipientSocketId).emit("receive-Message", {
                    conversationId,
                    senderId,
                    body,
                    createdAt,
                    updatedAt: response.data.message.updatedAt,
                    id: response.data.message.id
                });
                console.log("clsappusers", appusers)
            } else {
                // Optionally handle the case where the user is not connected
                console.log(`User ${recieverId} is not connected. Message saved to DB.`);
                // You can also notify the sender if necessary
            }
            // io.to(conversationId).emit("new-message", {
            //     conversationId,
            //     senderId,
            //     body
            // });
            console.log("socket.id......", socketId)
        } catch (error) {
            console.error('Error adding conversation:', error);
            socket.emit("error", { message: "Failed to add conversation" });
        }
    })
    socket.on("disconnect", () => {
        for (const [userId, id] of appusers.entries()) {
            if (id === socket.id) {
                appusers.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
        console.log(socket.id);
    })
})
server.listen(5173, () => {
    console.log("Server started on port 5173");
});
