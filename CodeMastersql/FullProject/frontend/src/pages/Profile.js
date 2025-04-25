
import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import {
  Container,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Card,
  CardContent,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Chip,
  Badge,
  AvatarGroup,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import { toast } from "react-toastify";
import Leftsidebar from "../components/homepage/Leftsidebar";
import StatusUpload from "../components/StatusUpload";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import AddPostForm from "../pages/AddPost";

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [followRequests, setFollowRequests] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:9090";
  const [statuses, setStatuses] = useState([]);
  const [followCounts, setFollowCounts] = useState({
    followers: 0,
    following: 0,
  });
  const [showAddPostModal, setShowAddPostModal] = useState(false);

  const fetchFollowCounts = () => {
    axios.get("/follow/counts").then((res) => setFollowCounts(res.data));
  };

  const fetchPosts = () => {
    axios.get("/posts/my").then((res) => setPosts(res.data));
  };

  const fetchFollowRequests = () => {
    axios.get("/follow/requests").then((res) => setFollowRequests(res.data));
  };

  useEffect(() => {
    fetchPosts();
    fetchFollowRequests();
    fetchFollowCounts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/posts/${id}`);
      toast.success("Post deleted");
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete post");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleAcceptFollow = (followId) => {
    axios.post(`/follow/accept/${followId}`).then(() => {
      toast.success("Follow request accepted");
      setFollowRequests((prev) => prev.filter((req) => req.id !== followId));
    });
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = () => {
    axios.get("/status").then((res) => setStatuses(res.data));
  };

  const handleDeleteStatus = (id) => {
    axios.delete(`/status/${id}`).then(() => loadStatuses());
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <Leftsidebar />
      <Container maxWidth="lg" sx={{ mt: 5, pb: 8 }}>
        {/* Profile Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            backgroundColor: "white",
            border: "1px solid #eef2f6",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100px",
              backgroundImage: "linear-gradient(45deg, #4d7cfe30, #3a6bec20)",
              zIndex: 0,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box display="flex" alignItems="center" mb={4}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "#4d7cfe",
                      color: "white",
                      width: 28,
                      height: 28,
                      "&:hover": { bgcolor: "#3a6bec" },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#4d7cfe",
                    border: "4px solid white",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  }}
                >
                  <AccountCircleIcon sx={{ fontSize: 50 }} />
                </Avatar>
              </Badge>
              <Box ml={3}>
                <Typography variant="h5" fontWeight="700" color="#2d3748">
                  Your Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage your profile information
                </Typography>
              </Box>
              <Box flexGrow={1} />
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<BookmarkIcon />}
                  onClick={() => navigate("/my-learning-plans")}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    borderColor: "#4d7cfe",
                    color: "#4d7cfe",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "#3a6bec",
                      backgroundColor: "rgba(77, 124, 254, 0.04)",
                    },
                  }}
                >
                  My Learning
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setShowAddPostModal(true)}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    fontWeight: 600,
                    backgroundColor: "#4d7cfe",
                    "&:hover": { backgroundColor: "#3a6bec" },
                    boxShadow: "0 4px 12px rgba(77, 124, 254, 0.2)",
                  }}
                >
                  Add Post
                </Button>
              </Box>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <StatusUpload onUpload={loadStatuses} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    backgroundColor: "#fafbff",
                    borderRadius: 3,
                    p: 3,
                    border: "1px solid #eef2f6",
                  }}
                >
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box>
                      <Typography variant="h4" fontWeight="700" color="#4d7cfe">
                        {followCounts.followers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Followers
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography variant="h4" fontWeight="700" color="#4d7cfe">
                        {followCounts.following}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Following
                      </Typography>
                    </Box>
                  </Box>

                  {/* Placeholder for followers avatars */}
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Recent followers
                    </Typography>
                    <AvatarGroup max={5} sx={{ justifyContent: "flex-start" }}>
                      {[...Array(5)].map((_, i) => (
                        <Avatar
                          key={i}
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: `hsl(${i * 50}, 70%, 65%)`,
                          }}
                        >
                          {String.fromCharCode(65 + i)}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Follow Requests Section */}
        {followRequests.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 4,
              backgroundColor: "white",
              border: "1px solid #eef2f6",
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <PersonAddIcon
                color="primary"
                sx={{ mr: 1.5, color: "#4d7cfe" }}
              />
              <Typography variant="h6" fontWeight="600" color="#2d3748">
                Follow Requests
              </Typography>
              <Box flexGrow={1} />
              <Chip
                label={followRequests.length}
                size="small"
                sx={{
                  backgroundColor: "#4d7cfe20",
                  color: "#4d7cfe",
                  fontWeight: 600,
                  borderRadius: 6,
                }}
              />
            </Box>
            <List sx={{ py: 0 }}>
              {followRequests.map((req) => (
                <ListItem
                  key={req.id}
                  sx={{
                    mb: 2,
                    backgroundColor: "#f8faff",
                    borderRadius: 3,
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f0f4ff",
                      transform: "translateX(5px)",
                    },
                    py: 1.5,
                  }}
                  secondaryAction={
                    <Box display="flex" gap={1}>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          color: "#64748b",
                          fontWeight: 600,
                          "&:hover": { backgroundColor: "#64748b10" },
                        }}
                      >
                        Ignore
                      </Button>
                      <Button
                        onClick={() => handleAcceptFollow(req.id)}
                        variant="contained"
                        size="small"
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          px: 3,
                          fontWeight: 600,
                          backgroundColor: "#4d7cfe",
                          "&:hover": { backgroundColor: "#3a6bec" },
                        }}
                      >
                        Accept
                      </Button>
                    </Box>
                  }
                >
                  <Avatar
                    sx={{
                      mr: 2,
                      bgcolor: "#4d7cfe",
                      width: 42,
                      height: 42,
                      border: "2px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    {req.follower.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography fontWeight="600" color="#2d3748">
                        {req.follower.username}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {req.follower.email}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* My Posts Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3.5}
          mt={5}
        >
          <Typography variant="h5" fontWeight="700" color="#2d3748">
            My Posts
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} lg={4} key={post.id}>
              <Card
                sx={{
                  bgcolor: "white",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.03)",
                  border: "1px solid #eef2f6",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0px 12px 24px rgba(0,0,0,0.06)",
                  },
                }}
              >
                {post.mediaPaths?.length > 0 && (
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16/9",
                      maxHeight: 220,
                      overflow: "hidden",
                    }}
                  >
                    <Swiper slidesPerView={1} style={{ borderRadius: "0" }}>
                      {post.mediaPaths.map((path, idx) => (
                        <SwiperSlide key={idx}>
                          <Box
                            sx={{
                              width: "100%",
                              height: "220px",
                              overflow: "hidden",
                              maxWidth: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f5f7fa",
                            }}
                          >
                            {path.toLowerCase().endsWith(".mp4") ? (
                              <video
                                src={`${BASE_URL}${path}`}
                                controls
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  backgroundColor: "#000",
                                }}
                              />
                            ) : (
                              <img
                                src={`${BASE_URL}${path}`}
                                alt={`media-${idx}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </Box>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "100%",
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 30%)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        display: "flex",
                        gap: 1,
                        zIndex: 10,
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(4px)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                        }}
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                      >
                        <EditIcon fontSize="small" sx={{ color: "#4d7cfe" }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(4px)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                        }}
                        onClick={() => setConfirmDeleteId(post.id)}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: "#ff5252" }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: "#4d7cfe",
                        width: 40,
                        height: 40,
                        border: "2px solid white",
                        boxShadow: "0 2px 8px rgba(77, 124, 254, 0.2)",
                      }}
                    >
                      {post.user?.username?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                    <Typography variant="subtitle2" color="text.secondary">
                      {post.user?.username || "You"}
                    </Typography>
                    <Box flexGrow={1} />
                    <IconButton size="small" sx={{ color: "#64748b" }}>
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    mb={1.5}
                    color="#2d3748"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                    }}
                  >
                    {post.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!confirmDeleteId}
          onClose={() => setConfirmDeleteId(null)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 1,
              maxWidth: "400px",
              width: "100%",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pt: 3, pb: 2 }}>
            Are you sure you want to delete this post?
          </DialogTitle>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setConfirmDeleteId(null)}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(confirmDeleteId)}
              color="error"
              variant="contained"
              sx={{
                borderRadius: 3,
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 600,
                bgcolor: "#ff5252",
                "&:hover": { bgcolor: "#e03c3c" },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Modal
          open={showAddPostModal}
          onClose={() => setShowAddPostModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={showAddPostModal}>
            <Box
              sx={{
                width: "90%",
                maxWidth: 600,
                margin: "10vh auto",
                outline: "none",
              }}
            >
              <AddPostForm
                onClose={() => setShowAddPostModal(false)}
                onPostCreated={fetchPosts}
              />
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
}
