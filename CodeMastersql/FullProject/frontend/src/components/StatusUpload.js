
import { useState } from 'react';
import axios from '../api/axiosConfig';
import { 
  Box, 
  Button, 
  TextField, 
  Slider, 
  Typography, 
  Paper, 
  IconButton,
  InputAdornment,
  Chip,
  Divider,
  Avatar
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function StatusUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [duration, setDuration] = useState(24);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(selectedFile);
      } else {
        // For videos, we could create a generic preview or use a video thumbnail
        setPreview(null);
      }
    }
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    formData.append("durationHours", duration);

    axios.post("/status/upload", formData).then(() => {
      setCaption('');
      setFile(null);
      setPreview(null);
      setDuration(24);
      onUpload();
    });
  };

  const handleClearFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 3, 
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid #eaeef5',
        bgcolor: 'white'
      }}
    >
      <Box p={3}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: '#333',
            mb: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box 
            component="span" 
            sx={{ 
              width: 4, 
              height: 24, 
              bgcolor: '#4d7cfe', 
              display: 'inline-block', 
              mr: 2,
              borderRadius: 1
            }}
          />
          Create New Status
        </Typography>

        <TextField
          fullWidth
          placeholder="What's on your mind?"
          variant="outlined"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          multiline
          rows={2}
          sx={{ 
            mt: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#f8f9fb',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d0d7de'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4d7cfe'
              }
            }
          }}
        />

        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mt={3}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<PhotoCamera />}
              sx={{
                textTransform: 'none',
                borderRadius: 8,
                px: 2.5,
                py: 1,
                borderColor: '#e0e7ff',
                color: '#4d7cfe',
                backgroundColor: '#f5f7ff',
                '&:hover': {
                  backgroundColor: '#e8ecff',
                  borderColor: '#4d7cfe'
                }
              }}
            >
              Add Media
              <input
                type="file"
                accept="image/*,video/mp4"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            {file && (
              <Chip
                label={file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}
                onDelete={handleClearFile}
                deleteIcon={<HighlightOffIcon />}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: '#e0e7ff',
                  color: '#4d7cfe',
                  '& .MuiChip-deleteIcon': {
                    color: '#4d7cfe'
                  }
                }}
              />
            )}
          </Box>

          <Box 
            display="flex" 
            alignItems="center" 
            gap={1}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Box 
              display="flex" 
              alignItems="center" 
              gap={1}
              bgcolor="#f5f7ff"
              p={1}
              borderRadius={2}
              sx={{ 
                flexGrow: 1,
                width: { xs: '100%', sm: 'auto' },
                maxWidth: { xs: '100%', sm: 230 }
              }}
            >
              <AccessTimeIcon fontSize="small" sx={{ color: '#4d7cfe' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#4d7cfe',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  minWidth: 80
                }}
              >
                {duration} hours
              </Typography>
              <Slider
                value={duration}
                min={1}
                max={48}
                onChange={(e, val) => setDuration(val)}
                sx={{ 
                  width: '100%',
                  color: '#4d7cfe',
                  '& .MuiSlider-thumb': {
                    width: 14,
                    height: 14,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(77, 124, 254, 0.16)'
                    }
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#ccd6ff'
                  }
                }}
              />
            </Box>

            <Button 
              onClick={handleUpload} 
              variant="contained" 
              endIcon={<SendIcon />}
              disabled={!caption && !file}
              sx={{ 
                textTransform: 'none',
                borderRadius: 8,
                px: 3,
                py: 1,
                backgroundColor: '#4d7cfe',
                '&:hover': {
                  backgroundColor: '#3a6bec'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#e0e7ff',
                  color: '#a0aec0'
                }
              }}
            >
              Share
            </Button>
          </Box>
        </Box>
      </Box>

      {preview && (
        <Box position="relative">
          <Box 
            sx={{ 
              maxHeight: 300,
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f4f8',
              borderTop: '1px solid #eaeef5'
            }}
          >
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: 300,
                objectFit: 'contain' 
              }} 
            />
          </Box>
          <IconButton
            onClick={handleClearFile}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)'
              }
            }}
          >
            <HighlightOffIcon sx={{ color: '#ff5252' }} />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
}