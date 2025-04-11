from flask import Blueprint, request, jsonify
from models.user import User
from middleware.auth_middleware import authenticate_token, is_admin

user_bp = Blueprint('users', __name__)

@user_bp.route('/profile', methods=['GET'])
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


@user_bp.route('/profile', methods=['PATCH'])
@authenticate_token
def update_profile():
    try:
        data = request.json
        user_id = request.user.get('userId')
        
        # Extract allowed fields
        full_name = data.get('fullName')
        profile_image_url = data.get('profileImageUrl')
        
        update_data = {}
        if full_name:
            update_data['fullName'] = full_name
        if profile_image_url:
            update_data['profileImageUrl'] = profile_image_url
        
        # Add updatedAt timestamp
        update_data['updatedAt'] = User.get_current_time()
        
        # Update user
        user = User.update_one({'_id': user_id}, update_data)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Remove password from response
        user.pop('password', None)
        
        # Convert ObjectId to string for JSON serialization
        user['_id'] = str(user['_id'])
        
        return jsonify(user)
    
    except Exception as e:
        print(f'Update profile error: {e}')
        return jsonify({'message': 'Server error while updating profile'}), 500


@user_bp.route('/change-password', methods=['POST'])
@authenticate_token
def change_password():
    try:
        data = request.json
        user_id = request.user.get('userId')
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')
        
        # Find user
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Verify current password
        is_match = User.compare_password(user['password'], current_password)
        if not is_match:
            return jsonify({'message': 'Current password is incorrect'}), 400
        
        # Hash new password
        import bcrypt
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), salt)
        
        # Update password
        update_data = {
            'password': hashed_password.decode('utf-8'),
            'updatedAt': User.get_current_time()
        }
        
        User.update_one({'_id': user_id}, update_data)
        
        return jsonify({'message': 'Password updated successfully'})
    
    except Exception as e:
        print(f'Change password error: {e}')
        return jsonify({'message': 'Server error while changing password'}), 500


# ADMIN ROUTES

@user_bp.route('/', methods=['GET'])
@authenticate_token
@is_admin
def get_all_users():
    try:
        users = User.find_all()
        
        # Remove passwords and convert ObjectIds to strings
        for user in users:
            user.pop('password', None)
            user['_id'] = str(user['_id'])
        
        return jsonify(users)
    
    except Exception as e:
        print(f'Get users error: {e}')
        return jsonify({'message': 'Server error while fetching users'}), 500


@user_bp.route('/<user_id>', methods=['GET'])
@authenticate_token
@is_admin
def get_user(user_id):
    try:
        user = User.find_by_id(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Remove password from response
        user.pop('password', None)
        
        # Convert ObjectId to string for JSON serialization
        user['_id'] = str(user['_id'])
        
        return jsonify(user)
    
    except Exception as e:
        print(f'Get user error: {e}')
        return jsonify({'message': 'Server error while fetching user'}), 500


@user_bp.route('/<user_id>', methods=['PATCH'])
@authenticate_token
@is_admin
def update_user(user_id):
    try:
        data = request.json
        
        # Extract allowed fields
        update_data = {}
        if 'fullName' in data:
            update_data['fullName'] = data['fullName']
        if 'email' in data:
            update_data['email'] = data['email']
        if 'role' in data:
            update_data['role'] = data['role']
        if 'profileImageUrl' in data:
            update_data['profileImageUrl'] = data['profileImageUrl']
        
        # Add updatedAt timestamp
        update_data['updatedAt'] = User.get_current_time()
        
        # Update user
        user = User.update_one({'_id': user_id}, update_data)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Remove password from response
        user.pop('password', None)
        
        # Convert ObjectId to string for JSON serialization
        user['_id'] = str(user['_id'])
        
        return jsonify(user)
    
    except Exception as e:
        print(f'Update user error: {e}')
        return jsonify({'message': 'Server error while updating user'}), 500


@user_bp.route('/<user_id>', methods=['DELETE'])
@authenticate_token
@is_admin
def delete_user(user_id):
    try:
        # Delete user
        result = User.delete_one({'_id': user_id})
        
        if result.deleted_count == 0:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({'message': 'User deleted successfully'})
    
    except Exception as e:
        print(f'Delete user error: {e}')
        return jsonify({'message': 'Server error while deleting user'}), 500