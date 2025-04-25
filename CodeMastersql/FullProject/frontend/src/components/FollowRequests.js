import { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Avatar } from '@mui/material';
import axios from '../api/axiosConfig';

export default function FollowRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('/follow/requests').then(res => setRequests(res.data));
  }, []);

  const accept = (id) => {
    axios.post(`/follow/accept/${id}`).then(() => {
      setRequests(prev => prev.filter(req => req.id !== id));
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Follow Requests</Typography>
      <List>
        {requests.map(req => (
          <ListItem key={req.id}>
            <Avatar sx={{ mr: 2 }}>{req.follower.username.charAt(0).toUpperCase()}</Avatar>
            <ListItemText primary={req.follower.username} secondary={req.follower.email} />
            <Button variant="contained" onClick={() => accept(req.id)}>Accept</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
