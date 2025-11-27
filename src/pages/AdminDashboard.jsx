import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useDonation } from '../context/DonationContext';

export default function AdminDashboard() {
  const { summary } = useDonation();

  const totalReceived = summary.rows.reduce((sum, r) => sum + r.received, 0);
  const totalDistributed = summary.rows.reduce((sum, r) => sum + r.distributed, 0);
  const totalRemaining = summary.rows.reduce((sum, r) => sum + r.remaining, 0);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 5, color: '#111' }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, bgcolor: '#e3f2fd', borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography color="text.secondary" fontWeight={500}>
                  Total Received
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {totalReceived}
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={900} color="#1976d2">
                INCOMING
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, bgcolor: '#fff3e0', borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography color="text.secondary" fontWeight={500}>
                  Distributed
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {totalDistributed}
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={900} color="#f57c00">
                OUTGOING
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, bgcolor: '#e8f5e9', borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography color="text.secondary" fontWeight={500}>
                  Remaining Stock
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {totalRemaining}
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={900} color="#388e3c">
                AVAILABLE
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: { xs: 4, md: 5 }, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Quick Actions
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Button
                  component={Link}
                  to="/record-donation"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    py: 2.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    bgcolor: '#1976d2',
                    '&:hover': { bgcolor: '#1565c0' },
                  }}
                >
                  + Record Donation
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  component={Link}
                  to="/record-distribution"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    py: 2.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    bgcolor: '#d32f2f',
                    '&:hover': { bgcolor: '#b71c1c' },
                  }}
                >
                  - Record Distribution
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  component={Link}
                  to="/view-inventory"
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{
                    py: 2.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2 },
                  }}
                >
                  View Full Inventory
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  component={Link}
                  to="/reports"
                  variant="outlined"
                  size="large"
                  fullWidth
                  color="secondary"
                  sx={{
                    py: 2.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2 },
                  }}
                >
                  Generate Reports
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Live Summary */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 4, height: '100%', borderRadius: 3, bgcolor: '#f8f9fa' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Live Summary
              <Chip label="Top 5 Items" size="small" sx={{ ml: 1, bgcolor: '#e3f2fd' }} />
            </Typography>

            {summary.rows.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary" variant="h6">
                  No donations recorded yet
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                  Start by recording your first donation
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2.5} sx={{ mt: 3 }}>
                {summary.rows.slice(0, 5).map((r) => (
                  <Box
                    key={r.item}
                    sx={{
                      p: 2.5,
                      bgcolor: 'white',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Typography fontWeight={700} fontSize="1.1rem">
                      {r.item}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>{r.received}</strong> received
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>{r.distributed}</strong> distributed
                      </Typography>
                    </Stack>
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={
                          r.remaining === 0
                            ? 'error.main'
                            : r.remaining < 20
                            ? 'warning.main'
                            : 'success.main'
                        }
                      >
                        {r.remaining} remaining
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}