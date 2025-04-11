import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load user data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setProfileImageUrl(user.profileImageUrl || '');
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    // Reset form to original values
    setFullName(user?.fullName || '');
    setProfileImageUrl(user?.profileImageUrl || '');
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Update profile
      await updateProfile({ fullName, profileImageUrl });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          component={RouterLink} 
          to="/dashboard" 
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Profile
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

        <Grid container spacing={4}>
          {/* Profile Image */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={profileImageUrl}
              alt={fullName}
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            {isEditing && (
              <TextField
                fullWidth
                label="Profile Image URL"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                margin="normal"
                helperText="Enter URL for your profile image"
                disabled={loading}
              />
            )}
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Account Information
                </Typography>
                {!isEditing ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    variant="outlined"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box>
                    <IconButton onClick={handleCancel} disabled={loading}>
                      <CancelIcon />
                    </IconButton>
                    <IconButton type="submit" color="primary" disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : <SaveIcon />}
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                margin="normal"
                disabled={!isEditing || loading}
                required
              />

              <TextField
                fullWidth
                label="Email Address"
                value={email}
                margin="normal"
                disabled={true} // Email cannot be changed
                helperText="Email address cannot be changed"
              />

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Account Security
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Button
                  component={RouterLink}
                  to="/settings"
                  variant="outlined"
                  color="primary"
                >
                  Change Password
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;