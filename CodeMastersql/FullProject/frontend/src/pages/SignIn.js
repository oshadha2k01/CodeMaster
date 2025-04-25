

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Stack,
  Divider,
  InputAdornment,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "../api/axiosConfig";
import { useAuth } from "../auth/AuthContext";
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// same imports...

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill in both email and password");
      return;
    }
    try {
      const res = await axios.post("/auth/signin", { email, password });
      login(res.data.token);
      toast.success("Login successful!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafe' }}>
      <Container
        maxWidth="sm"
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        sx={{
          bgcolor: '#ffffff',
          mt: { xs: 8, md: 12 },
          mb: 6,
          p: 4,
          borderRadius: 4,
          boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.06)'
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1} align="center" sx={{ color: '#3b82f6' }}>
          CodeMaster
        </Typography>
        <Typography variant="body1" align="center" mb={4} sx={{ color: '#6b7280' }}>
          Please enter your details to sign in
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#a1a1aa' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#f3f4f6'
              }
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#a1a1aa' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#f3f4f6'
              }
            }}
          />

          <Typography
            variant="body2"
            sx={{
              textAlign: 'right',
              color: '#3b82f6',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Forgot password?
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
              }
            }}
          >
            Sign In
          </Button>

          <Divider sx={{ my: 3 }}><Typography variant="body2" sx={{ color: '#94a3b8' }}>OR</Typography></Divider>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{
              py: 1.5,
              borderRadius: 3,
              borderColor: '#e5e7eb',
              textTransform: 'none',
              fontWeight: 500,
              backgroundColor: '#ffffff',
              '&:hover': {
                borderColor: '#60a5fa',
                backgroundColor: '#f1f5f9'
              }
            }}
            onClick={() => window.location.href = "http://localhost:9090/oauth2/authorization/google"}
          >
            Sign in with Google
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 3, color: '#6b7280' }}>
            Don't have an account?{' '}
            <Typography
              component="span"
              sx={{
                color: '#3b82f6',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Typography>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
