from flask import Blueprint, request, jsonify, current_app
import openai
from models.document import Document
from middleware.auth_middleware import authenticate_token

ai_bp = Blueprint('ai', __name__)

# Initialize OpenAI client
openai.api_key = current_app.config.get('OPENAI_API_KEY')

@ai_bp.route('/summarize/<document_id>', methods=['POST'])
@authenticate_token
def summarize_document(document_id):
    try:
        # Find document
        document = Document.find_one({
            '_id': document_id,
            'owner': request.user.get('userId')
        })
        
        if not document:
            return jsonify({'message': 'Document not found'}), 404
        
        # If summary already exists, return it
        if document.get('summary'):
            return jsonify({'summary': document['summary']})
        
        # Generate summary using OpenAI
        content = document['content'][:10000]  # Limit content length for API
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes documents."},
                {"role": "user", "content": f"Please provide a concise summary of the following document: {content}"}
            ],
            max_tokens=500
        )
        
        summary = response.choices[0].message.content.strip()
        
        # Update document with summary
        Document.update_one(
            {'_id': document_id},
            {'summary': summary}
        )
        
        return jsonify({'summary': summary})
    
    except Exception as e:
        print(f'Summarize document error: {e}')
        return jsonify({'message': 'Server error while summarizing document'}), 500


@ai_bp.route('/extract-key-points/<document_id>', methods=['POST'])
@authenticate_token
def extract_key_points(document_id):
    try:
        # Find document
        document = Document.find_one({
            '_id': document_id,
            'owner': request.user.get('userId')
        })
        
        if not document:
            return jsonify({'message': 'Document not found'}), 404
        
        # If key points already exist, return them
        if document.get('keyPoints') and len(document['keyPoints']) > 0:
            return jsonify({'keyPoints': document['keyPoints']})
        
        # Extract key points using OpenAI
        content = document['content'][:10000]  # Limit content length for API
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that extracts key points from documents."},
                {"role": "user", "content": f"Please extract 5-10 key points from the following document and format them as a JSON array of strings: {content}"}
            ],
            max_tokens=1000
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Parse key points from response
        import re
        import json
        
        key_points = []
        try:
            # Try to extract JSON array from response
            json_match = re.search(r'\[([^\]]*)\]', response_text)
            if json_match:
                key_points = json.loads(json_match.group(0))
            else:
                # Fallback: split by newlines and clean up
                key_points = [line.replace(r'^\d+\.\s*|^-\s*|^\*\s*', '', 1).strip()
                              for line in response_text.split('\n')
                              if line.strip()]
        except Exception as e:
            print(f'Error parsing key points: {e}')
            key_points = [response_text]
        
        # Update document with key points
        Document.update_one(
            {'_id': document_id},
            {'keyPoints': key_points}
        )
        
        return jsonify({'keyPoints': key_points})
    
    except Exception as e:
        print(f'Extract key points error: {e}')
        return jsonify({'message': 'Server error while extracting key points'}), 500


@ai_bp.route('/generate-tags/<document_id>', methods=['POST'])
@authenticate_token
def generate_tags(document_id):
    try:
        # Find document
        document = Document.find_one({
            '_id': document_id,
            'owner': request.user.get('userId')
        })
        
        if not document:
            return jsonify({'message': 'Document not found'}), 404
        
        # Generate tags using OpenAI
        content = document['content'][:10000]  # Limit content length for API
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates relevant tags for documents."},
                {"role": "user", "content": f"Please generate 5-10 relevant tags for the following document. Return only a JSON array of tag strings without any explanation: {content}"}
            ],
            max_tokens=500
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Parse tags from response
        import re
        import json
        
        tags = []
        try:
            # Try to extract JSON array from response
            json_match = re.search(r'\[([^\]]*)\]', response_text)
            if json_match:
                tags = json.loads(json_match.group(0))
            else:
                # Fallback: split by commas or newlines
                tags = [tag.strip() for tag in re.split(r'[,\n]', response_text) if tag.strip()]
        except Exception as e:
            print(f'Error parsing tags: {e}')
            tags = []
        
        # Update document with tags
        Document.update_one(
            {'_id': document_id},
            {'tags': tags}
        )
        
        return jsonify({'tags': tags})
    
    except Exception as e:
        print(f'Generate tags error: {e}')
        return jsonify({'message': 'Server error while generating tags'}), 500