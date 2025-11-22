import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';

const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const AddPost = lazy(() => import('./pages/AddPost'));
const EditPost = lazy(() => import('./pages/EditPost'));
const Navbar = lazy(() => import('./components/Navbar'));
const LearningPlans = lazy(() => import('./pages/LearningPlans'));
const MyLearningPlans = lazy(() => import('./pages/MyLearningPlans'));
const AddLearningPlan = lazy(() => import('./pages/AddLearningPlan'));
const Settings = lazy(() => import('./pages/Settings'));
const OAuthSuccess = lazy(() => import('./pages/OAuthSuccess'));
const FollowRequests = lazy(() => import('./components/FollowRequests'));
const NotificationSystem = lazy(() => import('./components/NotificationSystem'));

import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Theme Context
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// ✅ Wrap with location-based logic
function AppContent() {
  const location = useLocation();
  const hideNavbar = ["/signin", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <NotificationSystem />
      <ToastContainer position="top-right" theme="light" />

      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      }>
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
      </Suspense>
    </>
  );
}

// Private route wrapper
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>Loading...</Box>;
  return user ? children : <Navigate to="/signin" />;
}

// ✅ Final App
export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'light');

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newMode);
        return newMode;
      });
    },
  }), []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'light' 
        ? {
            background: { default: '#f8fafc', paper: '#ffffff' },
            primary: { main: '#4f46e5' },
            text: { primary: '#0f172a', secondary: '#64748b' },
          }
        : {
            background: { default: '#0f172a', paper: '#1e293b' },
            primary: { main: '#818cf8' },
            text: { primary: '#f8fafc', secondary: '#94a3b8' },
          }
      ),
    },
    typography: {
      fontFamily: "'Outfit', 'Inter', sans-serif",
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: mode === 'light' ? {
      MuiButton: {
        styleOverrides: {
          root: { padding: '8px 20px', boxShadow: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' } },
          containedPrimary: { background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' },
        },
      },
    } : {
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } }
    },
  }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ColorModeContext.Provider>
  );
}
