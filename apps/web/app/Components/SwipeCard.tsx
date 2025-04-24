import { io } from "socket.io-client";
import { config } from '../config';

const handleSwipe = (direction: string, user: { id: string }) => {
    if (direction === 'right') {
        // Emit right-swipe event
        const socket = io(config.apiBaseUrl.replace('/api', ''));
        socket.emit('right-swipe', {
            senderId: localStorage.getItem('userId'),
            receiverId: user.id
        });
        console.log('Right swipe emitted for user:', user.id);
    }
    // ... existing swipe handling code ...
}; 