import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Button,
  TextField,
  InputAdornment,
  Container,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Upload as UploadIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as DocIcon,
  Image as ImageIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Placeholder data for recent documents
const recentDocuments = [
  { id: 1, title: 'Project Proposal', type: 'pdf', date: '2023-11-20' },
  { id: 2, title: 'Meeting Notes', type: 'docx', date: '2023-11-18' },
  { id: 3, title: 'Research Paper', type: 'pdf', date: '2023-11-15' },
  { id: 4, title: 'Product Roadmap', type: 'pptx', date: '2023-11-10' },
];

// Function to get icon based on document type
const getDocumentIcon = (type) => {
  switch(type) {
    case 'pdf':
      return <PdfIcon fontSize="large" color="error" />;
    case 'docx':
      return <DocIcon fontSize="large" color="primary" />;
    case 'pptx':
      return <ImageIcon fontSize="large" color="secondary" />;
    default:
      return <DescriptionIcon fontSize="large" color="action" />;
  }
};

const Dashboard = () => {
  return (
    <Container maxWidth="xl">
      {/* Hero Section with Search */}
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          mt: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #6610F2 0%, #311B92 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          }}
        />
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Welcome to DocuAI
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, maxWidth: 600 }}>
          Search through your documents using natural language
        </Typography>
        
        <Box sx={{ maxWidth: 600, position: 'relative', zIndex: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask a question about your documents..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              sx: {
                bgcolor: 'background.paper',
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
              },
            }}
          />
        </Box>
        
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip label="Project Proposals" variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'transparent' }} />
          <Chip label="Research Papers" variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'transparent' }} />
          <Chip label="Meeting Notes" variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'transparent' }} />
        </Stack>
      </Paper>
      
      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea 
                component={RouterLink} 
                to="/upload"
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.light', 
                      color: 'white',
                      mb: 2,
                    }}
                  >
                    <UploadIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6" component="div">
                    Upload Documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add new documents to your library
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea 
                component={RouterLink} 
                to="/search"
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: '50%', 
                      bgcolor: 'secondary.main', 
                      color: 'white',
                      mb: 2,
                    }}
                  >
                    <SearchIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6" component="div">
                    Advanced Search
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Search with filters and advanced options
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea 
                component={RouterLink} 
                to="/dashboard/recent"
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: '50%', 
                      bgcolor: 'info.main', 
                      color: 'white',
                      mb: 2,
                    }}
                  >
                    <DescriptionIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6" component="div">
                    Recent Documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View your recently accessed documents
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea 
                component={RouterLink} 
                to="/dashboard/favorites"
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: '50%', 
                      bgcolor: 'error.main', 
                      color: 'white',
                      mb: 2,
                    }}
                  >
                    <AddIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6" component="div">
                    Favorites
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access your favorite documents quickly
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Recent Documents */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Recent Documents
          </Typography>
          <Button 
            component={RouterLink} 
            to="/dashboard/recent"
            endIcon={<DescriptionIcon />}
            variant="text"
          >
            View All
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          {recentDocuments.map((doc) => (
            <Grid item xs={12} sm={6} md={3} key={doc.id}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}>
                <CardActionArea 
                  component={RouterLink} 
                  to={`/document/${doc.id}`}
                  sx={{ height: '100%', p: 2 }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getDocumentIcon(doc.type)}
                      <Chip 
                        label={doc.type.toUpperCase()} 
                        size="small" 
                        sx={{ ml: 1 }} 
                        color={doc.type === 'pdf' ? 'error' : doc.type === 'docx' ? 'primary' : 'secondary'}
                      />
                    </Box>
                    <Typography variant="h6" component="div" gutterBottom noWrap>
                      {doc.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last modified: {doc.date}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Stats Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Document Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.light', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">24</Typography>
              <Typography variant="body1">Total Documents</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'secondary.main', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">12</Typography>
              <Typography variant="body1">PDF Files</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'info.main', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">8</Typography>
              <Typography variant="body1">Word Documents</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'error.main', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">4</Typography>
              <Typography variant="body1">Presentations</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;