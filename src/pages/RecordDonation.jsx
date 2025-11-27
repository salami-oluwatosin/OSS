import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDonation } from '../context/DonationContext';
import API_BASE_URL from '../config/Apibaseurl';

const categories = [
  'Food',
  'Clothing',
  'Medical Supplies',
  'Educational Materials',
  'Hygiene Products',
  'Household Items',
  'Other',
];

export default function RecordDonation() {
  const [formData, setFormData] = useState({
    donorName: '',
    itemName: '',
    category: '',
    quantity: '',
    dateReceived: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { refreshSummary } = useDonation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          donorName: formData.donorName.trim(),
          itemName: formData.itemName.trim(),
          category: formData.category,
          quantity: parseInt(formData.quantity),
          dateReceived: formData.dateReceived,
        }),
      });

      if (res.ok) {
        setSuccess('Donation recorded successfully!');
        setFormData({
          donorName: '',
          itemName: '',
          category: '',
          quantity: '',
          dateReceived: new Date().toISOString().split('T')[0],
        });
        refreshSummary();
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to record donation');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: { xs: 4, md: 8 }, px: 2 }}>
      <Paper elevation={6} sx={{ p: { xs: 4, md: 6 } }}>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          Record New Donation
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <TextField label="Donor Name" name="donorName" value={formData.donorName} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Item Name" name="itemName" value={formData.itemName} onChange={handleChange} fullWidth required margin="normal" />
          <TextField select label="Category" name="category" value={formData.category} onChange={handleChange} fullWidth required margin="normal">
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} fullWidth required InputProps={{ inputProps: { min: 1 } }} margin="normal" />
          <TextField label="Date Received" name="dateReceived" type="date" value={formData.dateReceived} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} margin="normal" />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ mt: 4, py: 2, fontSize: '1.1rem', fontWeight: 600, bgcolor: 'black', '&:hover': { bgcolor: '#111' } }}>
            {loading ? <CircularProgress size={28} color="inherit" /> : 'Record Donation'}
          </Button>
          <Button variant="text" fullWidth onClick={() => navigate('/admin')} sx={{ mt: 2 }}>
            Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}