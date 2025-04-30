
import React from 'react';
import { Box, Typography, Button, Tooltip, IconButton, Badge } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Search, AutoGraph, BookmarkBorder, Person,
  RocketLaunch, Menu, Close, AddBox, Notifications
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAuth } from "../../auth/AuthContext";
import SchoolIcon from '@mui/icons-material/School';

export default function Leftsidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user } = useAuth();
  const [notificationsCount, setNotificationsCount] = useState(3); // You can fetch this from your API

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: <Home />, text: "Home", path: "/home" },
    
    { icon: <AutoGraph />, text: "Learning Paths", path: "/learning-plans" },
    { icon: <BookmarkBorder />, text: "Saved", path: "" },
    // { 
    //   icon: (
    //     <Badge badgeContent={notificationsCount} color="error" max={9}>
    //       <Notifications />
    //     </Badge>
    //   ), 
    //   text: "Notifications", 
    //   path: "/notifications" 
    // },
    { icon: <Person />, text: "Profile", path: "/profile" },
  ];

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        // <Button
        //   key={item.path}
        //   component={Link}
        //   to={item.path}
        //   startIcon={item.icon}
        //   sx={{
        //     textTransform: 'none',
        //     color: isActive(item.path) ? '#000' : '#333',
        //     fontWeight: isActive(item.path) ? '600' : '400',
        //     backgroundColor: isActive(item.path) ? '#f5f5f5' : 'transparent',
        //     borderRadius: '8px',
        //     py: 1.5,
        //     px: 2,
        //     justifyContent: { xs: 'center', md: 'flex-start' },
        //     width: '100%',
        //     '&:hover': {
        //       backgroundColor: '#f5f5f5',
        //     },
        //     transition: 'all 0.2s ease',
        //   }}
        // >
        //   <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 1 }}>
        //     {item.text}
        //   </Box>
        // </Button>
      ))}
    </>
  );

  // Mobile menu toggle button
  const mobileMenuToggle = (
    <Box 
      sx={{ 
        display: { xs: 'flex', md: 'none' }, 
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1100,
      }}
    >
      <IconButton 
        onClick={toggleMobileMenu}
        sx={{ 
          backgroundColor: '#000',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          '&:hover': {
            backgroundColor: '#333'
          }
        }}
      >
        {mobileOpen ? <Close /> : <AddBox />}
      </IconButton>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: { xs: 0, md: 240 },
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          bgcolor: '#FFFFFF',
          px: 2,
          py: 3,
          gap: 1,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 1 }}>
          <SchoolIcon sx={{ color: '#000', mr: 1, fontSize: 28 }} />
          <Typography
            variant="h5"
            component={Link}
            to="/home"
            sx={{
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'none',
              color: '#000',
              fontWeight: 'bold',
              letterSpacing: '-0.5px',
            }}
          >
            CodeMaster
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {renderNavItems()}
        </Box>

        {/* Create New Post Button */}
        <Button
          variant="contained"
          component={Link}
          to="/add-post"
          sx={{
            mt: 'auto',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            py: 1.2,
            backgroundColor: '#000',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#333',
            },
            boxShadow: 'none',
          }}
          startIcon={<AddBox />}
        >
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            Create
          </Box>
        </Button>
      </Box>

      {/* Mobile Bottom Navigation */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 56,
          backgroundColor: 'white',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          zIndex: 1000,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {navItems.slice(0, 4).map((item) => (
          <Tooltip key={item.path} title={item.text} placement="top">
            <IconButton
              component={Link}
              to={item.path}
              sx={{
                color: isActive(item.path) ? '#000' : '#666',
                p: 1.5,
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }
              }}
            >
              {item.path === '/notifications' ? (
                <Badge badgeContent={notificationsCount} color="error" max={9}>
                  {item.icon}
                </Badge>
              ) : item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      {/* Mobile Side Menu (expands when toggle button is clicked) */}
      <Box
        sx={{
          display: { xs: mobileOpen ? 'block' : 'none', md: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1050,
        }}
        onClick={toggleMobileMenu}
      />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 280,
          height: '100%',
          backgroundColor: 'white',
          zIndex: 1100,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          p: 2,
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Menu</Typography>
          <IconButton onClick={toggleMobileMenu}>
            <Close />
          </IconButton>
        </Box>
        
        {/* Full text navigation items for mobile side menu */}
        {navItems.map((item) => (
          <Button
            key={item.path}
            component={Link}
            to={item.path}
            startIcon={item.path === '/notifications' ? (
              <Badge badgeContent={notificationsCount} color="error" max={9}>
                {item.icon}
              </Badge>
            ) : item.icon}
            onClick={toggleMobileMenu}
            sx={{
              textTransform: 'none',
              color: isActive(item.path) ? '#000' : '#333',
              fontWeight: isActive(item.path) ? '600' : '400',
              backgroundColor: isActive(item.path) ? '#f5f5f5' : 'transparent',
              borderRadius: '8px',
              py: 1.5,
              px: 2,
              justifyContent: 'flex-start',
              width: '100%',
              textAlign: 'left',
            }}
          >
            {item.text}
          </Button>
        ))}
        
        {/* Create Post Button in mobile menu */}
        <Button
          variant="contained"
          component={Link}
          to="/add-post"
          onClick={toggleMobileMenu}
          sx={{
            mt: 'auto',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            py: 1.2,
            backgroundColor: '#000',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
          startIcon={<AddBox />}
        >
          Create Post
        </Button>
      </Box>

      {mobileMenuToggle}
    </>
  );
}