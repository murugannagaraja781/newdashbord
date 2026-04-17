import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Chip, 
  Tabs, 
  Tab, 
  IconButton, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Skeleton,
  CircularProgress
} from '@mui/material';
import { Search, Plus, Minus, PackagePlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const InventoryPage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const [newModel, setNewModel] = useState({
    code: '',
    name: '',
    category: 'LCV',
    stock: 0,
    pipeline: 0,
    fobPrice: 0,
    threshold: 5
  });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/models');
      setModels(data);
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setTimeout(() => setLoading(false), 500); // Smooth transition
    }
  };

  const validateForm = () => {
    const errors: any = {};
    if (!newModel.code) errors.code = 'Vehicle code is required';
    if (!newModel.name) errors.name = 'Model name is required';
    if (newModel.fobPrice <= 0) errors.fobPrice = 'Price must be greater than 0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStockUpdate = async (id: string, newStock: number) => {
    try {
      await API.patch(`/models/${id}/stock`, { stock: Math.max(0, newStock) });
      toast.success('Inventory state updated', { position: 'bottom-center' });
      fetchModels();
    } catch (err) {
      toast.error('Failed to sync stock level');
    }
  };

  const handleCreateModel = async () => {
    if (!validateForm()) return;
    
    try {
      setActionLoading(true);
      await API.post('/models', newModel);
      toast.success(`${newModel.name} added to ledger`);
      setOpen(false);
      fetchModels();
      setNewModel({ code: '', name: '', category: 'LCV', stock: 0, pipeline: 0, fobPrice: 0, threshold: 5 });
    } catch (err) {
      toast.error('Model creation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteModel = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await API.delete(`/models/${id}`);
        toast.success('Model removed from ledger');
        fetchModels();
      } catch (err) {
        toast.error('Deletion failed');
      }
    }
  };

  const filteredModels = models.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'ALL' || m.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>Fleet Inventory</Typography>
          <Typography variant="body1" color="text.secondary">Real-time stock & pipeline management</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search VIN/Model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <Search size={16} style={{ marginRight: 8, color: '#64748B' }} />,
              }
            }}
            sx={{ width: 260, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          {user.role === 'superadmin' && (
            <Button 
              variant="contained" 
              startIcon={<PackagePlus size={18} />}
              onClick={() => setOpen(true)}
              sx={{ borderRadius: 3, height: 40, px: 3 }}
            >
              Add New Model
            </Button>
          )}
        </Box>
      </Box>

      <Tabs 
        value={category} 
        onChange={(_, v) => setCategory(v)} 
        sx={{ mb: 4, borderBottom: '1px solid #E2E8F0' }}
      >
        <Tab label="All Units" value="ALL" />
        <Tab label="Commercial (LCV)" value="LCV" />
        <Tab label="Passenger (PC)" value="PC" />
        <Tab label="Heavy (HT)" value="HT" />
        <Tab label="Special (SM)" value="SM" />
      </Tabs>

      <Grid container spacing={3}>
        {loading ? (
          [1,2,3,4,5,6,7,8].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 4 }} />
            </Grid>
          ))
        ) : filteredModels.length > 0 ? (
          filteredModels.map((model) => (
            <Grid item xs={12} sm={6} md={3} key={model._id}>
              <Card sx={{ height: '100%', borderRadius: 4, border: '1px solid #e2e8f0', transition: 'all 0.2s', '&:hover': { boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', transform: 'translateY(-4px)' } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, px: 1, py: 0.5, bgcolor: '#F1F5F9', borderRadius: 1.5, color: 'primary.main' }}>
                      {model.code}
                    </Typography>
                    {user.role === 'superadmin' && (
                      <IconButton size="small" color="error" onClick={() => handleDeleteModel(model._id)} sx={{ mt: -0.5, mr: -0.5 }}>
                        <Trash2 size={16} />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>{model.name}</Typography>
                  
                  <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Current Stock</Typography>
                      <Chip 
                        label={model.stock <= model.threshold ? 'LOW' : 'STABLE'} 
                        size="small" 
                        color={model.stock <= model.threshold ? 'error' : 'success'} 
                        sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                      <IconButton size="small" onClick={() => handleStockUpdate(model._id, model.stock - 1)} sx={{ border: '1px solid #E2E8F0' }}><Minus size={16} /></IconButton>
                      <Typography variant="h2" sx={{ fontWeight: 800 }}>{model.stock}</Typography>
                      <IconButton size="small" onClick={() => handleStockUpdate(model._id, model.stock + 1)} sx={{ border: '1px solid #E2E8F0' }}><Plus size={16} /></IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>Pipeline</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{model.pipeline || 0} Units</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>FOB Price</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>₹{(model.fobPrice || 0).toLocaleString()}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h4" color="text.secondary">No vehicle models matching your search.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Add Model Dialog with Validation & Loading */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 4 } } }}>
        <DialogTitle sx={{ fontWeight: 800, px: 3, pt: 3 }}>Onboard New Model</DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField label="Vehicle Code" fullWidth size="small" placeholder="e.g. JAC-N55-2025" value={newModel.code} onChange={(e) => setNewModel({...newModel, code: e.target.value.toUpperCase()})} error={!!formErrors.code} helperText={formErrors.code} />
            <TextField label="Model Full Name" fullWidth size="small" value={newModel.name} onChange={(e) => setNewModel({...newModel, name: e.target.value})} error={!!formErrors.name} helperText={formErrors.name} />
            <TextField select label="Category" fullWidth size="small" value={newModel.category} onChange={(e) => setNewModel({...newModel, category: e.target.value})}>
              <MenuItem value="LCV">Light Commercial (LCV)</MenuItem>
              <MenuItem value="PC">Passenger car (PC)</MenuItem>
              <MenuItem value="HT">Heavy Truck (HT)</MenuItem>
              <MenuItem value="SM">Special Machinery (SM)</MenuItem>
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Initial Stock" type="number" fullWidth size="small" value={newModel.stock} onChange={(e) => setNewModel({...newModel, stock: parseInt(e.target.value)})} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="FOB Price (₹)" type="number" fullWidth size="small" value={newModel.fobPrice} onChange={(e) => setNewModel({...newModel, fobPrice: parseInt(e.target.value)})} error={!!formErrors.fobPrice} helperText={formErrors.fobPrice} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 700 }}>Discard</Button>
          <Button variant="contained" onClick={handleCreateModel} disabled={actionLoading} sx={{ borderRadius: 3, px: 4, minWidth: 140 }}>
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Register Model'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryPage;
