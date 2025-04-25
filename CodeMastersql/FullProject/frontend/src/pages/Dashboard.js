import { Container, Typography, Button } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4">Welcome, {user?.sub}</Typography>
      <Button variant="outlined" onClick={() => { logout(); navigate('/signin'); }}>Logout</Button>
    </Container>
  );
}
