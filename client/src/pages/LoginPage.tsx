import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { startAuthentication } from '@simplewebauthn/browser';
import API from '../api/axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.PublicKeyCredential) {
      setBiometricSupported(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!email) {
      setError('Please enter your email first to use biometrics.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // 1. Get options from server
      const { data: options } = await API.post('/auth/login-biometric-options', { email });
      
      // 2. Start authentication via browser API
      const asseResp = await startAuthentication(options);
      
      // 3. Verify on server
      const { data: verifyData } = await API.post('/auth/login-biometric-verify', { email, body: asseResp });
      
      if (verifyData.status === 'success') {
        localStorage.setItem('token', verifyData.token);
        localStorage.setItem('user', JSON.stringify(verifyData.user));
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Biometric authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={0} sx={{ p: 4, width: '100%', borderRadius: 4, border: '1px solid #e2e8f0', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h2" color="primary.main" gutterBottom sx={{ fontWeight: 700 }}>JAC MOTORS</Typography>
            <Typography variant="body1" color="text.secondary">Import Dashboard Login</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField margin="normal" required fullWidth label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" />
            <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3, mb: 2, height: 48 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          {biometricSupported && (
            <>
              <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography variant="caption" sx={{ px: 2, color: 'text.secondary' }}>OR</Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>
              <Button fullWidth variant="outlined" startIcon={<Fingerprint size={20} />} onClick={handleBiometricLogin} disabled={loading} sx={{ height: 48, borderRadius: 2, borderColor: 'divider', color: 'text.primary' }}>
                Sign in with Biometrics
              </Button>
            </>
          )}
          
          <Box sx={{ mt: 3, textAlign: 'center' }}><Typography variant="caption" color="text.secondary">Restricted access for Authorized Personnel only.</Typography></Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
