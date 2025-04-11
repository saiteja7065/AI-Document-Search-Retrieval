from flask import current_app
from bson import ObjectId
from datetime import datetime

class Document:
    @staticmethod
    def create(document_data):
        """
        Create a new document in the database
        """
        # Add timestamps
        document_data['createdAt'] = datetime.now()
        document_data['updatedAt'] = datetime.now()
        
        # Set default values
        document_data.setdefault('isFavorite', False)
        document_data.setdefault('summary', None)
        document_data.setdefault('keyPoints', [])
        
        # Insert document
        result = current_app.config['DB'].documents.insert_one(document_data)
        
        # Get the inserted document
        return current_app.config['DB'].documents.find_one({'_id': result.inserted_id})
    
    @staticmethod
    def find(filters, sort_by='createdAt', sort_desc=True):
        """
        Find documents with filters and sorting
        """
        # Convert string ID to ObjectId if present
        if 'owner' in filters and isinstance(filters['owner'], str):
            filters['owner'] = ObjectId(filters['owner'])
        
        # Sort direction
        sort_direction = -1 if sort_desc else 1
        
        # Find documents
        return list(current_app.config['DB'].documents.find(
            filters
        ).sort(sort_by, sort_direction))
    
    @staticmethod
    def text_search(query, filters, sort_by='createdAt', sort_desc=True):
        """
        Perform text search on documents
        """
        # Convert string ID to ObjectId if present
        if 'owner' in filters and isinstance(filters['owner'], str):
            filters['owner'] = ObjectId(filters['owner'])
        
        # Add text search to filters
        search_filters = {
            '$and': [
                filters,
                {'$text': {'$search': query}}
            ]
        }
        
        # Sort direction
        sort_direction = -1 if sort_desc else 1
        
        # Find documents with text search
        return list(current_app.config['DB'].documents.find(
            search_filters,
            {'score': {'$meta': 'textScore'}}
        ).sort([('score', {'$meta': 'textScore'}), (sort_by, sort_direction)]))
    
    @staticmethod
    def find_one(filters):
        """
        Find a single document
        """
        # Convert string ID to ObjectId if present
        if '_id' in filters and isinstance(filters['_id'], str):
            filters['_id'] = ObjectId(filters['_id'])
        if 'owner' in filters and isinstance(filters['owner'], str):
            filters['owner'] = ObjectId(filters['owner'])
        
        # Find document
        return current_app.config['DB'].documents.find_one(filters)
    
    @staticmethod
    def update_one(filters, update_data):
        """
        Update a document
        """
        # Convert string ID to ObjectId if present
        if '_id' in filters and isinstance(filters['_id'], str):
            filters['_id'] = ObjectId(filters['_id'])
        if 'owner' in filters and isinstance(filters['owner'], str):
            filters['owner'] = ObjectId(filters['owner'])
        
        # Update document
        current_app.config['DB'].documents.update_one(
            filters,
            {'$set': update_data}
        )
        
        # Return updated document
        return current_app.config['DB'].documents.find_one(filters)
    
    @staticmethod
    def delete_one(filters):
        """
        Delete a document
        """
        # Convert string ID to ObjectId if present
        if '_id' in filters and isinstance(filters['_id'], str):
            filters['_id'] = ObjectId(filters['_id'])
        if 'owner' in filters and isinstance(filters['owner'], str):
            filters['owner'] = ObjectId(filters['owner'])
        
        # Delete document
        return current_app.config['DB'].documents.delete_one(filters)
    
    @staticmethod
    def get_current_time():
        """
        Get current datetime
        """
        return datetime.now()