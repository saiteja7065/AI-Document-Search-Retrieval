from flask import Blueprint, request, jsonify, current_app
import os
import uuid
from werkzeug.utils import secure_filename
from models.document import Document
from middleware.auth_middleware import authenticate_token
from utils.document_parser import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt

document_bp = Blueprint('documents', __name__)

# Helper function to check allowed file extensions
def allowed_file(filename):
    allowed_extensions = {'.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx'}
    return os.path.splitext(filename.lower())[1] in allowed_extensions

@document_bp.route('/upload', methods=['POST'])
@authenticate_token
def upload_document():
    try:
        # Check if file part exists in request
        if 'document' not in request.files:
            return jsonify({'message': 'No file part'}), 400
        
        file = request.files['document']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'message': 'No file selected'}), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({'message': 'Invalid file type. Only PDF, DOC, DOCX, TXT, PPT, and PPTX files are allowed.'}), 400
        
        # Secure filename and create unique filename
        filename = secure_filename(file.filename)
        ext = os.path.splitext(filename)[1]
        unique_filename = f"{uuid.uuid4()}{ext}"
        
        # Save file
        upload_folder = current_app.config['UPLOAD_FOLDER']
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        # Extract text based on file type
        file_type = ext[1:].lower()  # Remove the dot
        content = ''
        
        try:
            if file_type == 'pdf':
                content = extract_text_from_pdf(file_path)
            elif file_type in ['doc', 'docx']:
                content = extract_text_from_docx(file_path)
            elif file_type == 'txt':
                content = extract_text_from_txt(file_path)
            else:
                # For other file types, just store metadata
                content = 'Content extraction not supported for this file type.'
        except Exception as e:
            print(f'Error extracting content: {e}')
            content = 'Error extracting content from file.'
        
        # Get form data
        title = request.form.get('title', filename)
        tags = request.form.get('tags', '')
        
        # Create document record
        document_data = {
            'title': title,
            'originalFilename': filename,
            'fileType': file_type,
            'fileSize': os.path.getsize(file_path),
            'filePath': file_path,
            'content': content,
            'owner': request.user.get('userId'),
            'tags': [tag.strip() for tag in tags.split(',')] if tags else []
        }
        
        document = Document.create(document_data)
        
        # Convert ObjectId to string for JSON serialization
        document['_id'] = str(document['_id'])
        document['owner'] = str(document['owner'])
        
        return jsonify(document), 201
    
    except Exception as e:
        print(f'Document upload error: {e}')
        return jsonify({'message': 'Server error during document upload'}), 500


# Get all documents for current user
@document_bp.route('/', methods=['GET'])
@authenticate_token
def get_documents():
    try:
        # Get query parameters
        query = request.args.get('query', '')
        sort_by = request.args.get('sortBy', 'createdAt')
        sort_order = request.args.get('sortOrder', 'desc')
        filter_type = request.args.get('filterType', 'all')
        
        # Build query
        filters = {'owner': request.user.get('userId')}
        
        # Apply filter type
        if filter_type == 'favorites':
            filters['isFavorite'] = True
        
        # Apply search query if provided
        if query:
            # Text search in MongoDB
            documents = Document.text_search(query, filters, sort_by, sort_order == 'desc')
        else:
            # Regular find with filters
            documents = Document.find(filters, sort_by, sort_order == 'desc')
        
        # Convert ObjectId to string for JSON serialization
        for doc in documents:
            doc['_id'] = str(doc['_id'])
            doc['owner'] = str(doc['owner'])
        
        return jsonify(documents)
    
    except Exception as e:
        print(f'Get documents error: {e}')
        return jsonify({'message': 'Server error while fetching documents'}), 500


# Get document by ID
@document_bp.route('/<document_id>', methods=['GET'])
@authenticate_token
def get_document(document_id):
    try:
        document = Document.find_one({'_id': document_id, 'owner': request.user.get('userId')})
        
        if not document:
            return jsonify({'message': 'Document not found'}), 404
        
        # Convert ObjectId to string for JSON serialization
        document['_id'] = str(document['_id'])
        document['owner'] = str(document['owner'])
        
        return jsonify(document)
    
    except Exception as e:
        print(f'Get document error: {e}')
        return jsonify({'message': 'Server error while fetching document'}), 500


# Update document
@document_bp.route('/<document_id>', methods=['PATCH'])
@authenticate_token
def update_document(document_id):
    try:
        # Get request data
        data = request.json
        allowed_fields = ['title', 'tags', 'isFavorite']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        # Add updatedAt timestamp
        update_data['updatedAt'] = Document.get_current_time()
        
        # Update document
        document = Document.update_one(
            {'_id': document_id, 'owner': request.user.get('userId')},
            update_data
        )
        
        if not document:
            return jsonify({'message': 'Document not found'}), 404
        
        # Convert ObjectId to string for JSON serialization
        document['_id'] = str(document['_id'])
        document['owner'] = str(document['owner'])
        
        return jsonify(document)
    
    except Exception as e:
        print(f'Update document error: {e}')
        return jsonify({'message': 'Server error while updating document'}), 500


# Delete document
@document_bp.route('/<document_id>', methods=['DELETE'])
@authenticate_token
def delete_document(document_id):
    try:
        # Find document first to get file path
        document = Document.find_one({'_id': document_id, 'owner': request.user.get('userId')})
        
        if not document:
            return jsonify({'message': 'Document not found'}), 404
        
        # Delete file from storage
        try:
            if os.path.exists(document['filePath']):
                os.remove(document['filePath'])
        except Exception as e:
            print(f'Error deleting file: {e}')
        
        # Delete document from database
        Document.delete_one({'_id': document_id, 'owner': request.user.get('userId')})
        
        return jsonify({'message': 'Document deleted successfully'})
    
    except Exception as e:
        print(f'Delete document error: {e}')
        return jsonify({'message': 'Server error while deleting document'}), 500