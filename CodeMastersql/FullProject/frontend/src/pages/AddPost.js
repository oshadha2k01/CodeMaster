import { useState } from "react";
import {
  Typography, TextField, Button, Box, Paper,
  IconButton, Stack, LinearProgress
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function AddPost({ onClose, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || files.length === 0) {
      toast.error("All fields and at least one image are required.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post created!");
      onPostCreated?.(); // Optional chaining for callback
      onClose?.();       // Optional chaining for modal close
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Post upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.type.startsWith("image/") || file.type.startsWith("video/"));
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="#2196f3" gutterBottom>
        Create New Post
      </Typography>

      <TextField
        fullWidth
        label="Title"
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        fullWidth
        label="Description"
        multiline
