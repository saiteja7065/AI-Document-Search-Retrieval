from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from routes.auth_routes import auth_bp
from routes.document_routes import document_bp
from routes.user_routes import user_bp
from routes.ai_routes import ai_bp

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)
CORS(app)

# Configure app
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB limit
app.config['JWT_SECRET'] = os.environ.get('JWT_SECRET')
app.config['MONGODB_URI'] = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/ai-document-app')

# Create uploads directory if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Connect to MongoDB
try:
    mongo_client = MongoClient(app.config['MONGODB_URI'])
    db = mongo_client.get_database()
    app.config['DB'] = db
    print('Connected to MongoDB')
except Exception as e:
    print(f'MongoDB connection error: {e}')

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(document_bp, url_prefix='/api/documents')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(ai_bp, url_prefix='/api/ai')

# Serve uploaded files
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Root route
@app.route('/')
def index():
    return jsonify({'message': 'AI Document Web App API is running'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)