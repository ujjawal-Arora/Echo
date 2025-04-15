import { io } from "socket.io-client";

const handleSwipe = (direction: string, user: { id: string }) => {
    if (direction === 'right') {
        // Emit right-swipe event
        const socket = io('http://localhost:5173');
        socket.emit('right-swipe', {
            senderId: localStorage.getItem('userId'),
            receiverId: user.id
        });
        console.log('Right swipe emitted for user:', user.id);
    }
    // ... existing swipe handling code ...
}; 