import { io } from "socket.io-client";
import axios from "axios";
import { config } from '../../config';

interface User {
  id: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const handleSwipeRight = async (user: User) => {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("User ID not found in localStorage");
            return;
        }

        // Initialize socket
        const socket = io(config.apiBaseUrl.replace('/api', ''));

        // Emit right-swipe event
        socket.emit("right-swipe", {
            senderId: userId,
            receiverId: user.id
        });

        // Send friendship request
        const response = await axios.post<ApiResponse>(`${config.apiBaseUrl}/sendreq`, {
            senderId: userId,
            receiverId: user.id
        });

        if (response.data.success) {
            console.log("Friendship request sent successfully");
        } else {
            console.error("Failed to send friendship request:", response.data.message);
        }
    } catch (error) {
        console.error("Error sending friendship request:", error);
    }
}; 