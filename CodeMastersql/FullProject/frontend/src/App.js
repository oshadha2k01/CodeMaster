
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AddPost from './pages/AddPost';
import EditPost from './pages/EditPost';
import Navbar from './components/Navbar';
import LearningPlans from './pages/LearningPlans';
import MyLearningPlans from './pages/MyLearningPlans';
import AddLearningPlan from './pages/AddLearningPlan';
import Settings from './pages/Settings';
import OAuthSuccess from './pages/OAuthSuccess';
import FollowRequests from './components/FollowRequests';
import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

// Light Theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    primary: {
      main: '#ff5f6d',
    },
    secondary: {
      main: '#ffc371',
    },
    text: {
      primary: '#1e1e1e',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.5px',
        },
      },
    },
  },
});

// ✅ Wrap with location-based logic
function AppContent() {
  const location = useLocation();
  const hideNavbar = ["/signin", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <ToastContainer position="top-right" theme="light" />

      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/add-post" element={<PrivateRoute><AddPost /></PrivateRoute>} />
        <Route path="/edit-post/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />
        <Route path="/learning-plans" element={<LearningPlans />} />
        <Route path="/my-learning-plans" element={<MyLearningPlans />} />
        <Route path="/add-learning-plan" element={<AddLearningPlan />} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/follow-requests" element={<PrivateRoute><FollowRequests /></PrivateRoute>} />
      </Routes>
    </>
  );
}

// Private route wrapper
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/signin" />;
}

// ✅ Final App
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
