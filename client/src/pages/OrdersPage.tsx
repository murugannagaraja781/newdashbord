import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Grid,
  useMediaQuery,
  useTheme,
  Skeleton,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Divider
} from '@mui/material';
import { FilePlus, Search, Edit2, Trash2, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const OrdersPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [orders, setOrders] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  const [newOrder, setNewOrder] = useState({
    pfiNumber: '',
    modelId: '',
    supplierId: '',
    quantity: 1,
    unitPrice: 0,
    status: 'Pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, modelsRes, suppliersRes] = await Promise.all([
        API.get('/orders'),
        API.get('/models'),
        API.get('/suppliers')
      ]);
      setOrders(ordersRes.data);
      setModels(modelsRes.data);
      setSuppliers(suppliersRes.data);
    } catch (err) {
      toast.error('Failed to sync order data');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleOpen = (order?: any) => {
    if (order) {
      setNewOrder({
        pfiNumber: order.orderId || '',
        modelId: order.items?.[0]?.model?._id || '',
        supplierId: order.supplier?._id || '',
        quantity: order.items?.[0]?.quantity || 1,
        unitPrice: order.items?.[0]?.unitPrice || 0,
        status: order.status || 'Pending'
      });
      setSelectedId(order._id);
      setEditMode(true);
    } else {
      setNewOrder({ pfiNumber: '', modelId: '', supplierId: '', quantity: 1, unitPrice: 0, status: 'Draft' });
      setSelectedId(null);
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!newOrder.pfiNumber || !newOrder.modelId || !newOrder.supplierId) {
      return toast.error('Please fill required fields');
    }

    const payload = {
      orderId: newOrder.pfiNumber,
      supplier: newOrder.supplierId,
      status: newOrder.status,
      items: [{
        model: newOrder.modelId,
        quantity: newOrder.quantity,
        unitPrice: newOrder.unitPrice
      }]
    };
    
    try {
      setActionLoading(true);
      if (editMode && selectedId) {
        await API.patch(`/orders/${selectedId}`, payload);
        toast.success(`PFI ${newOrder.pfiNumber} record updated`);
      } else {
        await API.post('/orders', payload);
        toast.success(`PFI ${newOrder.pfiNumber} registered in pipeline`);
      }
      setOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, pfi: string) => {
    if (window.confirm(`Permanently remove PFI ${pfi} from the pipeline?`)) {
      try {
        await API.delete(`/orders/${id}`);
        toast.success('PFI record purged');
        fetchData();
      } catch (err) {
        toast.error('Deletion failed');
      }
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.orderId?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (o.items?.[0]?.model?.name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'info';
      case 'Shipped': return 'primary';
      case 'Delivered': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>PFI Pipeline</Typography>
          <Typography variant="body1" color="text.secondary">Monitor and register import orders</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search PFI # or Model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <Search size={16} style={{ marginRight: 8, color: '#64748B' }} /> }}
            sx={{ width: 260, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          {user.role === 'superadmin' && (
            <Button variant="contained" startIcon={<FilePlus size={18} />} onClick={() => handleOpen()} sx={{ borderRadius: 3, px: 3 }}>
              New PFI
            </Button>
          )}
        </Box>
      </Box>

      {loading ? (
        <Grid container spacing={2}>
          {[1,2,3,4].map(i => (
            <Grid item xs={12} key={i}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : isMobile ? (
        <Grid container spacing={2}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card sx={{ borderRadius: 4, border: '1px solid #E2E8F0', position: 'relative' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box display="flex" justifyContent="space-between" mb={1.5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>{order.orderId}</Typography>
                    <Chip 
                      label={order.status} 
                      size="small" 
                      color={getStatusColor(order.status) as any} 
                      sx={{ fontWeight: 800, fontSize: '0.65rem' }} 
                    />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{order.items?.[0]?.model?.name || 'N/A'}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
                    Supplier: {order.supplier?.name || 'N/A'} • {order.items?.[0]?.quantity || 0} Units
                  </Typography>
                  
                  <Divider sx={{ mb: 1.5 }} />
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      ₹{((order.items?.[0]?.quantity || 0) * (order.items?.[0]?.unitPrice || 0)).toLocaleString()}
                    </Typography>
                    {user.role === 'superadmin' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleOpen(order)} sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 1.5 }}>
                          <Edit2 size={14} />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(order._id, order.orderId)} sx={{ bgcolor: 'error.main', color: 'white', borderRadius: 1.5 }}>
                          <Trash2 size={14} />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>PFI NUMBER</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>VEHICLE MODEL</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>SUPPLIER</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800 }}>QTY</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>TOTAL VALUE</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800 }}>STATUS</TableCell>
                {user.role === 'superadmin' && <TableCell align="center" sx={{ fontWeight: 800 }}>ACTIONS</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{order.orderId}</TableCell>
                  <TableCell>{order.items?.[0]?.model?.name || 'Unknown'}</TableCell>
                  <TableCell>{order.supplier?.name || 'Unknown'}</TableCell>
                  <TableCell align="center">{order.items?.[0]?.quantity || 0}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    ₹{((order.items?.[0]?.quantity || 0) * (order.items?.[0]?.unitPrice || 0)).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status) as any} 
                      size="small" 
                      sx={{ fontWeight: 800, fontSize: '0.65rem' }} 
                    />
                  </TableCell>
                  {user.role === 'superadmin' && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleOpen(order)} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 1.5 }}>
                          <Edit2 size={14} />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(order._id, order.orderId)} sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' }, borderRadius: 1.5 }}>
                          <Trash2 size={14} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Dialog with Edit/Add modes */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800, px: 3, pt: 3 }}>{editMode ? 'Modify PFI Record' : 'Register New PFI'}</DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField label="PFI Number" fullWidth size="small" value={newOrder.pfiNumber} onChange={(e) => setNewOrder({...newOrder, pfiNumber: e.target.value.toUpperCase()})} />
            </Grid>
            <Grid item xs={6}>
              <TextField select label="Vehicle Model" fullWidth size="small" value={newOrder.modelId} onChange={(e) => {
                const model = models.find(m => m._id === e.target.value);
                setNewOrder({...newOrder, modelId: e.target.value, unitPrice: model?.fobPrice || 0});
              }}>
                {models.map(m => <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select label="Supplier" fullWidth size="small" value={newOrder.supplierId} onChange={(e) => setNewOrder({...newOrder, supplierId: e.target.value})}>
                {suppliers.map(s => <MenuItem key={s._id} value={s._id}>{s.name} ({s.division})</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField label="Quantity" type="number" fullWidth size="small" value={newOrder.quantity} onChange={(e) => setNewOrder({...newOrder, quantity: parseInt(e.target.value) || 1})} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Unit Price (FOB ₹)" type="number" fullWidth size="small" value={newOrder.unitPrice} onChange={(e) => setNewOrder({...newOrder, unitPrice: parseInt(e.target.value) || 0})} />
            </Grid>
            <Grid item xs={12}>
              <TextField select label="Order Status" fullWidth size="small" value={newOrder.status} onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}>
                <MenuItem value="Pending">Pending Approval</MenuItem>
                <MenuItem value="Confirmed">Confirmed / Paid</MenuItem>
                <MenuItem value="Shipped">In Transit / Shipped</MenuItem>
                <MenuItem value="Delivered">Delivered to Port</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={actionLoading} sx={{ borderRadius: 3, px: 4, minWidth: 140 }}>
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : editMode ? 'Update PFI' : 'Register PFI'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersPage;
