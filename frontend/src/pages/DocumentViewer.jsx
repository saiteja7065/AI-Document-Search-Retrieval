import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Tabs,
  Tab,
  Divider,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as DocIcon,
  Image as ImageIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Summarize as SummarizeIcon,
  FindInPage as FindInPageIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Placeholder document data
const documentData = {
  id: 1,
  title: 'Project Proposal 2023',
  type: 'pdf',
  date: '2023-11-20',
  author: 'John Smith',
  size: '2.4 MB',
  pages: 12,
  content: 'This is a sample document content. In a real application, this would be the actual text extracted from the document.',
  summary: 'This project proposal outlines the key objectives, timeline, and resource requirements for the upcoming AI-powered document search system. The proposal includes market analysis, technical specifications, and expected outcomes.',
  keyPoints: [
    'Implementation of semantic search capabilities',
    'Document summarization using AI',
    'Multi-format document support',
    'User-friendly interface design',
    'Scalable architecture for future growth',
  ],
  relatedDocuments: [
    { id: 2, title: 'Previous Project Proposal', type: 'pdf', relevance: 92 },
    { id: 3, title: 'Market Research Report', type: 'docx', relevance: 85 },
    { id: 4, title: 'Technical Requirements', type: 'pdf', relevance: 78 },
  ],
};

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

const DocumentViewer = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // In a real app, you would fetch the document data based on the ID
  // For now, we'll use the placeholder data
  const document = documentData;
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  return (
    <Container maxWidth="xl">
      {/* Header with navigation */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button 
          component={RouterLink} 
          to="/dashboard" 
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Document Viewer
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Document Info Panel */}
        <Grid item xs={12} md={4} lg={3}>
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getDocumentIcon(document.type)}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" component="div">
                    {document.title}
                  </Typography>
                  <Chip 
                    label={document.type.toUpperCase()} 
                    size="small" 
                    color={document.type === 'pdf' ? 'error' : document.type === 'docx' ? 'primary' : 'secondary'}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Date</Typography>
                  <Typography variant="body1">{document.date}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Author</Typography>
                  <Typography variant="body1">{document.author}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Size</Typography>
                  <Typography variant="body1">{document.size}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Pages</Typography>
                  <Typography variant="body1">{document.pages}</Typography>
                </Box>
              </Stack>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="contained" 
                  startIcon={<DownloadIcon />}
                  fullWidth
                >
                  Download
                </Button>
                
                <IconButton onClick={toggleFavorite} color={isFavorite ? 'error' : 'default'}>
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
          
          {/* AI Features Card */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Features
              </Typography>
              
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<SummarizeIcon />}
                sx={{ mb: 1.5 }}
                onClick={() => setActiveTab(1)}
              >
                Generate Summary
              </Button>
              
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<FindInPageIcon />}
                sx={{ mb: 1.5 }}
              >
                Extract Key Points
              </Button>
              
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<LinkIcon />}
                onClick={() => setActiveTab(2)}
              >
                Find Related Documents
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Document Content Panel */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Tabs */}
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Tab label="Document" icon={<DescriptionIcon />} iconPosition="start" />
              <Tab label="Summary" icon={<SummarizeIcon />} iconPosition="start" />
              <Tab label="Related" icon={<LinkIcon />} iconPosition="start" />
            </Tabs>
            
            {/* Tab Content */}
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {document.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {document.content}
                  </Typography>
                  
                  {/* In a real app, this would be the actual document viewer */}
                  <Box 
                    sx={{ 
                      height: 500, 
                      bgcolor: 'background.default', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Document preview would be displayed here
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Document Summary
                  </Typography>
                  
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      borderRadius: 2,
                      bgcolor: 'rgba(102, 16, 242, 0.03)',
                    }}
                  >
                    <Typography variant="body1">
                      {document.summary}
                    </Typography>
                  </Paper>
                  
                  <Typography variant="h6" gutterBottom>
                    Key Points
                  </Typography>
                  
                  <Box component="ul" sx={{ pl: 2 }}>
                    {document.keyPoints.map((point, index) => (
                      <Typography component="li" key={index} paragraph>
                        {point}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
              
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Related Documents
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    These documents are semantically related to the current document.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {document.relatedDocuments.map((relDoc) => (
                      <Grid item xs={12} sm={6} md={4} key={relDoc.id}>
                        <Card sx={{ 
                          height: '100%',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                          }
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              {getDocumentIcon(relDoc.type)}
                              <Chip 
                                label={`${relDoc.relevance}% match`} 
                                size="small" 
                                color="primary" 
                                sx={{ ml: 1 }} 
                              />
                            </Box>
                            <Typography variant="h6" component="div" gutterBottom noWrap>
                              {relDoc.title}
                            </Typography>
                            <Button 
                              component={RouterLink} 
                              to={`/document/${relDoc.id}`}
                              variant="outlined" 
                              size="small" 
                              fullWidth
                            >
                              View Document
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DocumentViewer;