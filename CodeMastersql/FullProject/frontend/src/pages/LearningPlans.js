
import { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Avatar,
  Divider,
  Chip,
  LinearProgress,
  Paper,
  Tooltip
} from '@mui/material';
import Leftsidebar from "../components/homepage/Leftsidebar";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, CircularProgress, Alert, List as MuiList, ListItem as MuiListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { toast } from 'react-toastify';

export default function LearningPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAiModal, setOpenAiModal] = useState(false);
  const [aiGoal, setAiGoal] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get('/learning-plans/all');
        setPlans(res.data);
      } catch (error) {
        console.error("Failed to fetch learning plans:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  const handleGenerateAiPlan = async () => {
    if (!aiGoal.trim()) return;
    setIsAiGenerating(true);
    setGeneratedPlan(null);
    try {
      const res = await axios.post('/ai/generate-plan', { goal: aiGoal });
      setGeneratedPlan(res.data);
    } catch (error) {
      toast.error("AI Generation failed. Please check your API key.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSaveAiPlan = async () => {
    try {
      await axios.post('/learning-plans', {
        title: generatedPlan.title,
        topics: generatedPlan.topics,
        resources: generatedPlan.resources,
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
        progress: 'Not Started'
      });
      toast.success("Learning Journey saved!");
      setOpenAiModal(false);
      setAiGoal("");
      setGeneratedPlan(null);
      // Refresh plans
      const res = await axios.get('/learning-plans/all');
      setPlans(res.data);
    } catch (error) {
      toast.error("Failed to save learning plan.");
    }
  };

  // Helper function to get progress percentage
  const getProgressPercentage = (status) => {
    switch(status) {
      case 'Not Started': return 0;
      case 'In Progress': return 50;
      case 'On Hold': return 25;
      case 'Completed': return 100;
      default: return 0;
    }
  };

  // Helper function to get progress color
  const getProgressColor = (status) => {
    switch(status) {
      case 'Not Started': return '#64748b';
      case 'In Progress': return '#2196f3';
      case 'On Hold': return '#ff9800';
      case 'Completed': return '#4caf50';
      default: return '#64748b';
    }
  };

  return (
  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh', bgcolor: '#ffffff' }}>
    <Leftsidebar />
    <Container maxWidth="lg" sx={{ my: 4, flex: 1 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%)',
          color: '#222',
          border: '1px solid rgba(33, 150, 243, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalLibraryIcon sx={{ fontSize: 32, mr: 2, color: '#2196f3' }} />
            <Typography variant="h4" fontWeight="600">
              Learning Journeys
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            onClick={() => setOpenAiModal(true)}
            sx={{ 
              borderRadius: 3, 
              textTransform: 'none', 
              px: 3, 
              bgcolor: '#2196f3',
              '&:hover': { bgcolor: '#1976d2' }
            }}
          >
            Generate Journey with AI
          </Button>
        </Box>
        <Typography variant="body1" color="rgba(0,0,0,0.6)" sx={{ ml: 6 }}>
          Discover what others are learning and get inspired
        </Typography>
      </Paper>

      {/* AI Modal */}
      <Dialog open={openAiModal} onClose={() => setOpenAiModal(false)} maxWidth="sm" fullWidth borderRadius={4}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon color="primary" />
          AI Learning Journey Generator
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tell the AI what you want to learn, and it will build a structured journey for you.
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. Master React in 2 weeks, Learn Backend with Spring Boot..."
            value={aiGoal}
            onChange={(e) => setAiGoal(e.target.value)}
            disabled={isAiGenerating}
          />

          {isAiGenerating && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, mb: 2 }}>
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ mt: 2 }}>Generating your personalized path...</Typography>
            </Box>
          )}

          {generatedPlan && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="success" sx={{ mb: 2 }}>Journey Generated!</Alert>
              <Typography variant="h6" fontWeight="bold">{generatedPlan.title}</Typography>
              
              <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'bold' }}>Key Topics:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {generatedPlan.topics.map((t, i) => <Chip key={i} label={t} size="small" />)}
              </Box>

              <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'bold' }}>Recommended Resources:</Typography>
              <MuiList size="small">
                {generatedPlan.resources.map((r, i) => (
                  <MuiListItem key={i} dense sx={{ p: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}><LinkIcon sx={{ fontSize: 16 }} /></ListItemIcon>
                    <ListItemText primary={<Typography variant="body2">{r}</Typography>} />
                  </MuiListItem>
                ))}
              </MuiList>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAiModal(false)} color="inherit">Cancel</Button>
          {!generatedPlan ? (
            <Button 
              variant="contained" 
              onClick={handleGenerateAiPlan} 
              disabled={isAiGenerating || !aiGoal.trim()}
            >
              Generate
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSaveAiPlan}>
              Save to My Journeys
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {loading ? (
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress color="primary" />
        </Box>
      ) : plans.length === 0 ? (
        <Box 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            bgcolor: 'rgba(33, 150, 243, 0.05)', 
            borderRadius: 2,
            border: '1px dashed #2196f3'
          }}
        >
          <MenuBookIcon sx={{ fontSize: 60, color: '#2196f3', opacity: 0.7, mb: 2 }} />
          <Typography variant="h6" color="#333">
            No learning plans found
          </Typography>
          <Typography variant="body2" color="rgba(0,0,0,0.6)">
            Be the first to share your learning journey!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {plans.map(plan => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Card
                sx={{
                  bgcolor: '#ffffff',
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  },
                  border: '1px solid rgba(0,0,0,0.08)',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  height: 6, 
                  width: '100%', 
                  bgcolor: getProgressColor(plan.progress),
                  opacity: 0.8
                }} />
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={plan.progress} 
                      size="small"
                      sx={{ 
                        bgcolor: getProgressColor(plan.progress), 
                        color: '#fff',
                        fontSize: '0.75rem',
                        height: 24,
                        mb: 1
                      }} 
                    />
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ 
                        color: '#333', 
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3,
                        height: '2.6em'
                      }}
                    >
                      {plan.title}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <MenuBookIcon sx={{ color: '#2196f3', mr: 1, fontSize: 18 }} />
                    <Typography 
                      variant="body2" 
                      color="rgba(0,0,0,0.7)"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {plan.topics.join(', ')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                    <LinkIcon sx={{ color: '#2196f3', mr: 1, fontSize: 18, mt: 0.3 }} />
                    <Typography 
                      variant="body2" 
                      color="rgba(0,0,0,0.7)"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3,
                        height: '2.6em'
                      }}
                    >
                      {plan.resources.join(', ')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarTodayIcon sx={{ color: '#2196f3', mr: 1, fontSize: 18 }} />
                    <Typography variant="body2" color="rgba(0,0,0,0.7)">
                      {new Date(plan.targetDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2, background: 'rgba(0,0,0,0.08)' }} />
                  
                  <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        sx={{
                          bgcolor: "#2196f3",
                          width: 32,
                          height: 32,
                        }}
                        src={plan.profileImage || ""}
                      >
                        {plan.username?.charAt(0).toUpperCase() || "U"}
                      </Avatar>
                      <Typography
                        variant="body2"
                        color="rgba(0,0,0,0.8)"
                        fontWeight={500}
                      >
                        {plan.username || "Anonymous"}
                      </Typography>
                    </Box>
                </CardContent>
                
                <LinearProgress 
                  variant="determinate" 
                  value={getProgressPercentage(plan.progress)} 
                  sx={{ 
                    height: 4,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getProgressColor(plan.progress)
                    }
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  </Box>
  );
}