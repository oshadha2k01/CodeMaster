import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
  Home,
  Search,
  Explore,
  MovieCreation,
  Chat,
  AddBox,
  Person,
  Notifications,
} from "@mui/icons-material";
import "swiper/css";

import Leftsidebar from "../components/homepage/Leftsidebar";
import StatusViewer from "../components/homepage/StatusViewer";
import RightSidebar from "../components/homepage/Rightsidebar";
import RenderStatusBar from "../components/homepage/RenderStatusBar";

export default function InstagramHomeFeed() {
  const [comments, setComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [likeStatus, setLikeStatus] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const [activeTab, setActiveTab] = useState("following");
  const BASE_URL = "http://localhost:9090";
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState([]);
  const [openStatus, setOpenStatus] = useState(null);
  const handleOpenStatus = (status) => setOpenStatus(status);
  const handleCloseStatus = () => setOpenStatus(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [showAllComments, setShowAllComments] = useState({});

  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const loadPosts = () => {
    const endpoint =
      activeTab === "all"
        ? "/posts/all"
        : activeTab === "my"
        ? "/posts/my"
        : "/posts/following";

    axios.get(endpoint).then((res) => {
      setPosts(res.data);
      res.data.forEach((post) => {
        axios.get(`/comments/${post.id}`).then((res) => {
          setComments((prev) => ({ ...prev, [post.id]: res.data }));
        });
        axios.get(`/posts/${post.id}/like-status`).then((res) => {
          setLikeStatus((prev) => ({ ...prev, [post.id]: res.data }));
        });
      });
    });

    axios.get("/users/all").then((res) => {
      setAllUsers(res.data);
      res.data.forEach((u) => {
        if (u.email !== user?.email) {
          axios.get(`/follow/status/${u.id}`).then((statusRes) => {
            setFollowStatus((prev) => ({
              ...prev,
              [u.id]: statusRes.data.status,
            }));
          });
        }
      });
    });
  };

  const handleCommentSubmit = (postId) => {
    const content = newCommentText[postId];
    if (!content) return;

    axios.post(`/comments/${postId}`, { content }).then((res) => {
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data],
      }));
      setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
    });
  };

  const handleDelete = (commentId, postId) => {
    axios.delete(`/comments/${commentId}`).then(() => {
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));
    });
  };

  const handleEdit = (comment) => {
    setEditCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = (commentId, postId) => {
    axios
      .put(`/comments/${commentId}`, { content: editContent })
      .then((res) => {
        setComments((prev) => ({
          ...prev,
          [postId]: prev[postId].map((c) =>
            c.id === commentId ? res.data : c
          ),
        }));
        setEditCommentId(null);
        setEditContent("");
      });
  };

  const toggleLike = (postId) => {
    axios.post(`/posts/${postId}/like`).then(() => {
      axios.get(`/posts/${postId}/like-status`).then((res) => {
        setLikeStatus((prev) => ({ ...prev, [postId]: res.data }));
      });
    });
  };

  const handleFollowRequest = (userId) => {
    axios.post(`/follow/${userId}`).then(() => {
      setFollowStatus((prev) => ({ ...prev, [userId]: "PENDING" }));
    });
  };

  const handleUnfollow = (userId) => {
    axios.delete(`/follow/${userId}`).then(() => {
      setFollowStatus((prev) => ({ ...prev, [userId]: "NONE" }));
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
      }}
    >
      <StatusViewer
        status={editingStatus || openStatus}
        onClose={() => {
          setOpenStatus(null);
          setEditingStatus(null);
        }}
        duration={5000}
        refreshStatuses={loadStatuses}
        isEditing={!!editingStatus}
      />

      {/* Left Sidebar */}
      <Leftsidebar />
      {/* Main Content */}
      <Box
        sx={{ flex: 1, maxWidth: 950, mx: "auto", my: 2, p: 2, width: "100%" }}
      >
        {/* Feed Tabs */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solidrgb(161, 161, 161)",
            py: 1,
          }}
        >
          {["following", "all", "my"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                textTransform: "none",
                color: activeTab === tab ? "black" : "#8e8e8e",
                borderBottom: activeTab === tab ? "2px solid black" : "none",
                borderRadius: 0,
                px: 3,
                py: 1.5,
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
              }}
            >
              {tab === "following"
                ? "Following"
                : tab === "all"
                ? "Explore"
                : "My Posts"}
            </Button>
          ))}
        </Box>

        <RenderStatusBar
          statuses={statuses}
          user={user}
          handleOpenStatus={setOpenStatus}
          handleDeleteStatus={handleDeleteStatus}
          handleEditStatus={setEditingStatus}
        />

        {/* Posts Feed */}
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          {posts.map((post) => (
            <Card
              key={post.id}
              sx={{
                mb: 4,
                boxShadow: "none",
                border: "1px solid #dbdbdb",
                borderRadius: 2,
              }}
            >
              {/* Post Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderBottom: "1px solid #efefef",
                }}
              >
                {/* <Avatar sx={{ mr: 1 }}>
                  {post.user.username?.charAt(0).toUpperCase()}
                </Avatar> */}
                <Avatar
                  sx={{ mr: 1 }}
                  src={
                    post.user.profileImage
                      ? `http://localhost:9090${post.user.profileImage}`
                      : undefined
                  }
                  alt={post.user.username}
                >
                  {!post.user.profileImage &&
                    post.user.username?.charAt(0).toUpperCase()}
                </Avatar>

                <Typography variant="subtitle2" fontWeight="bold">
                  {post.user.username}
                </Typography>
              </Box>

              {/* Media */}
              {post.mediaPaths?.length > 0 && (
                <Swiper spaceBetween={0} slidesPerView={1}>
                  {post.mediaPaths.map((path, index) => (
                    <SwiperSlide key={index}>
                      {/* <img
                        src={`${BASE_URL}${path}`}
                        alt={`media-${index}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          maxHeight: 600,
                          objectFit: "cover",
                        }}
                      /> */}
                      {path.toLowerCase().endsWith(".mp4") ? (
                        <video
                          src={`${BASE_URL}${path}`}
                          controls
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: 600,
                            objectFit: "cover",
                            backgroundColor: "#000",
                          }}
                        />
                      ) : (
                        <img
                          src={`${BASE_URL}${path}`}
                          alt={`media-${index}`}
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: 600,
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {/* Action Buttons */}
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton onClick={() => toggleLike(post.id)} sx={{ p: 0 }}>
                    {likeStatus[post.id]?.liked ? (
                      <Favorite sx={{ color: "#ed4956" }} />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                </Box>

                {/* Like Count */}
                <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                  {likeStatus[post.id]?.likeCount || 0}{" "}
                  {likeStatus[post.id]?.likeCount === 1 ? "like" : "likes"}
                </Typography>

                {/* Caption */}
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" component="span">
                    <Typography
                      variant="body2"
                      component="span"
                      fontWeight="bold"
                      sx={{ mr: 1 }}
                    >
                      {post.user.username}
                    </Typography>
                    {post.description}
                  </Typography>
                </Box>

                {/* View all comments link if more than 2 */}
                {comments[post.id]?.length > 2 && !showAllComments[post.id] && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, cursor: "pointer" }}
                    onClick={() =>
                      setShowAllComments((prev) => ({
                        ...prev,
                        [post.id]: true,
                      }))
                    }
                  >
                    View all {comments[post.id]?.length} comments
                  </Typography>
                )}

                {/* Comments */}
                <List disablePadding sx={{ mt: 1 }}>
                  {(comments[post.id] || [])
                    .slice(
                      0,
                      showAllComments[post.id] ? comments[post.id].length : 2
                    )
                    .map((comment) => (
                      <ListItem
                        key={comment.id}
                        disablePadding
                        disableGutters
                        sx={{ mb: 0.5 }}
                      >
                        {editCommentId === comment.id ? (
                          <TextField
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onBlur={() => handleSaveEdit(comment.id, post.id)}
                            fullWidth
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              width: "100%",
                            }}
                          >
                            <Typography variant="body2" component="span">
                              <Typography
                                variant="body2"
                                component="span"
                                fontWeight="bold"
                                sx={{ mr: 1 }}
                              >
                                {comment.user.username}
                              </Typography>
                              {comment.content}
                            </Typography>

                            {(comment.user.email === user?.email ||
                              post.user.email === user?.email) && (
                              <Box ml={1} display="flex">
                                {comment.user.email === user?.email && (
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit(comment)}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                )}
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleDelete(comment.id, post.id)
                                  }
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        )}
                      </ListItem>
                    ))}
                </List>

                {/* Post Time */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>

                {/* Add Comment Input */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solidrgb(234, 231, 231)",
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Add a comment..."
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    value={newCommentText[post.id] || ""}
                    onChange={(e) =>
                      setNewCommentText((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCommentSubmit(post.id);
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleCommentSubmit(post.id)}
                    disabled={!newCommentText[post.id]}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      color: !newCommentText[post.id] ? "#b3dffc" : "#0095f6",
                    }}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Right Sidebar */}
      <RightSidebar
        user={user}
        allUsers={allUsers}
        followStatus={followStatus}
        handleFollowRequest={handleFollowRequest}
        handleUnfollow={handleUnfollow}
      />
    </Box>
  );
}
