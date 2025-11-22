import React, { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/AuthContext';

const NotificationSystem = () => {
    const { user } = useAuth();
    const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:9090";

    useEffect(() => {
        if (!user) return;

        const socket = new SockJS(`${BASE_URL}/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');
                stompClient.subscribe(`/user/${user.email}/queue/notifications`, (message) => {
                    if (message.body) {
                        toast.info(message.body, {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        stompClient.activate();

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, [user, BASE_URL]);

    return null; // This component doesn't render anything itself
};

export default NotificationSystem;
