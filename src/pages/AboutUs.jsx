import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const features = [
  { title: 'Track Donations', description: 'Easily log and monitor all contributions in real time.' },
  { title: 'Generate Reports', description: 'Export detailed donation reports for transparency.' },
  { title: 'Contributions', description: 'Interactive charts to see donation trends.' },
  { title: 'Secure & Intuitive', description: 'Safe, intuitive interface for all users.' },
];

const AboutUs = () => {
  return (
    <Box sx={{
      p: { xs: 2, md: 5 },
      bgcolor: '#f7f7fa',
      minHeight: '100vh',
      borderRadius: 3,
      boxShadow: 2,
    }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#222', mb: 2 }}>
        About Us
      </Typography>
      <Typography variant="body1" sx={{ mb: 5, color: '#444', maxWidth: 700 }}>
        Our mission is to make donation tracking simple and transparent for small organizations and school clubs.<br />
        With our app, every contribution is recorded, tracked, and visualized to help manage funds effectively.
      </Typography>
      <Box sx={{ width: 80, height: 4, bgcolor: 'primary.main', borderRadius: 2, mx: 'auto', mb: 5 }} />
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333', mb: 3 }}>
        What We Do
      </Typography>
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 5 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: '#fff',
              transition: 'box-shadow 0.3s, transform 0.3s',
              '&:hover': { boxShadow: 8, transform: 'translateY(-6px) scale(1.04)' },
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Typography variant="subtitle1" sx={{ color: '#666', mt: 6, fontStyle: 'italic' }}>
        Together, we make every donation count.
      </Typography>
    </Box>
  );
};

export default AboutUs;