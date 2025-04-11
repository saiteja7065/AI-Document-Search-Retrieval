import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Document from '../models/Document.js';
import { authenticateToken } from '../middleware/auth.js';
import { extractTextFromPDF, extractTextFromDOCX } from '../utils/documentParser.js';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to accept only specific document types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, PPT, and PPTX files are allowed.'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload a document
router.post('/upload', authenticateToken, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, tags } = req.body;
    const fileType = path.extname(req.file.originalname).toLowerCase().substring(1);
    let content = '';

    // Extract text from document based on file type
    try {
      if (fileType === 'pdf') {
        content = await extractTextFromPDF(req.file.path);
      } else if (fileType === 'doc' || fileType === 'docx') {
        content = await extractTextFromDOCX(req.file.path);
      } else if (fileType === 'txt') {
        content = fs.readFileSync(req.file.path, 'utf8');
      } else {
        // For other file types, just store metadata
        content = 'Content extraction not supported for this file type.';
      }
    } catch (extractError) {
      console.error('Error extracting content:', extractError);
      content = 'Error extracting content from file.';
    }

    // Create document record
    const document = new Document({
      title: title || req.file.originalname,
      originalFilename: req.file.originalname,
      fileType,
      fileSize: req.file.size,
      filePath: req.file.path,
      content,
      owner: req.user.userId,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Server error during document upload' });
  }
});

// Get all documents for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { query, type, favorite, sort, limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = { owner: req.user.userId };
    
    // Add search query if provided
    if (query) {
      filter.$text = { $search: query };
    }
    
    // Add file type filter if provided
    if (type) {
      filter.fileType = type;
    }
    
    // Add favorite filter if provided
    if (favorite === 'true') {
      filter.isFavorite = true;
    }
    
    // Build sort options
    let sortOptions = {};
    if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    } else if (sort === 'relevance' && query) {
      sortOptions = { score: { $meta: 'textScore' } };
    } else {
      // Default sort by newest
      sortOptions = { createdAt: -1 };
    }
    
    // Execute query
    const documents = await Document.find(filter)
      .select('-content') // Exclude content field for performance
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();
    
    // Get total count for pagination
    const total = await Document.countDocuments(filter);
    
    res.json({
      documents,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error while fetching documents' });
  }
});

// Get a single document by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Server error while fetching document' });
  }
});

// Update document (title, tags, favorite status)
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, tags, isFavorite } = req.body;
    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (tags !== undefined) updateData.tags = tags;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    
    updateData.updatedAt = Date.now();
    
    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { $set: updateData },
      { new: true }
    );
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Server error while updating document' });
  }
});

// Delete document
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }
    
    // Delete document from database
    await Document.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error while deleting document' });
  }
});

export default router;