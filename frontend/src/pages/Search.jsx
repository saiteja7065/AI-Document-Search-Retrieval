import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Divider,
  Paper,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Container,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Mic as MicIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as DocIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Placeholder data for search results
const searchResults = [
  { id: 1, title: 'Project Proposal 2023', type: 'pdf', date: '2023-11-20', snippet: 'This project proposal outlines the key objectives and milestones for the upcoming fiscal year...', relevance: 95 },
  { id: 2, title: 'Meeting Notes - Product Team', type: 'docx', date: '2023-11-18', snippet: 'During our discussion about the new feature implementation, we identified several potential challenges...', relevance: 88 },
  { id: 3, title: 'Research Paper on AI Applications', type: 'pdf', date: '2023-11-15', snippet: 'The recent advancements in artificial intelligence have opened new possibilities for document processing...', relevance: 82 },
  { id: 4, title: 'Product Roadmap Q4', type: 'pptx', date: '2023-11-10', snippet: 'Our Q4 objectives include launching the beta version of our document processing API and completing...', relevance: 75 },
  { id: 5, title: 'Customer Feedback Analysis', type: 'docx', date: '2023-11-05', snippet: 'Based on the survey responses, 78% of users found the document search functionality to be highly effective...', relevance: 70 },
];

// Function to get icon based on document type
const getDocumentIcon = (type) => {
  switch(type) {
    case 'pdf':
      return <PdfIcon fontSize="medium" color="error" />;
    case 'docx':
      return <DocIcon fontSize="medium" color="primary" />;
    case 'pptx':
      return <ImageIcon fontSize="medium" color="secondary" />;
    default:
      return <DescriptionIcon fontSize="medium" color="action" />;
  }
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState([30, 365]); // Days ago
  const [fileTypes, setFileTypes] = useState({
    pdf: true,
    docx: true,
    pptx: true,
    txt: true,
  });
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleDateRangeChange = (event, newValue) => {
    setDateRange(newValue);
  };
  
  const handleFileTypeChange = (event) => {
    setFileTypes({
      ...fileTypes,
      [event.target.name]: event.target.checked,
    });
  };
  
  const formatDateRange = (range) => {
    const [min, max] = range;
    return `${min} days to ${max} days ago`;
  };
  
  return (
    <Container maxWidth="xl">
      {/* Search Header */}
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #00D4FF 0%, #4ECCA3 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Advanced Document Search
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, maxWidth: 700 }}>
          Search through your documents using natural language. Ask questions or use keywords to find exactly what you need.
        </Typography>
        
        <Box sx={{ position: 'relative', maxWidth: 800 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search documents, ask questions, or find topics..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery && (
                    <IconButton onClick={handleClearSearch} edge="end">
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton color="primary" edge="end">
                    <MicIcon />
                  </IconButton>
                  <IconButton 
                    color={showFilters ? "primary" : "default"} 
                    edge="end"
                    onClick={toggleFilters}
                    sx={{ bgcolor: showFilters ? 'rgba(0, 0, 0, 0.04)' : 'transparent' }}
                  >
                    <FilterIcon />
                  </IconButton>
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
      </Paper>
      
      <Grid container spacing={3}>
        {/* Filters Panel */}
        {showFilters && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {/* Date Range Filter */}
              <Box sx={{ mb: 4 }}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                      Date Range
                    </Box>
                  </FormLabel>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      value={dateRange}
                      onChange={handleDateRangeChange}
                      valueLabelDisplay="auto"
                      min={1}
                      max={365}
                      valueLabelFormat={(value) => `${value} days ago`}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatDateRange(dateRange)}
                    </Typography>
                  </Box>
                </FormControl>
              </Box>
              
              {/* File Type Filter */}
              <Box sx={{ mb: 4 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                    File Types
                  </FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={fileTypes.pdf} onChange={handleFileTypeChange} name="pdf" />}
                      label={<Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PdfIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                        PDF Files
                      </Box>}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={fileTypes.docx} onChange={handleFileTypeChange} name="docx" />}
                      label={<Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DocIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        Word Documents
                      </Box>}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={fileTypes.pptx} onChange={handleFileTypeChange} name="pptx" />}
                      label={<Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ImageIcon fontSize="small" color="secondary" sx={{ mr: 1 }} />
                        Presentations
                      </Box>}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={fileTypes.txt} onChange={handleFileTypeChange} name="txt" />}
                      label={<Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DescriptionIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                        Text Files
                      </Box>}
                    />
                  </FormGroup>
                </FormControl>
              </Box>
              
              <Button variant="outlined" fullWidth>Reset Filters</Button>
            </Paper>
          </Grid>
        )}
        
        {/* Search Results */}
        <Grid item xs={12} md={showFilters ? 9 : 12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" component="h2">
              Search Results
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {searchResults.length} results
            </Typography>
          </Box>
          
          <Stack spacing={2}>
            {searchResults.map((result) => (
              <Card key={result.id} sx={{ 
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                }
              }}>
                <CardActionArea component={RouterLink} to={`/document/${result.id}`}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getDocumentIcon(result.type)}
                      <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                        {result.title}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Chip 
                        label={`${result.relevance}% match`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {result.date} • {result.type.toUpperCase()}
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      {result.snippet}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label="View" size="small" color="primary" />
                      <Chip label="Summary" size="small" variant="outlined" />
                      <Chip label="Related" size="small" variant="outlined" />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;