import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, TextField, IconButton, Typography, Avatar, 
  Paper, List, ListItem, ListItemAvatar, ListItemText, Divider,
  Drawer, Fab
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from '../api/axiosConfig';
import { useAuth } from '../auth/AuthContext';

const ChatWindow = ({ recipient, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const scrollRef = useRef();
    const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:9090";

    useEffect(() => {
        if (!recipient || !user) return;

        // Fetch history
        axios.get(`/chat/history/${recipient.email}`).then(res => {
            setMessages(res.data);
        });

        // Setup WebSocket
        const socket = new SockJS(`${BASE_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/user/${user.email}/queue/messages`, (message) => {
                    const received = JSON.parse(message.body);
                    setMessages(prev => [...prev, {
                        sender: { email: received.senderEmail },
                        content: received.content,
                        timestamp: received.timestamp
                    }]);
                });
            },
        });

        client.activate();
        setStompClient(client);

        return () => client.deactivate();
    }, [recipient, user, BASE_URL]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !stompClient) return;

        const payload = {
            recipientEmail: recipient.email,
            content: newMessage
        };

        stompClient.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(payload)
        });

        setNewMessage("");
    };

    if (!recipient) return null;

    return (
        <Drawer
            anchor="right"
            open={!!recipient}
            onClose={onClose}
            sx={{ '& .MuiDrawer-paper': { width: 350, p: 0 } }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                    <Avatar src={recipient.profileImage} sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ flex: 1 }}>{recipient.username}</Typography>
                    <IconButton color="inherit" onClick={onClose}><CloseIcon /></IconButton>
                </Box>

                <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
                    {messages.map((msg, i) => (
                        <Box 
                            key={i} 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: msg.sender.email === user.email ? 'flex-end' : 'flex-start',
                                mb: 1
                            }}
                        >
                            <Paper 
                                sx={{ 
                                    p: 1.5, 
                                    maxWidth: '80%', 
                                    bgcolor: msg.sender.email === user.email ? 'primary.main' : 'white',
                                    color: msg.sender.email === user.email ? 'white' : 'black',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="body2">{msg.content}</Typography>
                            </Paper>
                        </Box>
                    ))}
                    <div ref={scrollRef} />
                </Box>

                <Box sx={{ p: 2, display: 'flex', borderTop: '1px solid #ddd' }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <IconButton color="primary" onClick={handleSendMessage}><SendIcon /></IconButton>
                </Box>
            </Box>
        </Drawer>
    );
};

export default ChatWindow;
