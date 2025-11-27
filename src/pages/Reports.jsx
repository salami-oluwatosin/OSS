import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { Download, Description, PictureAsPdf } from '@mui/icons-material';
import API_BASE_URL from '../config/Apibaseurl';

export default function Reports() {
  const [csvLoading, setCsvLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleExportCSV = async () => {
    setCsvLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/reports/donations/csv`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Donations_Report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage('CSV downloaded successfully!');
      } else {
        setMessage('Failed to generate CSV');
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setCsvLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setPdfLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/reports/donations/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Donations_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage('PDF downloaded successfully!');
      } else {
        setMessage('Failed to generate PDF');
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: { xs: 6, md: 10 }, px: 2 }}>
      <Paper elevation={6} sx={{ p: { xs: 4, md: 6 } }}>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          Reports & Exports
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ mb: 5 }}>
          Download complete donation records in your preferred format
        </Typography>

        <Stack spacing={3} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={csvLoading ? <CircularProgress size={20} /> : <Description />}
            onClick={handleExportCSV}
            disabled={csvLoading || pdfLoading}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              bgcolor: '#1e88e5',
              '&:hover': { bgcolor: '#1565c0' },
            }}
          >
            {csvLoading ? 'Generating CSV...' : 'Download CSV Report'}
          </Button>

          <Button
            variant="contained"
            size="large"
            color="error"
            startIcon={pdfLoading ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdf />}
            onClick={handleExportPDF}
            disabled={csvLoading || pdfLoading}
            sx={{
              py: 2,
              fontSize: '1.1rem',
            }}
          >
            {pdfLoading ? 'Generating PDF...' : 'Download PDF Report'}
          </Button>
        </Stack>

        {message && (
          <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mt: 4 }}>
            {message}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 6 }}>
          Reports include all recorded donations with donor, item, quantity, and date.
        </Typography>
      </Paper>
    </Box>
  );
}