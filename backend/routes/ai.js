import express from 'express';
import { OpenAI } from 'openai';
import Document from '../models/Document.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate document summary
router.post('/summarize/:documentId', authenticateToken, async (req, res) => {
  try {
    // Find document
    const document = await Document.findOne({
      _id: req.params.documentId,
      owner: req.user.userId
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // If summary already exists, return it
    if (document.summary) {
      return res.json({ summary: document.summary });
    }
    
    // Generate summary using OpenAI
    const content = document.content.substring(0, 10000); // Limit content length for API
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes documents." },
        { role: "user", content: `Please provide a concise summary of the following document: ${content}` }
      ],
      max_tokens: 500,
    });
    
    const summary = completion.choices[0].message.content.trim();
    
    // Update document with summary
    document.summary = summary;
    await document.save();
    
    res.json({ summary });
  } catch (error) {
    console.error('Summarize document error:', error);
    res.status(500).json({ message: 'Server error while summarizing document' });
  }
});

// Extract key points from document
router.post('/extract-key-points/:documentId', authenticateToken, async (req, res) => {
  try {
    // Find document
    const document = await Document.findOne({
      _id: req.params.documentId,
      owner: req.user.userId
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // If key points already exist, return them
    if (document.keyPoints && document.keyPoints.length > 0) {
      return res.json({ keyPoints: document.keyPoints });
    }
    
    // Extract key points using OpenAI
    const content = document.content.substring(0, 10000); // Limit content length for API
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that extracts key points from documents." },
        { role: "user", content: `Please extract 5-10 key points from the following document and format them as a JSON array of strings: ${content}` }
      ],
      max_tokens: 1000,
    });
    
    const response = completion.choices[0].message.content.trim();
    
    // Parse key points from response
    let keyPoints = [];
    try {
      // Try to extract JSON array from response
      const jsonMatch = response.match(/\[([^\]]*)\]/);
      if (jsonMatch) {
        keyPoints = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by newlines and clean up
        keyPoints = response.split('\n')
          .map(line => line.replace(/^\d+\.\s*|^-\s*|^\*\s*/, '').trim())
          .filter(line => line.length > 0);
      }
    } catch (parseError) {
      console.error('Error parsing key points:', parseError);
      // Fallback: split by newlines and clean up
      keyPoints = response.split('\n')
        .map(line => line.replace(/^\d+\.\s*|^-\s*|^\*\s*/, '').trim())
        .filter(line => line.length > 0);
    }
    
    // Update document with key points
    document.keyPoints = keyPoints;
    await document.save();
    
    res.json({ keyPoints });
  } catch (error) {
    console.error('Extract key points error:', error);
    res.status(500).json({ message: 'Server error while extracting key points' });
  }
});

// Semantic search across documents
router.post('/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // First, get documents that match the query using MongoDB text search
    const documents = await Document.find({
      $text: { $search: query },
      owner: req.user.userId
    })
    .select('_id title content fileType createdAt')
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);
    
    // If no documents found with text search, try semantic search with OpenAI
    if (documents.length === 0) {
      // Get all user documents (limit to recent ones for performance)
      const userDocuments = await Document.find({ owner: req.user.userId })
        .select('_id title content fileType createdAt')
        .sort({ createdAt: -1 })
        .limit(20);
      
      if (userDocuments.length === 0) {
        return res.json({ results: [] });
      }
      
      // Use OpenAI to find relevant documents
      const documentsWithSnippets = await Promise.all(
        userDocuments.map(async (doc) => {
          // Create a shortened version of content for embedding
          const shortContent = doc.content.substring(0, 1000);
          
          // Use OpenAI to determine relevance and extract snippet
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant that determines if a document is relevant to a query and extracts the most relevant snippet." },
              { role: "user", content: `Query: ${query}\n\nDocument: ${shortContent}\n\nIs this document relevant to the query? If yes, extract the most relevant snippet (up to 200 characters). Respond in JSON format with 'relevant' (boolean) and 'snippet' (string).` }
            ],
            max_tokens: 300,
          });
          
          const response = completion.choices[0].message.content.trim();
          
          // Parse response
          let relevance = { relevant: false, snippet: '' };
          try {
            // Try to parse JSON response
            relevance = JSON.parse(response);
          } catch (parseError) {
            console.error('Error parsing relevance response:', parseError);
            // Check if response contains 'yes' or 'relevant'
            if (response.toLowerCase().includes('yes') || response.toLowerCase().includes('relevant')) {
              relevance.relevant = true;
              // Extract a snippet (simple approach)
              relevance.snippet = shortContent.substring(0, 200) + '...';
            }
          }
          
          return {
            _id: doc._id,
            title: doc.title,
            fileType: doc.fileType,
            createdAt: doc.createdAt,
            relevant: relevance.relevant,
            snippet: relevance.snippet
          };
        })
      );
      
      // Filter to only relevant documents
      const relevantDocuments = documentsWithSnippets.filter(doc => doc.relevant);
      
      return res.json({ results: relevantDocuments });
    }
    
    // For text search results, extract snippets
    const results = documents.map(doc => {
      // Find a relevant snippet containing the query terms
      const terms = query.split(' ').filter(term => term.length > 3);
      let snippet = '';
      
      if (terms.length > 0) {
        // Try to find a section of text containing query terms
        const content = doc.content;
        for (const term of terms) {
          const index = content.toLowerCase().indexOf(term.toLowerCase());
          if (index !== -1) {
            // Extract text around the term
            const start = Math.max(0, index - 100);
            const end = Math.min(content.length, index + term.length + 100);
            snippet = content.substring(start, end) + '...';
            break;
          }
        }
      }
      
      // If no snippet found, use the beginning of the document
      if (!snippet) {
        snippet = doc.content.substring(0, 200) + '...';
      }
      
      return {
        _id: doc._id,
        title: doc.title,
        fileType: doc.fileType,
        createdAt: doc.createdAt,
        snippet
      };
    });
    
    res.json({ results });
  } catch (error) {
    console.error('Semantic search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

// Answer questions about a specific document
router.post('/ask/:documentId', authenticateToken, async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    
    // Find document
    const document = await Document.findOne({
      _id: req.params.documentId,
      owner: req.user.userId
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Use OpenAI to answer the question based on document content
    const content = document.content.substring(0, 10000); // Limit content length for API
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that answers questions about documents based only on their content." },
        { role: "user", content: `Document: ${content}\n\nQuestion: ${question}\n\nPlease answer the question based only on the information provided in the document. If the answer cannot be found in the document, say so.` }
      ],
      max_tokens: 500,
    });
    
    const answer = completion.choices[0].message.content.trim();
    
    res.json({ answer });
  } catch (error) {
    console.error('Document Q&A error:', error);
    res.status(500).json({ message: 'Server error while answering question' });
  }
});

export default router;