from flask import Blueprint, jsonify, request
from src.models.bible import db, Book, Chapter, Verse
from sqlalchemy import or_

bible_bp = Blueprint('bible', __name__)

@bible_bp.route('/books', methods=['GET'])
def get_books():
    """Get all Bible books"""
    try:
        testament = request.args.get('testament')  # 'old', 'new', or None for all
        
        query = Book.query
        if testament:
            query = query.filter(Book.testament == testament)
        
        books = query.order_by(Book.order).all()
        
        return jsonify({
            'success': True,
            'data': [book.to_dict() for book in books],
            'count': len(books)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bible_bp.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Get a specific book with its chapters"""
    try:
        book = Book.query.get_or_404(book_id)
        
        # Get chapters for this book
        chapters = Chapter.query.filter_by(book_id=book_id).order_by(Chapter.number).all()
        
        book_data = book.to_dict()
        book_data['chapters'] = [chapter.to_dict() for chapter in chapters]
        
        return jsonify({
            'success': True,
            'data': book_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bible_bp.route('/books/<int:book_id>/chapters/<int:chapter_num>', methods=['GET'])
def get_chapter(book_id, chapter_num):
    """Get a specific chapter with its verses"""
    try:
        book = Book.query.get_or_404(book_id)
        chapter = Chapter.query.filter_by(book_id=book_id, number=chapter_num).first_or_404()
        
        # Get verses for this chapter
        verses = Verse.query.filter_by(chapter_id=chapter.id).order_by(Verse.number).all()
        
        chapter_data = chapter.to_dict()
        chapter_data['verses'] = [verse.to_dict() for verse in verses]
        chapter_data['book'] = book.to_dict()
        
        return jsonify({
            'success': True,
            'data': chapter_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bible_bp.route('/verses/<int:verse_id>', methods=['GET'])
def get_verse(verse_id):
    """Get a specific verse"""
    try:
        verse = Verse.query.get_or_404(verse_id)
        
        return jsonify({
            'success': True,
            'data': verse.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bible_bp.route('/search/verses', methods=['GET'])
def search_verses():
    """Search verses by text content"""
    try:
        query_text = request.args.get('q', '').strip()
        book_id = request.args.get('book_id', type=int)
        limit = request.args.get('limit', 50, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        if not query_text:
            return jsonify({
                'success': False,
                'error': 'Query parameter "q" is required'
            }), 400
        
        # Build search query
        search_query = Verse.query.join(Chapter).join(Book)
        
        # Filter by text content
        search_query = search_query.filter(Verse.text.contains(query_text))
        
        # Filter by book if specified
        if book_id:
            search_query = search_query.filter(Book.id == book_id)
        
        # Get total count
        total = search_query.count()
        
        # Apply pagination
        verses = search_query.offset(offset).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': [verse.to_dict() for verse in verses],
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

@bible_bp.route('/search/reference', methods=['GET'])
def search_by_reference():
    """Search verse by reference (e.g., 'João 3:16', 'Gênesis 1:1-3')"""
    try:
        reference = request.args.get('ref', '').strip()
        
        if not reference:
            return jsonify({
                'success': False,
                'error': 'Reference parameter "ref" is required'
            }), 400
        
        # Parse reference (simplified parser)
        # Expected formats: "João 3:16", "Gênesis 1:1-3", "Salmos 23"
        parts = reference.split()
        if len(parts) < 2:
            return jsonify({
                'success': False,
                'error': 'Invalid reference format. Use format like "João 3:16"'
            }), 400
        
        book_name = ' '.join(parts[:-1])
        chapter_verse = parts[-1]
        
        # Find book
        book = Book.query.filter(Book.name.ilike(f'%{book_name}%')).first()
        if not book:
            return jsonify({
                'success': False,
                'error': f'Book "{book_name}" not found'
            }), 404
        
        # Parse chapter and verse
        if ':' in chapter_verse:
            chapter_num, verse_part = chapter_verse.split(':', 1)
            chapter_num = int(chapter_num)
            
            # Handle verse ranges (e.g., "1-3")
            if '-' in verse_part:
                start_verse, end_verse = map(int, verse_part.split('-'))
                verse_numbers = list(range(start_verse, end_verse + 1))
            else:
                verse_numbers = [int(verse_part)]
        else:
            # Just chapter number, return all verses
            chapter_num = int(chapter_verse)
            verse_numbers = None
        
        # Find chapter
        chapter = Chapter.query.filter_by(book_id=book.id, number=chapter_num).first()
        if not chapter:
            return jsonify({
                'success': False,
                'error': f'Chapter {chapter_num} not found in {book.name}'
            }), 404
        
        # Find verses
        verse_query = Verse.query.filter_by(chapter_id=chapter.id)
        if verse_numbers:
            verse_query = verse_query.filter(Verse.number.in_(verse_numbers))
        
        verses = verse_query.order_by(Verse.number).all()
        
        if not verses:
            return jsonify({
                'success': False,
                'error': f'Verses not found for reference "{reference}"'
            }), 404
        
        return jsonify({
            'success': True,
            'data': {
                'reference': reference,
                'book': book.to_dict(),
                'chapter': chapter.to_dict(),
                'verses': [verse.to_dict() for verse in verses]
            }
        }), 200
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': 'Invalid reference format. Use format like "João 3:16"'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bible_bp.route('/navigation/<int:book_id>/<int:chapter_num>', methods=['GET'])
def get_navigation_info(book_id, chapter_num):
    """Get navigation information for a chapter (previous/next)"""
    try:
        book = Book.query.get_or_404(book_id)
        current_chapter = Chapter.query.filter_by(book_id=book_id, number=chapter_num).first_or_404()
        
        # Find previous chapter
        prev_chapter = None
        if chapter_num > 1:
            prev_chapter = Chapter.query.filter_by(book_id=book_id, number=chapter_num - 1).first()
        else:
            # Previous book's last chapter
            prev_book = Book.query.filter(Book.order < book.order).order_by(Book.order.desc()).first()
            if prev_book:
                prev_chapter = Chapter.query.filter_by(book_id=prev_book.id).order_by(Chapter.number.desc()).first()
        
        # Find next chapter
        next_chapter = None
        if chapter_num < book.chapters_count:
            next_chapter = Chapter.query.filter_by(book_id=book_id, number=chapter_num + 1).first()
        else:
            # Next book's first chapter
            next_book = Book.query.filter(Book.order > book.order).order_by(Book.order).first()
            if next_book:
                next_chapter = Chapter.query.filter_by(book_id=next_book.id, number=1).first()
        
        navigation_data = {
            'current': {
                'book': book.to_dict(),
                'chapter': current_chapter.to_dict()
            },
            'previous': None,
            'next': None
        }
        
        if prev_chapter:
            prev_book_data = Book.query.get(prev_chapter.book_id)
            navigation_data['previous'] = {
                'book': prev_book_data.to_dict(),
                'chapter': prev_chapter.to_dict()
            }
        
        if next_chapter:
            next_book_data = Book.query.get(next_chapter.book_id)
            navigation_data['next'] = {
                'book': next_book_data.to_dict(),
                'chapter': next_chapter.to_dict()
            }
        
        return jsonify({
            'success': True,
            'data': navigation_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

