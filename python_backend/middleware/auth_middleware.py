import jwt
from functools import wraps
from flask import request, jsonify, current_app

# Decorator to authenticate JWT token
def authenticate_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Get token from header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Access denied. No token provided.'}), 401
        
        # Extract token from Bearer format
        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            return jsonify({'message': 'Invalid token format.'}), 401
        
        try:
            # Verify token
            decoded = jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=['HS256'])
            request.user = decoded
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired.'}), 403
        except jwt.InvalidTokenError as e:
            print(f'Token verification error: {e}')
            return jsonify({'message': 'Invalid token.'}), 403
    
    return decorated

# Decorator to check if user is admin
def is_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.user and request.user.get('role') == 'admin':
            return f(*args, **kwargs)
        else:
            return jsonify({'message': 'Access denied. Admin privileges required.'}), 403
    
    return decorated