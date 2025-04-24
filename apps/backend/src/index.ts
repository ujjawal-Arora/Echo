import { createServer } from "http";
import Express from "express";
import router from "./routes/index";
import cors from "cors";
import { initializeSocket } from "./Socket/socket";

const app = Express();
const server = createServer(app);

// // Get port from environment variable or use default
const PORT = process.env.PORT || 5173;

app.use(cors({ origin: "*" }));
app.use(Express.json());
app.use("/api", router);

// Initialize Socket.io
initializeSocket(server);

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
