
import { useState } from "react";
import {
  Typography, TextField, Button, Box, Paper,
  IconButton, Stack, LinearProgress, CircularProgress, Collapse, Alert
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TranslateIcon from '@mui/icons-material/Translate';
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Editor from "@monaco-editor/react";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import axios from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function AddPost({ onClose, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [targetLang, setTargetLang] = useState("python");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || files.length === 0) {
      toast.error("All fields and at least one image are required.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post created!");
      onPostCreated?.(); // Refresh posts if provided
      onClose(); // Close modal
    } catch (err) {
      toast.error(err.response?.data?.message || "Post upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAiSuggestion = async () => {
    if (!description) {
      toast.info("Please enter some code/description for the AI to analyze.");
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await axios.post("/ai/suggest", { code: description });
      setAiSuggestion(res.data.suggestion);
    } catch (err) {
      toast.error("Failed to fetch AI suggestions.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const translateCode = async () => {
    if (!description) return;
    setIsTranslating(true);
    try {
      const res = await axios.post("/ai/translate", { code: description, targetLanguage: targetLang });
      setDescription(res.data.translation);
      setLanguage(targetLang);
      toast.success(`Translated to ${targetLang}!`);
    } catch (err) {
      toast.error("Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  const refactorCode = async () => {
    if (!description) return;
    setIsRefactoring(true);
    try {
      const res = await axios.post("/ai/refactor", { code: description });
      setDescription(res.data.refactored);
      toast.success("Code optimized by AI!");
    } catch (err) {
      toast.error("Refactoring failed.");
    } finally {
      setIsRefactoring(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="#2196f3" gutterBottom>
        Create New Post
      </Typography>

      <TextField fullWidth label="Title" margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Language</InputLabel>
        <Select value={language} label="Language" onChange={(e) => setLanguage(e.target.value)}>
          <MenuItem value="javascript">JavaScript</MenuItem>
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="java">Java</MenuItem>
          <MenuItem value="cpp">C++</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Code Editor
      </Typography>
      <Box sx={{ border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden', mt: 0.5, mb: 2 }}>
        <Editor
          height="300px"
          language={language}
          theme="vs-dark"
          value={description}
          onChange={(val) => setDescription(val)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </Box>

      <Box sx={{ mt: 1, mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button 
          startIcon={isAiLoading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
          onClick={getAiSuggestion}
          disabled={isAiLoading}
          variant="outlined"
          color="secondary"
          size="small"
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          {isAiLoading ? "Analyzing..." : "AI Suggestions"}
        </Button>

        <Button 
          startIcon={isRefactoring ? <CircularProgress size={16} /> : <AutoFixHighIcon />}
          onClick={refactorCode}
          disabled={isRefactoring}
          variant="outlined"
          color="primary"
          size="small"
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          {isRefactoring ? "Refactoring..." : "Magic Refactor"}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button 
            startIcon={isTranslating ? <CircularProgress size={16} /> : <TranslateIcon />}
            onClick={translateCode}
            disabled={isTranslating}
            variant="outlined"
            size="small"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Translate to
          </Button>
          <Select 
            size="small" 
            value={targetLang} 
            onChange={(e) => setTargetLang(e.target.value)}
            sx={{ height: 31, borderRadius: 2 }}
          >
            <MenuItem value="javascript">JS</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
          </Select>
        </Box>

        <Collapse in={!!aiSuggestion} sx={{ mt: 2, width: '100%' }}>
          <Alert severity="info" onClose={() => setAiSuggestion("")} sx={{ borderRadius: 2, whiteSpace: 'pre-line' }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>CodeMaster AI Suggestion:</Typography>
            {aiSuggestion}
          </Alert>
        </Collapse>
      </Box>

      <Box mt={2} mb={2}>
        <Button component="label" variant="contained" startIcon={<PhotoCamera />} sx={{ textTransform: 'none' }}>
          Select Images
          <input type="file" hidden multiple accept="image/*,video/*" onChange={handleFileChange} />
        </Button>
      </Box>

      <Stack direction="row" spacing={2} flexWrap="wrap" mt={2}>
        {files.map((file, i) => (
          <Box key={i} sx={{ position: "relative", width: 80, height: 80 }}>
            {file.type.startsWith("video/") ? (
              <video src={URL.createObjectURL(file)} style={{ width: "100%", height: "100%", objectFit: "cover" }} controls />
            ) : (
              <img src={URL.createObjectURL(file)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
            <IconButton size="small" onClick={() => handleRemoveFile(i)} sx={{ position: "absolute", top: 0, right: 0, backgroundColor: "#fff" }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>

      {isSubmitting && <LinearProgress sx={{ mt: 2 }} />}
      <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Uploading..." : "Create Post"}
      </Button>
    </Paper>
  );
}