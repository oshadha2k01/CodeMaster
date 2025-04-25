
import { useEffect, useRef, useState } from 'react';
import {
  Modal, Box, Typography, Avatar, IconButton,
  LinearProgress, TextField, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import axios from "../../api/axiosConfig";

export default function StatusViewer({
  status,
  onClose,
  duration = 5000,
  refreshStatuses,
  isEditing = false,
}) {
  const timeoutRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newFile, setNewFile] = useState(null);
  const currentUserEmail = localStorage.getItem("email");

  // ⚠️ Fix: Update editMode when props/status changes
  useEffect(() => {
    if (status) {
      setNewCaption(status.caption || "");
      setEditMode(isEditing); // ✅ THIS ensures edit mode actually shows
      if (!isEditing) {
        timeoutRef.current = setTimeout(onClose, duration);
      }
    }
    return () => clearTimeout(timeoutRef.current);
  }, [status, isEditing]);

  if (!status) return null;

  const isVideo = status.imagePath.toLowerCase().endsWith('.mp4');

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append("caption", newCaption);
    if (newFile) formData.append("file", newFile);
    await axios.put(`/status/edit/${status.id}`, formData);
    refreshStatuses();
    setEditMode(false);
    onClose();
  };

  return (
    <Modal open={!!status} onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'rgba(0,0,0,0.9)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 500,
            bgcolor: '#000',
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={`http://localhost:9090${status.imagePath}`} sx={{ mr: 1 }} />
              <Typography fontWeight="bold">{status.user.username}</Typography>
              <Typography variant="caption" color="gray" sx={{ ml: 1 }}>
                • {Math.floor((Date.now() - new Date(status.createdAt)) / 3600000)}h ago
              </Typography>
            </Box>

            {/* Show edit icon if it's your own status and not editing */}
            {status.user.email === currentUserEmail && !editMode && (
              <IconButton onClick={() => setEditMode(true)} sx={{ color: 'white' }}>
                <EditIcon />
              </IconButton>
            )}

            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Media */}
          {isVideo ? (
            <video
              src={`http://localhost:9090${status.imagePath}`}
              controls
              autoPlay
              muted
              style={{ width: '100%', maxHeight: 'calc(100vh - 150px)' }}
            />
          ) : (
            <Box
              component="img"
              src={`http://localhost:9090${status.imagePath}`}
              alt="status"
              sx={{
                width: '100%',
                maxHeight: 'calc(100vh - 150px)',
                objectFit: 'contain',
              }}
            />
          )}

          {/* Edit Inputs */}
          <Box sx={{ p: 2 }}>
            {editMode ? (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  sx={{ mb: 1 }}
                  inputProps={{ style: { color: 'white' } }}
                />
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setNewFile(e.target.files[0])}
                  style={{ color: "white", marginBottom: 10 }}
                />
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleEditSubmit}
                >
                  Save
                </Button>
              </>
            ) : (
              <Typography variant="body1" sx={{ color: 'white' }}>
                {status.caption}
              </Typography>
            )}
          </Box>

          {/* Progress Bar */}
          {!editMode && (
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: 4,
                animation: `grow ${duration}ms linear`,
                '@keyframes grow': {
                  from: { width: 0 },
                  to: { width: '100%' },
                },
              }}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
}
