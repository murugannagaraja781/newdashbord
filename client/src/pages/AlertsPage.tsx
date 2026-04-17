import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Chip,
  CircularProgress
} from '@mui/material';
import { AlertCircle, ExternalLink } from 'lucide-react';
import API from '../api/axios';

const AlertsPage: React.FC = () => {
  const [criticalModels, setCriticalModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/models');
        // Filter models below threshold
        const alerts = data.filter((m: any) => m.stock <= m.threshold);
        setCriticalModels(alerts);
      } catch (err) {
        console.error('Failed to fetch alerts');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 0.5 }}>Critical Inventory Alerts</Typography>
        <Typography variant="body1" color="text.secondary">Models requiring immediate procurement action</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {criticalModels.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="body1" color="text.secondary">All stock levels are within healthy thresholds. No active alerts.</Typography>
          </Paper>
        ) : (
          criticalModels.map((model) => (
            <Paper 
              key={model._id} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                borderRadius: 3, 
                border: '1px solid #fee2e2',
                bgcolor: '#fffafb'
              }}
            >
              <Box sx={{ p: 1, borderRadius: '50%', bgcolor: '#fee2e2', color: '#dc2626' }}>
                <AlertCircle size={24} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{model.name}</Typography>
                  <Chip label={model.code} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Current: <Box component="span" sx={{ color: '#dc2626', fontWeight: 700 }}>{model.stock} units</Box> · 
                  Threshold: {model.threshold} units · 
                  Pipeline: {model.pipeline} in transit
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right', mr: 2 }}>
                <Chip 
                  label={model.stock === 0 ? "OUT OF STOCK" : "CRITICAL LOW"} 
                  size="small" 
                  sx={{ bgcolor: '#dc2626', color: 'white', fontWeight: 700, fontSize: '0.65rem' }} 
                />
              </Box>
              <Button 
                variant="contained" 
                size="small" 
                endIcon={<ExternalLink size={14} />}
                sx={{ borderRadius: 2 }}
              >
                Draft PFI
              </Button>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default AlertsPage;
