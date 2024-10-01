import { Server } from "socket.io";
import { createServer } from 'http';
import Express, { Request, Response } from "express";
import router from "./routes/userroutes";
import axios from 'axios';
const app = Express();
const server = createServer(app);
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
    socket.on("send message", async(data) => {
        const { conversationId, senderId, body } = data;
        try {
            const response = await axios.post('http://localhost:5173/api/addconvp', {
                conversationId,
                senderId,
                body
            });
            socket.broadcast.emit("new message", {
                conversationId,
                senderId,
                body
            });
        } catch (error) {
            console.error('Error adding conversation:', error);
            socket.emit("error", { message: "Failed to add conversation" });
        }
    })
    socket.on("disconnect", () => {
        console.log(socket.id);
    })
})
server.listen(5173, () => {
    console.log("Server started on port 5173");
});
