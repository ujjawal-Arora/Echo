import { Server } from "socket.io";
import { createServer } from 'http';
import  Express, { Request, Response }  from "express";
import { client } from '@repo/db/client';
const server = createServer();
const app = Express();
app.use(Express.json());
app.post("/",async(req:Request,res:Response)=>{
    console.log("Enneted")
    const {username, message} = req.body;
    await client.user.create({
        data: {
            username,
            message
        }
    })
    res.send("Message sent successfully")
})
app.listen(5174,()=>{
    console.log("Server started on port 5174");

})
// server.listen(5173, () => {
//     console.log("Server started on port 5173");
// });
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//     },
// });
// let arr = {};
// io.on('connection', (socket) => {
//     console.log(socket.id);
//     socket.on("send message", (data) => {
//         socket.broadcast.emit("new message", (data))
//     })
//     socket.on("disconnect", () => {
//         console.log(socket.id);
//     })
// })
