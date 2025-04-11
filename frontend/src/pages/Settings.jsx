import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { api } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords
    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters');
    }

    setLoading(true);

    try {
      // Call API to change password
      await api.post('/users/change-password', {
        currentPassword,
        newPassword,
      });

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password changed successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          component={RouterLink} 
          to="/profile" 
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back to Profile
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Settings
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LockIcon sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2">
            Change Password
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            helperText="Password must be at least 6 characters"
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Change Password'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;