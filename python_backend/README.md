# AI Document Web App - Python Backend

This is the Python backend for the AI Document Web App, which provides API endpoints for document management, user authentication, and AI-powered document analysis.

## Features

- User authentication (register, login, profile management)
- Document management (upload, search, view, update, delete)
- AI-powered document analysis (summarization, key point extraction, tag generation)
- Admin user management

## Tech Stack

- **Framework**: Flask
- **Database**: MongoDB
- **Authentication**: JWT
- **Document Processing**: PyPDF2, python-docx
- **AI Integration**: OpenAI API

## Project Structure

```
python_backend/
├── app.py                  # Main application entry point
├── middleware/             # Authentication middleware
├── models/                 # Database models
├── routes/                 # API routes
├── utils/                  # Utility functions
├── uploads/                # Document storage directory
└── requirements.txt        # Python dependencies
```

## Setup Instructions

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=mongodb://localhost:27017/ai-document-app
   OPENAI_API_KEY=your_openai_api_key
   PORT=5000
   ```

5. Run the application:
   ```
   python app.py
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Documents
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents` - Get all documents for current user
- `GET /api/documents/:id` - Get document by ID
- `PATCH /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### AI Features
- `POST /api/ai/summarize/:id` - Generate document summary
- `POST /api/ai/extract-key-points/:id` - Extract key points from document
- `POST /api/ai/generate-tags/:id` - Generate tags for document

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password

### Admin Routes
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PATCH /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)