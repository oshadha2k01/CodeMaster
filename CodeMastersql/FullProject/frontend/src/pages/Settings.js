
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
  Card,
  Tab,
  Tabs,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import axios from "../api/axiosConfig";
import { toast } from "react-toastify";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SecurityIcon from "@mui/icons-material/Security";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!form.username || !form.email) {
      toast.error("Username and email are required");
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    if (form.password) formData.append("password", form.password);
    if (form.profileImage) formData.append("file", form.profileImage);

    try {
      await axios.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/auth/delete-account");
      toast.success("Account deleted. Goodbye!");
      localStorage.removeItem("token");
      window.location.href = "/signin";
    } catch (err) {
      toast.error(err.response?.data?.message || "Account deletion failed");
    }
    setOpenDeleteDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* Left sidebar */}
        <Card
          elevation={0}
          sx={{
            width: { xs: "100%", md: 280 },
            bgcolor: "white",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #eef2f6",
            position: "sticky",
            top: 24,
            height: "fit-content",
          }}
        >
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <label htmlFor="profile-image-upload">
                  <input
                    hidden
                    id="profile-image-upload"
                    accept="image/*"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <IconButton
                    component="span"
                    sx={{
                      bgcolor: "#4d7cfe",
                      color: "white",
                      width: 36,
                      height: 36,
                      "&:hover": { bgcolor: "#3a6bec" },
                      border: "2px solid white",
                    }}
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                </label>
              }
            >
              <Avatar
                src={
                  previewImage
                    ? previewImage
                    : user?.profileImage
                    ? `http://localhost:9090${user.profileImage}`
                    : undefined
                }
                alt={user?.username}
                sx={{
                  width: 100,
                  height: 100,
                  border: "4px solid white",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  bgcolor: "#4d7cfe",
                  fontSize: 40,
                }}
              >
                {!previewImage &&
                  !user?.profileImage &&
                  user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>

            <Typography
              variant="h6"
              align="center"
              fontWeight="600"
              sx={{ mt: 2, color: "#2d3748" }}
            >
              {user?.username || "User"}
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "#718096", mb: 2 }}
            >
              {user?.email || "email@example.com"}
            </Typography>

            <Divider sx={{ width: "100%", my: 2 }} />

            <Tabs
              orientation="vertical"
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              sx={{
                width: "100%",
                ".MuiTabs-indicator": {
                  left: 0,
                  width: 4,
                  borderRadius: "0 4px 4px 0",
                  bgcolor: "#4d7cfe",
                },
              }}
            >
              <Tab
                icon={<AccountCircleIcon />}
                iconPosition="start"
                label="Profile"
                sx={{
                  minHeight: 48,
                  textAlign: "left",
                  justifyContent: "flex-start",
                  pl: 2,
                  fontSize: 15,
                  textTransform: "none",
                  fontWeight: "500",
                  color: currentTab === 0 ? "#4d7cfe" : "#64748b",
                  "&.Mui-selected": {
                    color: "#4d7cfe",
                    bgcolor: "rgba(77, 124, 254, 0.08)",
                  },
                }}
              />
              <Tab
                icon={<SecurityIcon />}
                iconPosition="start"
                label="Security"
                sx={{
                  minHeight: 48,
                  textAlign: "left",
                  justifyContent: "flex-start",
                  pl: 2,
                  fontSize: 15,
                  textTransform: "none",
                  fontWeight: "500",
                  color: currentTab === 1 ? "#4d7cfe" : "#64748b",
                  "&.Mui-selected": {
                    color: "#4d7cfe",
                    bgcolor: "rgba(77, 124, 254, 0.08)",
                  },
                }}
              />
            </Tabs>
          </Box>
        </Card>

        {/* Main content */}
        <Box sx={{ flex: 1 }}>
          {currentTab === 0 && (
            <Card
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid #eef2f6",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 4,
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight="700" color="#2d3748">
                    Profile Settings
                  </Typography>
                  <Typography variant="body2" color="#718096">
                    Update your personal information
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      color="#2d3748"
                    >
                      Username
                    </Typography>
                    <Typography variant="body2" color="#718096" sx={{ mb: 1 }}>
                      This will be displayed on your profile
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#4d7cfe" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                        "&:hover fieldset": { borderColor: "#4d7cfe" },
                        "&.Mui-focused fieldset": { borderColor: "#4d7cfe" },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      color="#2d3748"
                    >
                      Email Address
                    </Typography>
                    <Typography variant="body2" color="#718096" sx={{ mb: 1 }}>
                      We'll never share your email with anyone else
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#4d7cfe" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                        "&:hover fieldset": { borderColor: "#4d7cfe" },
                        "&.Mui-focused fieldset": { borderColor: "#4d7cfe" },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleUpdate}
                  sx={{
                    px: 4,
                    py: 1.2,
                    borderRadius: 2,
                    bgcolor: "#4d7cfe",
                    "&:hover": { bgcolor: "#3a6bec" },
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(77, 124, 254, 0.2)",
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Card>
          )}

          {currentTab === 1 && (
            <Card
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid #eef2f6",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 4,
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight="700" color="#2d3748">
                    Security Settings
                  </Typography>
                  <Typography variant="body2" color="#718096">
                    Manage your password and account
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      color="#2d3748"
                    >
                      New Password
                    </Typography>
                    <Typography variant="body2" color="#718096" sx={{ mb: 1 }}>
                      Leave blank to keep your current password
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#4d7cfe" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                        "&:hover fieldset": { borderColor: "#4d7cfe" },
                        "&.Mui-focused fieldset": { borderColor: "#4d7cfe" },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      color="#2d3748"
                    >
                      Confirm New Password
                    </Typography>
                    <Typography variant="body2" color="#718096" sx={{ mb: 1 }}>
                      Re-enter your new password
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#4d7cfe" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                        "&:hover fieldset": { borderColor: "#4d7cfe" },
                        "&.Mui-focused fieldset": { borderColor: "#4d7cfe" },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 5 }}>
                <Alert
                  severity="error"
                  icon={<ErrorOutlineIcon />}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "rgba(244, 67, 54, 0.08)",
                    mb: 3,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="600">
                    Danger Zone
                  </Typography>
                  <Typography variant="body2">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </Typography>
                </Alert>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setOpenDeleteDialog(true)}
                  sx={{
                    borderColor: "#f44336",
                    color: "#f44336",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.2,
                    "&:hover": {
                      borderColor: "#d32f2f",
                      backgroundColor: "rgba(244, 67, 54, 0.08)",
                    },
                  }}
                >
                  Delete Account
                </Button>
              </Box>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleUpdate}
                  sx={{
                    px: 4,
                    py: 1.2,
                    borderRadius: 2,
                    bgcolor: "#4d7cfe",
                    "&:hover": { bgcolor: "#3a6bec" },
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(77, 124, 254, 0.2)",
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Card>
          )}
        </Box>
      </Box>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 480,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
          <Typography variant="h6" fontWeight="600" color="#2d3748">
            Delete Account
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="body1" color="#4a5568">
            Are you sure you want to delete your account? All of your data will
            be permanently removed. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              color: "#64748b",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            sx={{
              bgcolor: "#f44336",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              "&:hover": { bgcolor: "#d32f2f" },
            }}
          >
            Yes, Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}