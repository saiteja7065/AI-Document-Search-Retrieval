import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Grid,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as DocIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Function to get icon based on file type
const getFileIcon = (fileType) => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) {
    return <PdfIcon fontSize="large" color="error" />;
  } else if (type.includes('doc') || type.includes('word')) {
    return <DocIcon fontSize="large" color="primary" />;
  } else if (type.includes('ppt') || type.includes('presentation')) {
    return <ImageIcon fontSize="large" color="secondary" />;
  } else {
    return <DescriptionIcon fontSize="large" color="action" />;
  }
};

// Function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const onDrop = useCallback((acceptedFiles) => {
    // Add progress tracking for each file
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(2, 9),
      status: 'ready', // ready, uploading, success, error
      progress: 0,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
    },
  });

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const uploadFiles = () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    // Update status of all files to uploading
    setFiles(files.map(file => ({
      ...file,
      status: 'uploading',
    })));
    
    // Simulate upload progress for each file
    files.forEach(fileObj => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Update file status to success
          setFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === fileObj.id ? { ...f, status: 'success', progress: 100 } : f
            )
          );
          
          // Check if all files are uploaded
          const allDone = files.every(f => f.id === fileObj.id || f.status === 'success');
          if (allDone) {
            setUploading(false);
            setNotification({
              open: true,
              message: 'All files uploaded successfully!',
              severity: 'success',
            });
          }
        }
        
        setUploadProgress(prev => ({
          ...prev,
          [fileObj.id]: progress,
        }));
      }, 300);
    });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="xl">
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
          Upload Documents
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* Upload Area */}
        <Grid item xs={12} md={7}>
          <Paper 
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: 'background.paper',
              height: '100%',
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Add Files
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Upload your documents to make them searchable. We support PDF, Word, PowerPoint, and text files.
            </Typography>
            
            <Box 
              {...getRootProps()} 
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'divider',
                borderRadius: 2,
                p: 4,
                mb: 3,
                textAlign: 'center',
                bgcolor: isDragActive ? 'rgba(102, 16, 242, 0.04)' : 'transparent',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(102, 16, 242, 0.04)',
                },
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon color="primary" sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
              
              {isDragActive ? (
                <Typography variant="h6" color="primary.main">
                  Drop the files here...
                </Typography>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Drag & drop files here, or click to select files
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT
                  </Typography>
                </>
              )}
            </Box>
            
            {files.length > 0 && (
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<CloudUploadIcon />}
                onClick={uploadFiles}
                disabled={uploading || files.every(f => f.status === 'success')}
                fullWidth
                size="large"
                sx={{ mb: 2 }}
              >
                {uploading ? 'Uploading...' : 'Upload All Files'}
              </Button>
            )}
            
            {/* File List */}
            {files.length > 0 && (
              <List>
                {files.map((fileObj) => (
                  <React.Fragment key={fileObj.id}>
                    <ListItem 
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        mb: 1,
                        p: 2,
                      }}
                    >
                      <ListItemIcon>
                        {getFileIcon(fileObj.file.type)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={fileObj.file.name}
                        secondary={
                          <>
                            {formatFileSize(fileObj.file.size)}
                            {fileObj.status === 'uploading' && (
                              <LinearProgress 
                                variant="determinate" 
                                value={uploadProgress[fileObj.id] || 0}
                                sx={{ mt: 1, height: 6, borderRadius: 3 }}
                              />
                            )}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        {fileObj.status === 'success' ? (
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Uploaded" 
                            color="success" 
                            size="small" 
                          />
                        ) : fileObj.status === 'error' ? (
                          <Chip 
                            icon={<ErrorIcon />} 
                            label="Error" 
                            color="error" 
                            size="small" 
                          />
                        ) : (
                          <IconButton edge="end" onClick={() => removeFile(fileObj.id)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Information Panel */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Document Processing
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body1" paragraph>
                When you upload documents, our AI system will:
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Extract text content" 
                    secondary="All text from your documents will be extracted for searching"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Generate embeddings" 
                    secondary="AI creates semantic understanding of your documents"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Index for search" 
                    secondary="Documents are indexed for fast retrieval"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Extract metadata" 
                    secondary="Information like dates, authors, and topics are identified"
                  />
                </ListItem>
              </List>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Large documents may take a few moments to process. You'll be notified when processing is complete.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Upload;