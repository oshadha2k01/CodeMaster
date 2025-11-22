
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Badge,
  Tooltip,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, Paper, List, ListItem, ListItemText, ListItemAvatar } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ColorModeContext } from "../App";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import axios from "../api/axiosConfig";
import { useTheme } from "@mui/material/styles";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notiAnchorEl, setNotiAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    let interval;
    if (user) {
      const fetchNotifications = () => {
        axios
          .get("/notifications")
          .then((res) => setNotifications(res.data))
          .catch(() => setNotifications([]));
      };
      fetchNotifications();
      interval = setInterval(fetchNotifications, 10000);
    }
    return () => clearInterval(interval);
  }, [user]);

  const handleOpenNotifications = (e) => {
    setNotiAnchorEl(e.currentTarget);
    axios.put("/notifications/mark-read").then(() => {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    });
  };

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setSearchAnchorEl(e.currentTarget);

    if (q.length > 1) {
      axios.get(`/search?q=${q}`).then(res => {
        setSearchResults(res.data);
      });
    } else {
      setSearchResults(null);
    }
  };

  return (
    <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: "1px solid #e0e0e0", bgcolor: "white" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        
        {/* Logo / Brand */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            letterSpacing: 0.5,
            color: "#2196f3",
            cursor: user ? "pointer" : "default",
            opacity: user ? 1 : 0.5,
          }}
          onClick={() => user && navigate("/home")}
        >
          {/* SkillShare */}
          CodeMaster
        </Typography>

        {/* Search Bar */}
        {user && (
          <Box sx={{ flex: 1, mx: 4, maxWidth: 400, position: 'relative' }}>
            <Paper
              elevation={0}
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                bgcolor: '#f1f3f4',
                borderRadius: 2
              }}
            >
              <IconButton sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search snippets, plans..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </Paper>

            {searchResults && (
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 1,
                  zIndex: 1300,
                  maxHeight: 400,
                  overflowY: 'auto',
                  borderRadius: 2
                }}
              >
                <List>
                  {searchResults.posts.length > 0 && (
                    <>
                      <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary' }}>POSTS</Typography>
                      {searchResults.posts.map(post => (
                        <ListItem button key={post.id} onClick={() => { navigate('/home'); setSearchResults(null); setSearchQuery(""); }}>
                          <ListItemText primary={post.title} secondary={`by ${post.user.username}`} />
                        </ListItem>
                      ))}
                    </>
                  )}
                  {searchResults.plans.length > 0 && (
                    <>
                      <Divider />
                      <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary' }}>LEARNING PLANS</Typography>
                      {searchResults.plans.map(plan => (
                        <ListItem button key={plan.id} onClick={() => { navigate('/learning-plans'); setSearchResults(null); setSearchQuery(""); }}>
                          <ListItemText primary={plan.title} />
                        </ListItem>
                      ))}
                    </>
                  )}
                  {searchResults.posts.length === 0 && searchResults.plans.length === 0 && (
                    <MenuItem disabled>No results found</MenuItem>
                  )}
                </List>
              </Paper>
            )}
          </Box>
        )}

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Learning Plans Link */}
            <Button
              onClick={() => navigate("")}
              sx={{
                color: "#333",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { color: "#2196f3" }
              }}
            >
              {/* Learning */}
            </Button>

            {/* Theme Toggle */}
            <Tooltip title={theme.palette.mode === 'dark' ? "Light Mode" : "Dark Mode"}>
              <IconButton onClick={colorMode.toggleColorMode} sx={{ color: "#555" }}>
                {theme.palette.mode === 'dark' ? <LightModeIcon sx={{ color: '#fbbf24' }} /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton onClick={handleOpenNotifications} sx={{ color: "#555" }}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notiAnchorEl}
              open={Boolean(notiAnchorEl)}
              onClose={() => setNotiAnchorEl(null)}
              PaperProps={{
                sx: {
                  width: 320,
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box px={2} py={1.5}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Notifications
                </Typography>
              </Box>
              <Divider />
              {notifications.length === 0 ? (
                <MenuItem disabled>No new notifications</MenuItem>
              ) : (
                notifications.map((n, i) => (
                  <MenuItem
                    key={i}
                    sx={{
                      whiteSpace: "normal",
                      fontWeight: n.read ? 400 : 600,
                      color: n.read ? "text.secondary" : "text.primary",
                    }}
                  >
                    {n.message}
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* User Avatar */}
            <Tooltip title="Account">
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  sx={{ width: 44, height: 44 }}
                  src={user.profileImage ? `http://localhost:9090${user.profileImage}` : undefined}
                  alt={user.username}
                >
                  {!user.profileImage && user.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/settings");
                }}
              >
                Settings
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  logout();
                  navigate("/signin");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button variant="outlined" onClick={() => navigate("/signin")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
