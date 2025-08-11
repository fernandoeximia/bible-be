from flask import Blueprint, jsonify, request
import sqlite3
from pathlib import Path

bible_bp = Blueprint('bible', __name__)

def get_db_connection():
    """Get database connection"""
    db_path = Path(__file__).parent.parent / "bible.db"
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@bible_bp.route('/books', methods=['GET'])
def get_books():
    """Get all Bible books"""
    try:
        testament = request.args.get('testament')  # 'Antigo Testamento', 'Novo Testamento', or None for all
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if testament:
            cursor.execute('''
                SELECT id, name, testament, book_order, chapters_count 
                FROM books 
                WHERE testament = ?
                ORDER BY book_order
            ''', (testament,))
        else:
            cursor.execute('''
                SELECT id, name, testament, book_order, chapters_count 
                FROM books 
                ORDER BY book_order
            ''')
        
        books = []
        for row in cursor.fetchall():
            books.append({
                'id': row['id'],
                'name': row['name'],
                'testament': row['testament'],
                'order': row['book_order'],
                'chapters_count': row['chapters_count']
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'data': books,
            'count': len(books)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bible_bp.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Get specific book details"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, testament, book_order, chapters_count 
            FROM books 
            WHERE id = ?
        ''', (book_id,))
        
        book = cursor.fetchone()
        if not book:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Book not found'
            }), 404
        
        book_data = {
            'id': book['id'],
            'name': book['name'],
            'testament': book['testament'],
            'order': book['book_order'],
            'chapters_count': book['chapters_count']
        }
        
        conn.close()
        
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
    """Get specific chapter with all verses"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get book info
        cursor.execute('''
            SELECT id, name, testament, book_order, chapters_count 
            FROM books 
            WHERE id = ?
        ''', (book_id,))
        
        book = cursor.fetchone()
        if not book:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Book not found'
            }), 404
        
        # Get verses for the chapter
        cursor.execute('''
            SELECT verse_number, text 
            FROM verses 
            WHERE book_id = ? AND chapter_number = ?
            ORDER BY verse_number
        ''', (book_id, chapter_num))
        
        verses = []
        for row in cursor.fetchall():
            verses.append({
                'number': row['verse_number'],
                'text': row['text']
            })
        
        if not verses:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Chapter not found'
            }), 404
        
        # Get navigation info (previous/next chapter)
        navigation = get_navigation_info(cursor, book_id, chapter_num)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'data': {
                'book': {
                    'id': book['id'],
                    'name': book['name'],
                    'testament': book['testament']
                },
                'chapter': chapter_num,
                'verses': verses,
                'navigation': navigation
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bible_bp.route('/verses/<int:verse_id>', methods=['GET'])
def get_verse(verse_id):
    """Get specific verse"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT v.id, v.book_id, v.chapter_number, v.verse_number, v.text, v.version,
                   b.name as book_name, b.testament
            FROM verses v
            JOIN books b ON v.book_id = b.id
            WHERE v.id = ?
        ''', (verse_id,))
        
        verse = cursor.fetchone()
        if not verse:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Verse not found'
            }), 404
        
        verse_data = {
            'id': verse['id'],
            'book': {
                'id': verse['book_id'],
                'name': verse['book_name'],
                'testament': verse['testament']
            },
            'chapter': verse['chapter_number'],
            'verse': verse['verse_number'],
            'text': verse['text'],
            'version': verse['version'],
            'reference': f"{verse['book_name']} {verse['chapter_number']}:{verse['verse_number']}"
        }
        
        conn.close()
        
        return jsonify({
            'success': True,
            'data': verse_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bible_bp.route('/navigation/<int:book_id>/<int:chapter_num>', methods=['GET'])
def get_navigation(book_id, chapter_num):
    """Get navigation information for a chapter"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        navigation = get_navigation_info(cursor, book_id, chapter_num)
        conn.close()
        
        return jsonify({
            'success': True,
            'data': navigation
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_navigation_info(cursor, book_id, chapter_num):
    """Helper function to get navigation information"""
    navigation = {
        'previous': None,
        'next': None
    }
    
    # Get current book info
    cursor.execute('SELECT chapters_count FROM books WHERE id = ?', (book_id,))
    book = cursor.fetchone()
    
    if not book:
        return navigation
    
    chapters_count = book['chapters_count']
    
    # Previous chapter
    if chapter_num > 1:
        navigation['previous'] = {
            'book_id': book_id,
            'chapter': chapter_num - 1
        }
    else:
        # Previous book's last chapter
        cursor.execute('''
            SELECT id, chapters_count, name
            FROM books 
            WHERE book_order = (SELECT book_order - 1 FROM books WHERE id = ?)
        ''', (book_id,))
        prev_book = cursor.fetchone()
        if prev_book:
            navigation['previous'] = {
                'book_id': prev_book['id'],
                'chapter': prev_book['chapters_count'],
                'book_name': prev_book['name']
            }
    
    # Next chapter
    if chapter_num < chapters_count:
        navigation['next'] = {
            'book_id': book_id,
            'chapter': chapter_num + 1
        }
    else:
        # Next book's first chapter
        cursor.execute('''
            SELECT id, name
            FROM books 
            WHERE book_order = (SELECT book_order + 1 FROM books WHERE id = ?)
        ''', (book_id,))
        next_book = cursor.fetchone()
        if next_book:
            navigation['next'] = {
                'book_id': next_book['id'],
                'chapter': 1,
                'book_name': next_book['name']
            }
    
    return navigation

