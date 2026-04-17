import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  LinearProgress,
  Button,
  CircularProgress,
  IconButton
} from '@mui/material';
import { 
  TrendingUp, 
  Package, 
  Truck, 
  AlertTriangle, 
  Clock,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';

import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/dashboard/summary');
        setData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!data) return <Typography>Error loading data</Typography>;

  const { stats, categories, suggestions } = data;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h1" sx={{ color: 'primary.main', mb: 0.5 }}>Strategic Operations</Typography>
          <Typography variant="subtitle1" color="text.secondary">Global Network · FY 2025 · Real-time Operational Insights</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">SYNCED: {new Date().toLocaleTimeString()}</Typography>
      </Box>

      {/* KPI Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: 'Target Alignment', value: `${stats.annualTarget}%`, sub: 'Annual coverage', icon: <TrendingUp size={18} />, color: '#4F46E5', trend: '+2.4%' },
          { label: 'Inventory Assets', value: stats.totalStock, sub: 'Units in hub', icon: <Package size={18} />, color: '#0F172A', trend: '-12' },
          { label: 'Procurement Pipeline', value: stats.pipeline, sub: 'Units in transit', icon: <Truck size={18} />, color: '#7C3AED', trend: '+45' },
          { label: 'Critical Risk', value: stats.lowStock, sub: 'Immediate focus', icon: <AlertTriangle size={18} />, color: '#DC2626', trend: 'CRITICAL' },
          { label: 'Active Drafts', value: stats.openOrders, sub: 'Pending approval', icon: <Clock size={18} />, color: '#D97706', trend: 'STABLE' },
        ].map((kpi, i) => (
          <Grid item xs={12} sm={6} md={2.4} key={i}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid rgba(226, 232, 240, 0.8)', bgcolor: 'white', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(10px)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.01)' } }}>
              <Box sx={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, bgcolor: `${kpi.color}08`, borderRadius: '0 0 0 100%' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: 3, bgcolor: kpi.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${kpi.color}30` }}>{kpi.icon}</Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', mb: -0.5 }}>{kpi.value}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: kpi.trend.includes('+') ? 'success.main' : kpi.trend.includes('-') ? 'error.main' : 'text.secondary', fontSize: '0.65rem' }}>{kpi.trend}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>{kpi.label}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>{kpi.sub}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
        DIVISION TOPOLOGY
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {categories.map((cat: any, i: number) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: `1px solid ${cat.color}15`, bgcolor: 'white', transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { borderColor: cat.color, boxShadow: `0 20px 25px -5px ${cat.color}10`, transform: 'translateY(-4px)' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: cat.color, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>{cat.name}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>{cat.models} Active Models</Typography>
                </Box>
                <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: `${cat.color}10`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={18} />
                </Box>
              </Box>
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography variant="h2" sx={{ color: 'primary.main', fontWeight: 900 }}>{cat.units}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main' }}>+{Math.floor(Math.random() * 10)}%</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Global Hub Capacity</Typography>
              </Box>
              <LinearProgress variant="determinate" value={cat.target} sx={{ height: 8, borderRadius: 4, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: cat.color, borderRadius: 4 } }} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
        CRITICAL INTELLIGENCE ALERTS
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <AnimatePresence>
          {suggestions.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'white', borderStyle: 'dashed' }}>
                <Typography variant="subtitle2">System Status Nominal. No immediate risks detected.</Typography>
              </Paper>
            </motion.div>
          ) : (
            suggestions.map((s: any, i: number) => (
              <motion.div 
                key={s.model}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
              >
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 3, borderRadius: 4, transition: '0.2s', '&:hover': { border: '1px solid #4F46E5', bgcolor: '#F8FAFC' } }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.level === 'critical' ? '#EF4444' : '#F59E0B' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      <Box component="span" sx={{ color: 'primary.main', fontWeight: 800, mr: 1 }}>{s.model}</Box> {s.desc} — {s.status}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => navigate('/alerts')}
                      sx={{ 
                        borderRadius: 3, 
                        fontWeight: 700,
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 }
                      }}
                    >
                      Process Alert
                    </Button>
                    {user.role === 'superadmin' && (
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => {
                          const newSuggestions = data.suggestions.filter((_: any, idx: number) => idx !== i);
                          setData({...data, suggestions: newSuggestions});
                          toast.success('Strategy Optimized! Alert archived. 🛡️', { 
                            icon: '🚀', 
                            style: { 
                              borderRadius: '16px', 
                              background: '#020617', 
                              color: '#fff',
                              fontWeight: 700
                            } 
                          });
                        }}
                        sx={{ 
                          bgcolor: 'rgba(239, 68, 68, 0.05)',
                          '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' }
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    )}
                  </Box>
                </Paper>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Dashboard;
