import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Avatar, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  MenuItem,
  IconButton,
  Skeleton,
  CircularProgress,
  Divider
} from '@mui/material';
import { Truck, Plus, Mail, Phone, Trash2, Edit2, ShieldCheck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const SuppliersPage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    division: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    category: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/suppliers');
      setSuppliers(data);
    } catch (err) {
      toast.error('Failed to sync supplier database');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleOpen = (supplier?: any) => {
    if (supplier) {
      setNewSupplier(supplier);
      setSelectedId(supplier._id);
      setEditMode(true);
    } else {
      setNewSupplier({ name: '', division: 'JAC MOTORS HQ', contactPerson: '', email: '', phone: '', country: 'China', category: 'Vehicle' });
      setSelectedId(null);
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!newSupplier.name || !newSupplier.email) return toast.error('Name and Email are required');
    
    // Strip immutable fields if they exist
    const { _id, __v, createdAt, updatedAt, ...payload } = newSupplier as any;
    
    try {
      setActionLoading(true);
      if (editMode && selectedId) {
        await API.patch(`/suppliers/${selectedId}`, payload);
        toast.success(`${payload.name} profile updated`);
      } else {
        await API.post('/suppliers', payload);
        toast.success(`${payload.name} registered as partner`);
      }
      setOpen(false);
      fetchSuppliers();
    } catch (err) {
      console.error('API Error:', err);
      toast.error('Transaction failed. Check console.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Terminate partnership with ${name}? This action is permanent.`)) {
      try {
        await API.delete(`/suppliers/${id}`);
        toast.success('Supplier removed from database');
        fetchSuppliers();
      } catch (err) {
        toast.error('De-registration failed');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>Strategic Partners</Typography>
          <Typography variant="body1" color="text.secondary">Global suppliers & commitment management</Typography>
        </Box>
        {user.role === 'superadmin' && (
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => handleOpen()} sx={{ borderRadius: 3, height: 44, px: 3 }}>
            Onboard Supplier
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          [1,2,3].map(i => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 4 }} />
            </Grid>
          ))
        ) : suppliers.length > 0 ? (
          suppliers.map((supplier) => (
            <Grid size={{ xs: 12, md: 4 }} key={supplier._id}>
              <Card sx={{ height: '100%', borderRadius: 4, border: '1px solid #E2E8F0', transition: 'all 0.2s', '&:hover': { boxShadow: '0 12px 20px -5px rgba(0,0,0,0.08)' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.light', color: 'primary.main' }}>
                        <Truck size={24} />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>{supplier.name}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, px: 1, py: 0.3, bgcolor: '#F1F5F9', borderRadius: 1.5, color: 'primary.main', display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <ShieldCheck size={10} /> {supplier.division}
                        </Typography>
                      </Box>
                    </Box>
                    {user.role === 'superadmin' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleOpen(supplier)} sx={{ color: 'white', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 1.5 }}>
                          <Edit2 size={16} />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(supplier._id, supplier.name)} sx={{ color: 'white', bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' }, borderRadius: 1.5 }}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Mail size={16} style={{ color: '#64748B' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{supplier.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Phone size={16} style={{ color: '#64748B' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{supplier.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <MapPin size={16} style={{ color: '#64748B' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{supplier.country}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2.5 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>Category</Typography>
                      <Chip label={supplier.category} size="small" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>Contract State</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'success.main' }}>Active Partner</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 4, border: '1px dashed #E2E8F0' }}>
              <Typography variant="h4" color="text.secondary">No partners onboarded yet.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Supplier Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 4 } } }}>
        <DialogTitle sx={{ fontWeight: 800, px: 3, pt: 3 }}>
          {editMode ? 'Update Partner Profile' : 'Onboard Strategic Partner'}
        </DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField label="Company Name" fullWidth size="small" value={newSupplier.name} onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})} />
            <TextField select label="Business Division" fullWidth size="small" value={newSupplier.division || ''} onChange={(e) => setNewSupplier({...newSupplier, division: e.target.value})}>
              <MenuItem value="">Select Division</MenuItem>
              <MenuItem value="LCV">Light Commercial (LCV)</MenuItem>
              <MenuItem value="Passenger">Passenger Cars (PC)</MenuItem>
              <MenuItem value="Heavy">Heavy Trucks (HT)</MenuItem>
              <MenuItem value="Special">Special Machinery (SM)</MenuItem>
            </TextField>
            <TextField label="Contact Person" fullWidth size="small" value={newSupplier.contactPerson || ''} onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})} />
            <TextField label="Email Address" fullWidth size="small" value={newSupplier.email || ''} onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})} />
            <TextField label="Mobile Number" fullWidth size="small" value={newSupplier.phone || ''} onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})} />
            <TextField label="Country" fullWidth size="small" value={newSupplier.country || ''} onChange={(e) => setNewSupplier({...newSupplier, country: e.target.value})} />
            <TextField label="Category" fullWidth size="small" value={newSupplier.category} onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})} placeholder="e.g. Passenger Vehicle" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={actionLoading} sx={{ borderRadius: 3, px: 4, minWidth: 140 }}>
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : editMode ? 'Save Changes' : 'Confirm Onboarding'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuppliersPage;
