import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/Apibaseurl';

export default function ViewInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setInventory(data);
        } else {
          setError(data.message || 'Failed to load inventory');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [token, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: { xs: 4, md: 8 }, px: 2 }}>
      <Paper elevation={6} sx={{ p: { xs: 4, md: 6 } }}>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          Current Inventory
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {inventory.length === 0 ? (
          <Alert severity="info" sx={{ mt: 3 }}>
            No items in inventory yet. Start by recording a donation.
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Item Name</strong></TableCell>
                  <TableCell align="center"><strong>Total Received</strong></TableCell>
                  <TableCell align="center"><strong>Distributed</strong></TableCell>
                  <TableCell align="center"><strong>Remaining</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.itemName} hover>
                    <TableCell component="th" scope="row">
                      <Typography fontWeight={600}>{item.itemName}</Typography>
                    </TableCell>
                    <TableCell align="center">{item.received}</TableCell>
                    <TableCell align="center">{item.distributed}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: item.remaining === 0 ? 'error.main' : 'success.main' }}>
                      {item.remaining}
                    </TableCell>
                    <TableCell align="center">
                      {item.remaining === 0 ? (
                        <Chip label="Depleted" color="error" size="small" />
                      ) : item.remaining <= 20 ? (
                        <Chip label="Low Stock" color="warning" size="small" />
                      ) : (
                        <Chip label="Available" color="success" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/admin')}
            sx={{ px: 6, py: 1.5 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}