import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Leftsidebar from "../components/homepage/Leftsidebar";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    description: "",
    mediaPaths: [],
  });
  const [files, setFiles] = useState([]);
  const BASE_URL = "http://localhost:9090";

  useEffect(() => {
    let isMounted = true;

    axios
      .get(`/posts/${id}`)
      .then((res) => {
        if (isMounted) setPost(res.data);
      })
      .catch(() => {
        toast.error("Failed to load post");
        navigate("/profile");
      });

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!post.title ||
