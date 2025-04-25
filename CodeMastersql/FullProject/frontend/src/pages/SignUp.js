
import { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "../api/axiosConfig";
import { useAuth } from "../auth/AuthContext";

// Your imports remain the same...

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const { fullName, email, password, confirmPassword } = formData;
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreed) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", fullName);
      formDataToSend.append("email", email);
      formDataToSend.append("password", password);
      if (profileImage) {
        formDataToSend.append("file", profileImage);
      }

      const res = await axios.post("/auth/signup-with-image", formDataToSend);
      login(res.data.token);
      toast.success("Account created!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign up failed");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:9090/oauth2/authorization/google";
  };

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f7f9fc",
      p: 2
    }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 4,
          borderRadius: 5,
          boxShadow: "0px 12px 40px rgba(0,0,0,0.08)",
          backgroundColor: "#fff"
        }}
      >
        <Typography variant="h4" fontWeight="bold" align="center" mb={2} sx={{ color: "#4f46e5" }}>
        CodeMaster 
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: "#6b7280", mb: 3 }}>
          Join and grow your skills with us
        </Typography>

        <Box textAlign="center" mb={3}>
          <Avatar src={preview} sx={{ width: 72, height: 72, mx: "auto", mb: 1 }} />
          <Button component="label" size="small" variant="outlined">
            Upload Profile Image
            <input hidden type="file" accept="image/*" onChange={handleImageChange} />
          </Button>
        </Box>

        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={fullName}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          sx={{ borderRadius: 10 }}
        />

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          value={email}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <Button onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            )
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <Button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </Button>
            )
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              sx={{ color: "#4f46e5" }}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{" "}
              <span style={{ color: "#4f46e5", fontWeight: "bold", cursor: "pointer" }}>
                Terms & Conditions
              </span>
            </Typography>
          }
          sx={{ mt: 1 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 99,
            fontWeight: 600,
            fontSize: "1rem",
            background: "linear-gradient(to right, #6366f1, #60a5fa)",
            boxShadow: "0 8px 20px rgba(99,102,241,0.3)",
            textTransform: "none"
          }}
        >
          Sign Up
        </Button>

        <Divider sx={{ my: 3 }}><Typography variant="body2">OR</Typography></Divider>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignup}
          sx={{
            py: 1.5,
            borderRadius: 99,
            textTransform: "none",
            fontWeight: 500,
            borderColor: "#e5e7eb",
            "&:hover": {
              backgroundColor: "#f3f4f6",
              borderColor: "#4f46e5"
            }
          }}
        >
          Sign up with Google
        </Button>

        <Typography variant="body2" align="center" mt={3}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            style={{ color: "#4f46e5", fontWeight: 600, cursor: "pointer" }}
          >
            Sign In
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
