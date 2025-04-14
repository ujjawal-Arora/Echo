import { createServer } from "http";
import Express from "express";
import router from "./routes/index";
import cors from "cors";
import { initializeSocket } from "./Socket/socket";

const app = Express();
const server = createServer(app);

app.use(cors({ origin: "*" }));
app.use(Express.json());
app.use("/api", router);

// Initialize Socket.io
initializeSocket(server);

server.listen(5173, () => {
    console.log("Server started on port 5173");
});
