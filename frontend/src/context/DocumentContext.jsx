import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create document context
const DocumentContext = createContext(null);

// Provider component
export const DocumentProvider = ({ children }) => {
  const { api, isSignedIn } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [favoriteDocuments, setFavoriteDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recent documents when user is signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchRecentDocuments();
    }
  }, [isSignedIn]);

  // Fetch recent documents
  const fetchRecentDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/documents?sort=newest&limit=5');
      setRecentDocuments(response.data.documents);
    } catch (err) {
      console.error('Error fetching recent documents:', err);
      setError('Failed to fetch recent documents');
      // Use placeholder data for demo
      setRecentDocuments([
        { _id: 1, title: 'Project Proposal', fileType: 'pdf', createdAt: '2023-11-20' },
        { _id: 2, title: 'Meeting Notes', fileType: 'docx', createdAt: '2023-11-18' },
        { _id: 3, title: 'Research Paper', fileType: 'pdf', createdAt: '2023-11-15' },
        { _id: 4, title: 'Product Roadmap', fileType: 'pptx', createdAt: '2023-11-10' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorite documents
  const fetchFavoriteDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/documents?favorite=true&sort=newest');
      setFavoriteDocuments(response.data.documents);
    } catch (err) {
      console.error('Error fetching favorite documents:', err);
      setError('Failed to fetch favorite documents');
      // Use placeholder data for demo
      setFavoriteDocuments([
        { _id: 1, title: 'Project Proposal', fileType: 'pdf', createdAt: '2023-11-20' },
        { _id: 3, title: 'Research Paper', fileType: 'pdf', createdAt: '2023-11-15' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Search documents
  const searchDocuments = async (query, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (filters.fileType) params.append('type', filters.fileType);
      if (filters.favorite) params.append('favorite', 'true');
      if (filters.sort) params.append('sort', filters.sort);
      
      const response = await api.get(`/documents?${params.toString()}`);
      setDocuments(response.data.documents);
      return response.data;
    } catch (err) {
      console.error('Error searching documents:', err);
      setError('Failed to search documents');
      // Use placeholder data for demo
      const placeholderResults = [
        { _id: 1, title: 'Project Proposal 2023', fileType: 'pdf', createdAt: '2023-11-20', snippet: 'This project proposal outlines the key objectives...' },
        { _id: 2, title: 'Meeting Notes - Product Team', fileType: 'docx', createdAt: '2023-11-18', snippet: 'During our discussion about the new feature...' },
        { _id: 3, title: 'Research Paper on AI Applications', fileType: 'pdf', createdAt: '2023-11-15', snippet: 'The recent advancements in artificial intelligence...' },
      ];
      setDocuments(placeholderResults);
      return { documents: placeholderResults, pagination: { total: 3, page: 1, pages: 1 } };
    } finally {
      setLoading(false);
    }
  };

  // Semantic search using AI
  const semanticSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/ai/search', { query });
      return response.data.results;
    } catch (err) {
      console.error('Error performing semantic search:', err);
      setError('Failed to perform semantic search');
      // Return empty results for demo
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Upload document
  const uploadDocument = async (formData, onProgress) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) onProgress(percentCompleted);
        },
      });
      return response.data;
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get document by ID
  const getDocument = async (documentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/documents/${documentId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to fetch document');
      // Return placeholder data for demo
      return {
        _id: documentId,
        title: 'Project Proposal 2023',
        fileType: 'pdf',
        createdAt: '2023-11-20',
        content: 'This is a sample document content. In a real application, this would be the actual text extracted from the document.',
        summary: 'This project proposal outlines the key objectives, timeline, and resource requirements for the upcoming AI-powered document search system.',
        keyPoints: [
          'Implementation of semantic search capabilities',
          'Document summarization using AI',
          'Multi-format document support',
          'User-friendly interface design',
          'Scalable architecture for future growth',
        ],
      };
    } finally {
      setLoading(false);
    }
  };

  // Generate document summary using AI
  const generateSummary = async (documentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/ai/summarize/${documentId}`);
      return response.data.summary;
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Failed to generate summary');
      // Return placeholder summary for demo
      return 'This is a placeholder summary generated for demo purposes. In a real application, this would be generated by AI based on the document content.';
    } finally {
      setLoading(false);
    }
  };

  // Extract key points using AI
  const extractKeyPoints = async (documentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/ai/extract-key-points/${documentId}`);
      return response.data.keyPoints;
    } catch (err) {
      console.error('Error extracting key points:', err);
      setError('Failed to extract key points');
      // Return placeholder key points for demo
      return [
        'This is a placeholder key point for demo purposes.',
        'In a real application, these would be extracted by AI.',
        'Key points highlight the most important information in the document.',
        'They help users quickly understand the document content.',
        'AI can identify these points automatically based on content analysis.',
      ];
    } finally {
      setLoading(false);
    }
  };

  // Ask questions about a document using AI
  const askQuestion = async (documentId, question) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/ai/ask/${documentId}`, { question });
      return response.data.answer;
    } catch (err) {
      console.error('Error asking question:', err);
      setError('Failed to get answer');
      // Return placeholder answer for demo
      return 'This is a placeholder answer for demo purposes. In a real application, this would be generated by AI based on the document content and your question.';
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (documentId, isFavorite) => {
    try {
      await api.patch(`/documents/${documentId}`, { isFavorite });
      // Update local state
      if (documents.length > 0) {
        setDocuments(documents.map(doc => 
          doc._id === documentId ? { ...doc, isFavorite } : doc
        ));
      }
      if (recentDocuments.length > 0) {
        setRecentDocuments(recentDocuments.map(doc => 
          doc._id === documentId ? { ...doc, isFavorite } : doc
        ));
      }
      // If unfavoriting, remove from favorites list
      if (!isFavorite && favoriteDocuments.length > 0) {
        setFavoriteDocuments(favoriteDocuments.filter(doc => doc._id !== documentId));
      }
      return true;
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      return false;
    }
  };

  // Delete document
  const deleteDocument = async (documentId) => {
    try {
      await api.delete(`/documents/${documentId}`);
      // Update local state
      setDocuments(documents.filter(doc => doc._id !== documentId));
      setRecentDocuments(recentDocuments.filter(doc => doc._id !== documentId));
      setFavoriteDocuments(favoriteDocuments.filter(doc => doc._id !== documentId));
      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      return false;
    }
  };

  // Context value
  const value = {
    documents,
    recentDocuments,
    favoriteDocuments,
    loading,
    error,
    fetchRecentDocuments,
    fetchFavoriteDocuments,
    searchDocuments,
    semanticSearch,
    uploadDocument,
    getDocument,
    generateSummary,
    extractKeyPoints,
    askQuestion,
    toggleFavorite,
    deleteDocument,
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

// Custom hook to use the document context
export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === null) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};