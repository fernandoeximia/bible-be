from flask import Blueprint, request, jsonify
from ..models.bible import db, Book, Chapter, Verse, Annotation
import re
from sqlalchemy import or_, and_

search_bp = Blueprint('search', __name__)

def parse_bible_reference(reference):
    """
    Parse a Bible reference like 'João 3:16', 'Gênesis 1:1-3', 'Salmos 23'
    Returns: (book_name, chapter, verse_start, verse_end)
    """
    reference = reference.strip()
    
    # Pattern for book chapter:verse or book chapter:verse-verse
    pattern = r'^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$'
    match = re.match(pattern, reference)
    
    if match:
        book_name = match.group(1).strip()
        chapter = int(match.group(2))
        verse_start = int(match.group(3)) if match.group(3) else None
        verse_end = int(match.group(4)) if match.group(4) else verse_start
        
        return book_name, chapter, verse_start, verse_end
    
    return None, None, None, None

def find_book_by_name(book_name):
    """Find book by name or abbreviation"""
    # Try exact match first
    book = Book.query.filter(
        or_(
            Book.name.ilike(book_name),
            Book.abbreviation.ilike(book_name)
        )
    ).first()
    
    if book:
        return book
    
    # Try partial match
    book = Book.query.filter(
        Book.name.ilike(f'%{book_name}%')
    ).first()
    
    return book

@search_bp.route('/search/reference', methods=['GET'])
def search_by_reference():
    """Search for verses by Bible reference (e.g., 'João 3:16')"""
    try:
        reference = request.args.get('ref', '').strip()
        
        if not reference:
            return jsonify({
                'success': False,
                'error': 'Referência não fornecida'
            }), 400
        
        # Parse the reference
        book_name, chapter_num, verse_start, verse_end = parse_bible_reference(reference)
        
        if not book_name or not chapter_num:
            return jsonify({
                'success': False,
                'error': 'Formato de referência inválido. Use: "Livro Capítulo:Versículo" (ex: João 3:16)'
            }), 400
        
        # Find the book
        book = find_book_by_name(book_name)
        if not book:
            return jsonify({
                'success': False,
                'error': f'Livro "{book_name}" não encontrado'
            }), 404
        
        # Find the chapter
        chapter = Chapter.query.filter(
            and_(
                Chapter.book_id == book.id,
                Chapter.number == chapter_num
            )
        ).first()
        
        if not chapter:
            return jsonify({
                'success': False,
                'error': f'Capítulo {chapter_num} não encontrado em {book.name}'
            }), 404
        
        # Build query for verses
        query = Verse.query.filter(Verse.chapter_id == chapter.id)
        
        # Add verse filter if specified
        if verse_start:
            if verse_end and verse_end != verse_start:
                query = query.filter(
                    and_(
                        Verse.number >= verse_start,
                        Verse.number <= verse_end
                    )
                )
            else:
                query = query.filter(Verse.number == verse_start)
        
        verses = query.order_by(Verse.number).all()
        
        if not verses:
            return jsonify({
                'success': False,
                'error': f'Referência "{reference}" não encontrada'
            }), 404
        
        # Format response
        result = {
            'book': {
                'id': book.id,
                'name': book.name,
                'abbreviation': book.abbreviation,
                'testament': book.testament
            },
            'chapter': chapter_num,
            'verses': [{
                'id': verse.id,
                'verse_num': verse.number,
                'text': verse.text
            } for verse in verses]
        }
        
        return jsonify({
            'success': True,
            'data': result,
            'reference': reference
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500

@search_bp.route('/search/verses', methods=['GET'])
def search_verses():
    """Search for verses by text content"""
    try:
        query_text = request.args.get('q', '').strip()
        book_id = request.args.get('book_id', type=int)
        testament = request.args.get('testament')
        limit = request.args.get('limit', 50, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        if not query_text:
            return jsonify({
                'success': False,
                'error': 'Texto de busca não fornecido'
            }), 400
        
        # Build query
        query = db.session.query(Verse, Book).join(Book)
        
        # Add text search
        query = query.filter(Verse.text.ilike(f'%{query_text}%'))
        
        # Add filters
        if book_id:
            query = query.filter(Verse.book_id == book_id)
        
        if testament:
            query = query.filter(Book.testament == testament)
        
        # Get total count
        total = query.count()
        
        # Apply pagination and get results
        results = query.order_by(Book.order_num, Verse.chapter_num, Verse.verse_num)\
                      .offset(offset).limit(limit).all()
        
        # Format response
        verses = []
        for verse, book in results:
            verses.append({
                'id': verse.id,
                'book': {
                    'id': book.id,
                    'name': book.name,
                    'abbrev': book.abbrev,
                    'testament': book.testament
                },
                'chapter_num': verse.chapter_num,
                'verse_num': verse.verse_num,
                'text': verse.text,
                'reference': f'{book.name} {verse.chapter_num}:{verse.verse_num}'
            })
        
        return jsonify({
            'success': True,
            'data': {
                'verses': verses,
                'total': total,
                'limit': limit,
                'offset': offset,
                'query': query_text
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500

@search_bp.route('/search/suggestions', methods=['GET'])
def search_suggestions():
    """Get search suggestions for book names"""
    try:
        query = request.args.get('q', '').strip()
        
        if not query or len(query) < 2:
            return jsonify({
                'success': True,
                'data': []
            })
        
        # Search books by name
        books = Book.query.filter(
            Book.name.ilike(f'%{query}%')
        ).order_by(Book.order_num).limit(10).all()
        
        suggestions = []
        for book in books:
            suggestions.append({
                'id': book.id,
                'name': book.name,
                'abbrev': book.abbrev,
                'testament': book.testament,
                'type': 'book'
            })
        
        return jsonify({
            'success': True,
            'data': suggestions
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500

@search_bp.route('/search/quick', methods=['GET'])
def quick_search():
    """Quick search that handles both references and text"""
    try:
        query = request.args.get('q', '').strip()
        
        if not query:
            return jsonify({
                'success': False,
                'error': 'Consulta não fornecida'
            }), 400
        
        # Try to parse as Bible reference first
        book_name, chapter_num, verse_start, verse_end = parse_bible_reference(query)
        
        if book_name and chapter_num:
            # It's a reference, redirect to reference search
            return search_by_reference()
        
        # Otherwise, search by text
        return search_verses()
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500

@search_bp.route('/search/annotated', methods=['GET'])
def search_annotated_verses():
    """Search verses that have annotations"""
    try:
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        color = request.args.get('color')
        
        # Build query for verses with annotations
        query = db.session.query(Verse, Book, Annotation)\
                         .join(Book)\
                         .join(Annotation)
        
        # Add color filter if specified
        if color:
            query = query.filter(Annotation.color == color)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        results = query.order_by(Annotation.created_at.desc())\
                      .offset(offset).limit(limit).all()
        
        # Format response
        verses = []
        for verse, book, annotation in results:
            verses.append({
                'id': verse.id,
                'book': {
                    'id': book.id,
                    'name': book.name,
                    'abbrev': book.abbrev,
                    'testament': book.testament
                },
                'chapter_num': verse.chapter_num,
                'verse_num': verse.verse_num,
                'text': verse.text,
                'reference': f'{book.name} {verse.chapter_num}:{verse.verse_num}',
                'annotation': {
                    'id': annotation.id,
                    'color': annotation.color,
                    'note': annotation.note,
                    'created_at': annotation.created_at.isoformat()
                }
            })
        
        return jsonify({
            'success': True,
            'data': {
                'verses': verses,
                'total': total,
                'limit': limit,
                'offset': offset
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500

