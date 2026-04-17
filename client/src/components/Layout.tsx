import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
  Paper,
  Button,
  Badge,
  Grid
} from '@mui/material';
import { 
  BarChart3, 
  Package, 
  Truck, 
  FileText, 
  Bell, 
  Users,
  Settings,
  Menu as MenuIcon,
  LogOut,
  ChevronLeft,
  PieChart,
  Search as SearchIcon,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';

const drawerWidth = 280;

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const socket = io('http://localhost:5001');
    socket.on('stock_updated', (data) => {
      toast.success(`Stock Update: ${data.name} is now ${data.stock}`, {
        duration: 4000,
        icon: '📦',
        style: { borderRadius: '12px', background: '#0F172A', color: '#fff' }
      });
    });
    return () => { socket.disconnect(); };
  }, []);

  const toggleDrawer = () => setOpen(!open);

  const navItems = [
    { text: 'Analytics', icon: <BarChart3 size={22} />, path: '/dashboard' },
    { text: 'Inventory', icon: <Package size={22} />, path: '/inventory' },
    { text: 'Suppliers', icon: <Truck size={22} />, path: '/suppliers' },
    { text: 'PFI Orders', icon: <FileText size={22} />, path: '/orders' },
    { text: 'Insights', icon: <PieChart size={22} />, path: '/analytics' },
    { text: 'Alerts', icon: <Bell size={22} />, path: '/alerts' },
  ];

  if (user.role === 'superadmin') {
    navItems.push({ text: 'Team', icon: <Users size={22} />, path: '/users' });
    navItems.push({ text: 'Settings', icon: <Settings size={22} />, path: '/settings' });
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Toaster position="top-right" />
      
      {/* Premium Desktop Sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: open ? drawerWidth : 88,
            transition: theme.transitions.create('width', { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }),
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : 88,
              transition: theme.transitions.create('width', { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }),
              boxSizing: 'border-box',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              borderRight: '1px solid rgba(226, 232, 240, 0.6)',
              px: open ? 2 : 1.5,
              py: 3,
              overflowX: 'hidden'
            },
          }}
        >
          {/* Logo Section */}
          <Box sx={{ mb: 6, px: open ? 1.5 : 0.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 44, height: 44, bgcolor: 'primary.main', borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.3)', flexShrink: 0 }}>
              <LayoutDashboard color="white" size={24} />
            </Box>
            {open && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5, lineHeight: 1, color: 'primary.main' }}>JAC</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.6, letterSpacing: 1, textTransform: 'uppercase' }}>Operations</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            {open && <Typography variant="caption" sx={{ px: 2, mb: 2, display: 'block', fontWeight: 800, opacity: 0.4, letterSpacing: 1.5 }}>MAIN COMMAND</Typography>}
            <List sx={{ px: 0 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: 3,
                        py: 1.5,
                        px: open ? 2 : 1,
                        justifyContent: open ? 'initial' : 'center',
                        bgcolor: isActive ? 'white' : 'transparent',
                        boxShadow: isActive ? '0 4px 12px -2px rgba(0,0,0,0.08)' : 'none',
                        border: isActive ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid transparent',
                        '&:hover': { bgcolor: isActive ? 'white' : 'rgba(0,0,0,0.02)' },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: open ? 40 : 0, color: isActive ? 'secondary.main' : 'text.secondary' }}>
                        {item.icon}
                      </ListItemIcon>
                      {open && (
                        <ListItemText 
                          primary={item.text} 
                          slotProps={{
                            primary: { 
                              fontSize: '0.9rem', 
                              fontWeight: isActive ? 800 : 600,
                              color: isActive ? 'primary.main' : 'text.secondary',
                            }
                          }} 
                        />
                      )}
                      {open && isActive && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main', boxShadow: '0 0 10px #10B981' }} />}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* User Profile Card */}
          <Box sx={{ mt: 'auto', p: open ? 2 : 1, bgcolor: open ? 'primary.main' : 'transparent', borderRadius: 5, position: 'relative', overflow: 'hidden', transition: 'all 0.3s' }}>
            {open && <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1, justifyContent: open ? 'flex-start' : 'center' }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: open ? 'rgba(255,255,255,0.1)' : 'primary.main', fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>
                {user.name?.[0]?.toUpperCase() || 'A'}
              </Avatar>
              {open && (
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name || 'Admin User'}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{user.role}</Typography>
                </Box>
              )}
              {open && (
                <IconButton size="small" onClick={handleLogout} sx={{ color: 'white', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                  <LogOut size={16} />
                </IconButton>
              )}
            </Box>
          </Box>
          
          <IconButton onClick={toggleDrawer} sx={{ mt: 2, mx: 'auto', display: 'flex', bgcolor: '#F1F5F9' }}>
            {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </IconButton>
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 5 }, pb: isMobile ? 12 : 6, width: '100%', overflowX: 'hidden', position: 'relative' }}>
        
        {/* Floating Top Quick Actions (Desktop) */}
        {!isMobile && (
          <Box sx={{ position: 'sticky', top: 0, mb: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, zIndex: 10 }}>
            <Paper elevation={0} sx={{ p: 1, px: 2, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(226, 232, 240, 0.4)' }}>
              <IconButton size="small" sx={{ p: 1, color: 'text.secondary' }}><SearchIcon size={18} /></IconButton>
              <IconButton size="small" sx={{ p: 1, color: 'text.secondary' }}>
                <Badge variant="dot" color="error"><Bell size={18} /></Badge>
              </IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <Button 
                variant="outlined" 
                color="error"
                size="small"
                startIcon={<LogOut size={16} />}
                onClick={handleLogout}
                sx={{ borderRadius: 3, fontWeight: 700, px: 2, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
              >
                Sign Out
              </Button>
            </Paper>
          </Box>
        )}

        {isMobile && (
          <Box sx={{ position: 'fixed', top: 16, right: 16, display: 'flex', gap: 2, zIndex: 900 }}>
             <IconButton 
              onClick={() => setOpen(true)} 
              sx={{ bgcolor: 'primary.main', color: 'white', p: 1.5, borderRadius: 2.5, boxShadow: '0 8px 16px rgba(0,0,0,0.2)', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <MenuIcon size={20} />
            </IconButton>
          </Box>
        )}
        
        <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>

      {/* Mobile App Navigation */}
      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, borderTop: '1px solid rgba(0,0,0,0.05)', bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }} elevation={10}>
          <BottomNavigation
            showLabels
            value={location.pathname}
            onChange={(_, newValue) => {
              if (newValue !== 'more') navigate(newValue);
            }}
            sx={{ height: 72, bgcolor: 'transparent' }}
          >
            <BottomNavigationAction label="Metric" icon={<BarChart3 size={20} />} value="/dashboard" sx={{ '&.Mui-selected': { color: 'primary.main', fontWeight: 800 } }} />
            <BottomNavigationAction label="Stock" icon={<Package size={20} />} value="/inventory" sx={{ '&.Mui-selected': { color: 'primary.main', fontWeight: 800 } }} />
            <BottomNavigationAction label="PFI" icon={<FileText size={20} />} value="/orders" sx={{ '&.Mui-selected': { color: 'primary.main', fontWeight: 800 } }} />
            <BottomNavigationAction label="More" icon={<MenuIcon size={20} />} value="more" onClick={() => setOpen(!open)} sx={{ '&.Mui-selected': { color: 'primary.main', fontWeight: 800 } }} />
          </BottomNavigation>
          
          <Drawer anchor="bottom" open={open && isMobile} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { borderRadius: '24px 24px 0 0', p: 3, maxHeight: '70vh', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)' } } }}>
            <Box sx={{ width: 40, height: 4, bgcolor: '#E2E8F0', borderRadius: 2, mx: 'auto', mb: 3 }} />
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 800 }}>Control Center</Typography>
            <Grid container spacing={2}>
              {navItems.map((item) => (
                <Grid item xs={4} key={item.text}>
                  <Box onClick={() => { navigate(item.path); setOpen(false); }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2, borderRadius: 3, bgcolor: location.pathname === item.path ? 'primary.light' : '#F1F5F9' }}>
                    <Box sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>{item.icon}</Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>{item.text}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Button fullWidth variant="outlined" color="error" onClick={() => { localStorage.clear(); navigate('/login'); }} sx={{ mt: 4, borderRadius: 3, py: 1.5 }}>Logout Account</Button>
          </Drawer>
        </Paper>
      )}
    </Box>
  );
};

export default Layout;
