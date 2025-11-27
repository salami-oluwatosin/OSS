import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/Apibaseurl';

export default function DistributionForm() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    itemName: '',
    recipient: '',
    quantity: '',
    dateGiven: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchInventory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const available = data.filter(i => i.remaining > 0);
          setItems(available.map(i => ({ label: `${i.itemName} (Remaining: ${i.remaining})`, value: i.itemName })));
        }
      } catch (err) {
        setError('Failed to load inventory');
      } finally {
        setFetching(false);
      }
    };

    fetchInventory();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, itemName: newValue ? newValue.value : '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/distributions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName: formData.itemName,
          recipient: formData.recipient.trim(),
          quantity: parseInt(formData.quantity),
          dateGiven: formData.dateGiven,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Distribution recorded successfully!');
        setFormData({
          itemName: '',
          recipient: '',
          quantity: '',
          dateGiven: new Date().toISOString().split('T')[0],
        });
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setError(data.message || 'Failed to record distribution');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: { xs: 4, md: 8 }, px: 2 }}>
      <Paper elevation={6} sx={{ p: { xs: 4, md: 6 } }}>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          Record Distribution
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <Autocomplete
            options={items}
            onChange={handleItemChange}
            renderInput={(params) => (
              <TextField {...params} label="Item Name" required />
            )}
            noOptionsText="No items with remaining stock"
          />

          <TextField
            label="Recipient (e.g. Community B, Orphanage, Individual)"
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Quantity Distributed"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{ inputProps: { min: 1 } }}
            margin="normal"
          />

          <TextField
            label="Date Given"
            name="dateGiven"
            type="date"
            value={formData.dateGiven}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || !formData.itemName}
            sx={{
              mt: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              bgcolor: '#c62828',
              '&:hover': { bgcolor: '#b71c1c' },
            }}
          >
            {loading ? <CircularProgress size={28} color="inherit" /> : 'Record Distribution'}
          </Button>

          <Button
            variant="text"
            fullWidth
            onClick={() => navigate('/admin')}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}