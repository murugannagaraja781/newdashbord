import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel, 
  Divider,
  Alert,
  Grid
} from '@mui/material';
import { Save, Settings as SettingsIcon, Fingerprint } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';
import API from '../api/axios';

const SystemSettings: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleRegisterBiometric = async () => {
    try {
      const { data: options } = await API.post('/auth/register-biometric-options', { userId: user._id });
      const attResp = await startRegistration(options);
      await API.post('/auth/register-biometric-verify', { userId: user._id, body: attResp });
      setSuccess(true);
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  const [settings, setSettings] = useState({
    globalThreshold: 5,
    companyName: 'JAC Motors Import Dashboard',
    notifications: true,
    currency: 'INR'
  });

  const [passwords, setPasswords] = useState({ old: '', new: '' });

  const handleChangePassword = async () => {
    try {
      await API.patch('/auth/update-password', { 
        email: user.email, 
        oldPassword: passwords.old, 
        newPassword: passwords.new 
      });
      setSuccess(true);
      setPasswords({ old: '', new: '' });
    } catch (err) {
      console.error('Password change failed');
    }
  };

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 0.5 }}>System Settings</Typography>
        <Typography variant="body1" color="text.secondary">Configure global platform parameters</Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Settings updated successfully!</Alert>}

      <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <SettingsIcon size={20} color="#1D9E75" />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>General Configuration</Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Company Name"
              fullWidth
              size="small"
              value={settings.companyName}
              onChange={(e) => setSettings({...settings, companyName: e.target.value})}
              sx={{ mb: 3 }}
            />
            <TextField
              label="Default Currency"
              fullWidth
              size="small"
              value={settings.currency}
              onChange={(e) => setSettings({...settings, currency: e.target.value})}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Global Low Stock Threshold (Units)"
              type="number"
              fullWidth
              size="small"
              value={settings.globalThreshold}
              onChange={(e) => setSettings({...settings, globalThreshold: parseInt(e.target.value)})}
              sx={{ mb: 3 }}
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={settings.notifications} 
                  onChange={(e) => setSettings({...settings, notifications: e.target.checked})} 
                />
              }
              label="Enable Low Stock Notifications"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Security & Password</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Update your account password or device biometrics.</Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Old Password" type="password" fullWidth size="small" value={passwords.old} onChange={(e) => setPasswords({...passwords, old: e.target.value})} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="New Password" type="password" fullWidth size="small" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleChangePassword} sx={{ borderRadius: 2 }}>
              Update Password
            </Button>
            <Button variant="outlined" startIcon={<Fingerprint size={18} />} onClick={handleRegisterBiometric} sx={{ borderRadius: 2 }}>
              Register Device Biometrics
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="inherit">Reset Defaults</Button>
          <Button 
            variant="contained" 
            startIcon={<Save size={18} />} 
            onClick={handleSave}
            sx={{ px: 4, borderRadius: 2 }}
          >
            Save Configuration
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SystemSettings;
