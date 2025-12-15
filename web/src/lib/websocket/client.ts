import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeWebSocket = (token: string) => {
    if (socket?.connected) return socket;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000';

    socket = io(WS_URL, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
        console.log('✅ WebSocket connected');
    });

    socket.on('disconnect', () => {
        console.log('❌ WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
    });

    return socket;
};

export const disconnectWebSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;

export const onEmailVerified = (callback: (data: any) => void) => {
    socket?.on('email:verified', callback);
};

export const onPasswordReset = (callback: (data: any) => void) => {
    socket?.on('password:reset', callback);
};

export const offEmailVerified = () => {
    socket?.off('email:verified');
};

export const offPasswordReset = () => {
    socket?.off('password:reset');
};
