import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  Tooltip
} from '@mui/material';
import { UserPlus, Trash2, ShieldCheck, Key } from 'lucide-react';
import API from '../api/axios';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Super Admin', email: 'admin@jac.com', role: 'superadmin', joined: '2025-01-10' },
    { id: 2, name: 'Operations Manager', email: 'manager@jac.com', role: 'manager', joined: '2025-02-15' },
  ]);

  const [open, setOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'manager' });

  const handleCreate = () => {
    setUsers([...users, { ...newUser, id: Date.now(), joined: new Date().toISOString().split('T')[0] }]);
    setOpen(false);
    setNewUser({ name: '', email: '', role: 'manager' });
  };

  const handleResetPassword = async () => {
    try {
      // In real app, call API.patch(`/auth/reset-user-password/${selectedUser.id}`)
      alert(`Password for ${selectedUser.name} has been updated.`);
      setResetOpen(false);
      setNewPassword('');
    } catch (err) {
      console.error('Password reset failed');
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 0.5 }}>User Management</Typography>
          <Typography variant="body1" color="text.secondary">Create and manage platform roles</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<UserPlus size={18} />} 
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Add New User
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Personnel</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Joined Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{u.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<ShieldCheck size={12} />}
                    label={u.role.toUpperCase()} 
                    size="small" 
                    color={u.role === 'superadmin' ? 'primary' : 'secondary'} 
                    sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: 1.5 }}
                  />
                </TableCell>
                <TableCell><Typography variant="body2">{u.joined}</Typography></TableCell>
                <TableCell>
                  <Chip label="Active" size="small" variant="outlined" color="success" sx={{ height: 20, fontSize: '0.65rem' }} />
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Tooltip title="Reset Password">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => { setSelectedUser(u); setResetOpen(true); }}
                      >
                        <Key size={18} />
                      </IconButton>
                    </Tooltip>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete(u.id)}
                      disabled={u.role === 'superadmin'}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Personnel</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Full Name" fullWidth size="small" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
            <TextField label="Email Address" fullWidth size="small" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
            <TextField select label="Role" fullWidth size="small" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="superadmin">Superadmin</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create Account</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Reset Password for {selectedUser?.name}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField 
            label="New Password" 
            type="password" 
            fullWidth 
            size="small" 
            sx={{ mt: 1 }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setResetOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleResetPassword}>Update Password</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
