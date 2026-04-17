import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const data = [
  { name: 'Jan', orders: 4000, pipeline: 2400 },
  { name: 'Feb', orders: 3000, pipeline: 1398 },
  { name: 'Mar', orders: 2000, pipeline: 9800 },
  { name: 'Apr', orders: 2780, pipeline: 3908 },
  { name: 'May', orders: 1890, pipeline: 4800 },
  { name: 'Jun', orders: 2390, pipeline: 3800 },
];

const categoryData = [
  { name: 'LCV', value: 400 },
  { name: 'PC', value: 300 },
  { name: 'HT', value: 300 },
  { name: 'SM', value: 200 },
];

const COLORS = ['#0F172A', '#10B981', '#3B82F6', '#F59E0B'];

const Analytics: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>Market Intelligence</Typography>
      
      <Grid container spacing={4}>
        {/* Main Trends Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 5, borderRadius: 5, height: 600, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>Order vs Pipeline Volume</Typography>
                <Typography variant="body2" color="text.secondary">Monthly performance and forecasting trends</Typography>
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                />
                <Area type="monotone" dataKey="orders" stroke="#3B82F6" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={4} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="pipeline" stroke="#10B981" fillOpacity={1} fill="url(#colorPipeline)" strokeWidth={4} strokeDasharray="8 5" dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Division Distribution */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: 5, height: 600, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Division Market Share</Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>Distribution of fleet assets across business lines</Typography>
              <Grid container spacing={2}>
                {categoryData.map((item, index) => (
                  <Grid item xs={6} key={item.name}>
                    <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3, borderLeft: `4px solid ${COLORS[index]}` }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>{item.name}</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>{item.value} Units</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box sx={{ flex: 1.2, width: '100%', height: '100%', minHeight: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={160}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
