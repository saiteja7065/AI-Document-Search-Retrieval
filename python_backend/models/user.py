from flask import current_app
from bson import ObjectId
from datetime import datetime
import bcrypt

class User:
    @staticmethod
    def create(user_data):
        """
        Create a new user in the database
        """
        # Hash password
        password = user_data.get('password')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        user_data['password'] = hashed_password.decode('utf-8')
        
        # Add timestamps
        user_data['createdAt'] = datetime.now()
        user_data['updatedAt'] = datetime.now()
        
        # Set default values
        user_data.setdefault('profileImageUrl', None)
        user_data.setdefault('role', 'user')
        
        # Insert user
        result = current_app.config['DB'].users.insert_one(user_data)
        
        # Get the inserted user
        return current_app.config['DB'].users.find_one({'_id': result.inserted_id})
    
    @staticmethod
    def find_by_email(email):
        """
        Find a user by email
        """
        return current_app.config['DB'].users.find_one({'email': email})
    
    @staticmethod
    def find_by_id(user_id):
        """
        Find a user by ID
        """
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        return current_app.config['DB'].users.find_one({'_id': user_id})
    
    @staticmethod
    def find_all():
        """
        Find all users
        """
        return list(current_app.config['DB'].users.find({}))
    
    @staticmethod
    def update_one(filters, update_data):
        """
        Update a user
        """
        # Convert string ID to ObjectId if present
        if '_id' in filters and isinstance(filters['_id'], str):
            filters['_id'] = ObjectId(filters['_id'])
        
        # Update user
        current_app.config['DB'].users.update_one(
            filters,
            {'$set': update_data}
        )
        
        # Return updated user
        return current_app.config['DB'].users.find_one(filters)
    
    @staticmethod
    def delete_one(filters):
        """
        Delete a user
        """
        # Convert string ID to ObjectId if present
        if '_id' in filters and isinstance(filters['_id'], str):
            filters['_id'] = ObjectId(filters['_id'])
        
        # Delete user
        return current_app.config['DB'].users.delete_one(filters)
    
    @staticmethod
    def compare_password(hashed_password, candidate_password):
        """
        Compare password with hashed password
        """
        return bcrypt.checkpw(
            candidate_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    
    @staticmethod
    def get_current_time():
        """
        Get current datetime
        """
        return datetime.now()