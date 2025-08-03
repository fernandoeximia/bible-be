from flask import Blueprint, jsonify, request
from src.models.bible import db, Book, Chapter, Verse, Annotation
from sqlalchemy import or_, and_, func
import re

search_bp = Blueprint('search', __name__)

@search_bp.route('/search/advanced', methods=['GET'])
def advanced_search():
    """Advanced search with multiple filters and options"""
    try:
        # Query parameters
        query_text = request.args.get('q', '').strip()
        book_ids = request.args.getlist('book_ids', type=int)
        testament = request.args.get('testament')  # 'old', 'new'
        exact_match = request.args.get('exact', 'false').lower() == 'true'
        case_sensitive = request.args.get('case_sensitive', 'false').lower() == 'true'
        limit = request.args.get('limit', 50, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        if not query_text:
            return jsonify({
                'success': False,
                'error': 'Query parameter "q" is required'
            }), 400
        
        # Build base query
        search_query = Verse.query.join(Chapter).join(Book)
        
        # Apply text search
        if exact_match:
            if case_sensitive:
                search_query = search_query.filter(Verse.text == query_text)
            else:
                search_query = search_query.filter(func.lower(Verse.text) == func.lower(query_text))
        else:
            if case_sensitive:
                search_query = search_query.filter(Verse.text.contains(query_text))
            else:
                search_query = search_query.filter(func.lower(Verse.text).contains(func.lower(query_text)))
        
        # Apply book filters
        if book_ids:
            search_query = search_query.filter(Book.id.in_(book_ids))
        
        # Apply testament filter
        if testament:
            search_query = search_query.filter(Book.testament == testament)
        
        # Get total count
        total = search_query.count()
        
        # Apply pagination and ordering
        verses = search_query.order_by(Book.order, Chapter.number, Verse.number).offset(offset).limit(limit).all()
        
        # Group results by book for better organization
        results_by_book = {}
        for verse in verses:
            book_name = verse.chapter.book.name
            if book_name not in results_by_book:
                results_by_book[book_name] = {
                    'book': verse.chapter.book.to_dict(),
                    'verses': []
                }
            results_by_book[book_name]['verses'].append(verse.to_dict())
        
        return jsonify({
            'success': True,
            'data': {
                'query': query_text,
                'filters': {
                    'book_ids': book_ids,
                    'testament': testament,
                    'exact_match': exact_match,
                    'case_sensitive': case_sensitive
                },
                'results_by_book': results_by_book,
                'results_flat': [verse.to_dict() for verse in verses]
            },
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

@search_bp.route('/search/suggestions', methods=['GET'])
def search_suggestions():
    """Get search suggestions based on partial input"""
    try:
        query = request.args.get('q', '').strip()
        limit = request.args.get('limit', 10, type=int)
        
        if len(query) < 2:
            return jsonify({
                'success': True,
                'data': {
                    'books': [],
                    'verses': [],
                    'popular_searches': [
                        'João 3:16',
                        'Salmos 23',
                        'amor',
                        'fé',
                        'esperança',
                        'paz'
                    ]
                }
            }), 200
        
        # Book name suggestions
        book_suggestions = Book.query.filter(
            Book.name.ilike(f'%{query}%')
        ).order_by(Book.order).limit(limit).all()
        
        # Verse content suggestions (first few words)
        verse_suggestions = Verse.query.join(Chapter).join(Book).filter(
            Verse.text.ilike(f'{query}%')
        ).order_by(Book.order, Chapter.number, Verse.number).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': {
                'books': [
                    {
                        'id': book.id,
                        'name': book.name,
                        'testament': book.testament,
                        'suggestion_type': 'book'
                    }
                    for book in book_suggestions
                ],
                'verses': [
                    {
                        'id': verse.id,
                        'reference': f"{verse.chapter.book.name} {verse.chapter.number}:{verse.number}",
                        'text_preview': verse.text[:100] + '...' if len(verse.text) > 100 else verse.text,
                        'suggestion_type': 'verse'
                    }
                    for verse in verse_suggestions
                ]
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@search_bp.route('/search/similar', methods=['GET'])
def find_similar_verses():
    """Find verses similar to a given verse (by keywords)"""
    try:
        verse_id = request.args.get('verse_id', type=int)
        limit = request.args.get('limit', 10, type=int)
        
        if not verse_id:
            return jsonify({
                'success': False,
                'error': 'verse_id parameter is required'
            }), 400
        
        # Get the reference verse
        reference_verse = Verse.query.get_or_404(verse_id)
        
        # Extract keywords from the reference verse (simplified approach)
        # Remove common words and extract meaningful terms
        common_words = {'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos', 'e', 'ou', 'que', 'para', 'com', 'em', 'na', 'no', 'por', 'se', 'não', 'mas', 'como', 'quando', 'onde', 'porque', 'então', 'assim', 'também', 'já', 'ainda', 'mais', 'muito', 'todo', 'toda', 'todos', 'todas', 'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas', 'aquele', 'aquela', 'aqueles', 'aquelas'}
        
        words = re.findall(r'\b\w+\b', reference_verse.text.lower())
        keywords = [word for word in words if len(word) > 3 and word not in common_words]
        
        if not keywords:
            return jsonify({
                'success': True,
                'data': {
                    'reference_verse': reference_verse.to_dict(),
                    'similar_verses': [],
                    'message': 'No keywords found for similarity search'
                }
            }), 200
        
        # Find verses containing these keywords
        similar_query = Verse.query.join(Chapter).join(Book).filter(
            Verse.id != verse_id  # Exclude the reference verse itself
        )
        
        # Build OR conditions for keywords
        keyword_conditions = []
        for keyword in keywords[:5]:  # Limit to top 5 keywords
            keyword_conditions.append(func.lower(Verse.text).contains(keyword))
        
        if keyword_conditions:
            similar_query = similar_query.filter(or_(*keyword_conditions))
        
        similar_verses = similar_query.order_by(Book.order, Chapter.number, Verse.number).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': {
                'reference_verse': reference_verse.to_dict(),
                'keywords_used': keywords[:5],
                'similar_verses': [verse.to_dict() for verse in similar_verses]
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@search_bp.route('/search/annotated', methods=['GET'])
def search_annotated_verses():
    """Search within annotated verses only"""
    try:
        query_text = request.args.get('q', '').strip()
        annotation_type = request.args.get('type')  # 'highlight', 'note', 'bookmark'
        limit = request.args.get('limit', 50, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Build query for verses that have annotations
        search_query = Verse.query.join(Annotation).join(Chapter).join(Book)
        
        # Apply text filter if provided
        if query_text:
            search_query = search_query.filter(
                or_(
                    Verse.text.contains(query_text),
                    Annotation.note_text.contains(query_text)
                )
            )
        
        # Apply annotation type filter
        if annotation_type:
            search_query = search_query.filter(Annotation.type == annotation_type)
        
        # Remove duplicates and order
        search_query = search_query.distinct().order_by(Book.order, Chapter.number, Verse.number)
        
        # Get total count
        total = search_query.count()
        
        # Apply pagination
        verses = search_query.offset(offset).limit(limit).all()
        
        # Include annotation data for each verse
        results = []
        for verse in verses:
            verse_data = verse.to_dict()
            verse_annotations = Annotation.query.filter_by(verse_id=verse.id)
            if annotation_type:
                verse_annotations = verse_annotations.filter_by(type=annotation_type)
            verse_data['annotations'] = [ann.to_dict() for ann in verse_annotations.all()]
            results.append(verse_data)
        
        return jsonify({
            'success': True,
            'data': results,
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

