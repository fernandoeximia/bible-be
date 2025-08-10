from flask import Blueprint, jsonify, request
from src.models.bible import db, Annotation, Verse, Chapter, Book
from datetime import datetime

annotations_bp = Blueprint('annotations', __name__)

@annotations_bp.route('/annotations', methods=['GET'])
def get_annotations():
    """Get all annotations with optional filtering"""
    try:
        # Query parameters
        annotation_type = request.args.get('type')  # 'highlight', 'note', 'bookmark'
        book_id = request.args.get('book_id', type=int)
        limit = request.args.get('limit', 100, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Build query
        query = Annotation.query.join(Verse).join(Chapter).join(Book)
        
        # Apply filters
        if annotation_type:
            query = query.filter(Annotation.type == annotation_type)
        
        if book_id:
            query = query.filter(Book.id == book_id)
        
        # Order by creation date (newest first)
        query = query.order_by(Annotation.created_at.desc())
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        annotations = query.offset(offset).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': [annotation.to_dict() for annotation in annotations],
            'pagination': {
                'total': total,
                'limit': limit,
                'offset': offset,
                'has_more': offset + limit < total
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@annotations_bp.route('/annotations', methods=['POST'])
def create_annotation():
    """Create a new annotation"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'verse_id' not in data or 'type' not in data:
            return jsonify({
                'success': False,
                'error': 'verse_id and type are required'
            }), 400
        
        # Validate verse exists
        verse = Verse.query.get(data['verse_id'])
        if not verse:
            return jsonify({
                'success': False,
                'error': 'Verse not found'
            }), 404
        
        # Validate annotation type
        valid_types = ['highlight', 'note', 'bookmark']
        if data['type'] not in valid_types:
            return jsonify({
                'success': False,
                'error': f'Invalid type. Must be one of: {", ".join(valid_types)}'
            }), 400
        
        # Create annotation
        annotation = Annotation(
            verse_id=data['verse_id'],
            type=data['type'],
            color=data.get('color'),
            note_text=data.get('note_text')
        )
        
        db.session.add(annotation)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': annotation.to_dict(),
            'message': 'Annotation created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@annotations_bp.route('/annotations/<int:annotation_id>', methods=['GET'])
def get_annotation(annotation_id):
    """Get a specific annotation"""
    try:
        annotation = Annotation.query.get_or_404(annotation_id)
        
        return jsonify({
            'success': True,
            'data': annotation.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@annotations_bp.route('/annotations/<int:annotation_id>', methods=['PUT'])
def update_annotation(annotation_id):
    """Update an existing annotation"""
    try:
        annotation = Annotation.query.get_or_404(annotation_id)
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Update fields
        if 'type' in data:
            valid_types = ['highlight', 'note', 'bookmark']
            if data['type'] not in valid_types:
                return jsonify({
                    'success': False,
                    'error': f'Invalid type. Must be one of: {", ".join(valid_types)}'
                }), 400
            annotation.type = data['type']
        
        if 'color' in data:
            annotation.color = data['color']
        
        if 'note_text' in data:
            annotation.note_text = data['note_text']
        
        annotation.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': annotation.to_dict(),
            'message': 'Annotation updated successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@annotations_bp.route('/annotations/<int:annotation_id>', methods=['DELETE'])
def delete_annotation(annotation_id):
    """Delete an annotation"""
    try:
        annotation = Annotation.query.get_or_404(annotation_id)
        
        db.session.delete(annotation)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Annotation deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@annotations_bp.route('/verses/<int:verse_id>/annotations', methods=['GET'])
def get_verse_annotations(verse_id):
    """Get all annotations for a specific verse"""
    try:
        # Validate verse exists
        verse = Verse.query.get_or_404(verse_id)
        
        annotations = Annotation.query.filter_by(verse_id=verse_id).order_by(Annotation.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': {
                'verse': verse.to_dict(),
                'annotations': [annotation.to_dict() for annotation in annotations]
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@annotations_bp.route('/annotations/stats', methods=['GET'])
def get_annotation_stats():
    """Get annotation statistics"""
    try:
        total_annotations = Annotation.query.count()
        highlights = Annotation.query.filter_by(type='highlight').count()
        notes = Annotation.query.filter_by(type='note').count()
        bookmarks = Annotation.query.filter_by(type='bookmark').count()
        
        # Get most annotated books
        most_annotated = db.session.query(
            Book.name,
            db.func.count(Annotation.id).label('annotation_count')
        ).join(Chapter).join(Verse).join(Annotation).group_by(Book.id, Book.name).order_by(
            db.func.count(Annotation.id).desc()
        ).limit(5).all()
        
        return jsonify({
            'success': True,
            'data': {
                'total_annotations': total_annotations,
                'by_type': {
                    'highlights': highlights,
                    'notes': notes,
                    'bookmarks': bookmarks
                },
                'most_annotated_books': [
                    {'book_name': book_name, 'count': count}
                    for book_name, count in most_annotated
                ]
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

