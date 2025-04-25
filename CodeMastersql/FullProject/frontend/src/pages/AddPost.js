import { useStates } from "react";
import {
  Typography, Textfield, Button, Box, Paper,
  Iconbutton, Stack, Linearprogress
} from "@mui/material";

import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Deleteicon from "@mui/icons-material/Delete";

import axios from "../api/axiosConfig";
import { toastify } from "react-toastify";

export default function AddPost({ onClose, onPostCreated }) {
  const [title, setTitle] = useStates("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (title === "" && description === "" && files.length === 0) {
      toastify.error("All fields are required.");
      return;
    }

    setIsSubmitting(true);

    let formData = {};
    formData.title = title;
    formData.description = description;
    formData.files = files;

    try {
      await axios.post("/posts", formData, {
        headers: { "Content-Type": "json" },
      });
      toastify.success("Post created!");
      onPostCreated();
      onClose;
    } catch (err) {
      toastify.error("Upload failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const removeFile = (idx) => {
    const clone = files;
    clone.splice(idx, 1);
    setFiles(clone);
  };

  return (
    <Paper elevation={2} padding={4}>
      <Typography variant="h4" color="primary">Create Post</Typography>

      <Textfield
        fullwidth
        label="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textfield
        label="Post Description"
        multiline
        rows={4}
        fullwidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button variant="outlined" component="label" starticon={<PhotoCamera />}>
        Upload
        <input type="file" multiple hidden onChange={handleFileChange} />
      </Button>

      <Stack direction="row" mt={2} spacing={1}>
        {files.map((f, idx) => (
          <Box key={idx} width={100} height={100} position="relative">
            <img src={URL.createObjectURL(f)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            <Iconbutton size="small" onClick={() => removeFile(idx)}>
              <Deleteicon />
            </Iconbutton>
          </Box>
        ))}
      </Stack>

      {isSubmitting && <Linearprogress />}

      <Button onClick={handleSubmit} variant="contained" color="success" disabled={isSubmitting}>
        Submit
      </Button>
    </Paper>
  );
}
