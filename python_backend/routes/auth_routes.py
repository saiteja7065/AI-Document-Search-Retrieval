from flask import Blueprint, request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
from models.user import User
from middleware.auth_middleware import authenticate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        full_name = data.get('fullName')
        email = data.get('email')
        password = data.get('password')
        
        # Check if user already exists
        existing_user = User.find_by_email(email)
        if existing_user:
            return jsonify({'message': 'User with this email already exists'}), 400
        
        # Create new user
        user_data = {
            'fullName': full_name,
            'email': email,
            'password': password
        }
        
        user = User.create(user_data)
        
        # Create token
        token = jwt.encode(
            {
                'userId': str(user['_id']),
                'exp': datetime.utcnow() + timedelta(days=7)
            },
            current_app.config['JWT_SECRET'],
            algorithm='HS256'
        )
        
        # Return user data without password
        user_data = {
            '_id': str(user['_id']),
            'fullName': user['fullName'],
            'email': user['email'],
            'profileImageUrl': user['profileImageUrl'],
            'role': user['role']
        }
        
        return jsonify({'user': user_data, 'token': token}), 201
    
    except Exception as e:
        print(f'Registration error: {e}')
        return jsonify({'message': 'Server error during registration'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        # Find user by email
        user = User.find_by_email(email)
        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Check password
        is_match = User.compare_password(user['password'], password)
        if not is_match:
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Create token
        token = jwt.encode(
            {
                'userId': str(user['_id']),
                'exp': datetime.utcnow() + timedelta(days=7)
            },
            current_app.config['JWT_SECRET'],
            algorithm='HS256'
        )
        
        # Return user data without password
        user_data = {
            '_id': str(user['_id']),
            'fullName': user['fullName'],
            'email': user['email'],
            'profileImageUrl': user['profileImageUrl'],
            'role': user['role']
        }
        
        return jsonify({'user': user_data, 'token': token})
    
    except Exception as e:
        print(f'Login error: {e}')
        return jsonify({'message': 'Server error during login'}), 500


@auth_bp.route('/me', methods=['GET'])
@authenticate_token
def get_profile():
    try:
        user_id = request.user.get('userId')
        user = User.find_by_id(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Remove password from response
        user.pop('password', None)
        
        # Convert ObjectId to string for JSON serialization
        user['_id'] = str(user['_id'])
        
        return jsonify(user)
    
    except Exception as e:
        print(f'Get profile error: {e}')
        return jsonify({'message': 'Server error while fetching profile'}), 500