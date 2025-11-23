import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import API_BASE_URL from '../config/Apibaseurl'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      })

      const data = await response.json()

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token)
        setSuccess('Account created! Taking you to login...')
        setTimeout(() => navigate('/login'), 1500)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Full error details:', err)
      setError(`Network error: ${err.message}. Is backend reachable? Check console.`)
    }
  }


  const testAPI = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'debug', password: 'debug' })
      })
      console.log('Status:', res.status, 'Response:', await res.text())
      alert(`Status: ${res.status} - Check console for details`)
    } catch (e) {
      console.error('Test failed:', e)
      alert(`Error: ${e.message}`)
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, maxWidth: 420, width: '100%' }}>
        <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          {success && <Typography color="success.main" sx={{ mt: 1, fontWeight: 500 }}>{success}</Typography>}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            sx={{ mt: 3, py: 1.4, fontWeight: 600 }}
          >
            Create Account
          </Button>
          <Button onClick={testAPI} variant="outlined" fullWidth sx={{ mt: 2 }}>
            Test API Reachability
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}