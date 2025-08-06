"""
Database initialization script for Bible-BE
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from src.models.bible import db, Book, Chapter, Verse, Annotation
from src.data.bible_data import BIBLE_BOOKS, GENESIS_1_VERSES, JOHN_3_VERSES, PSALM_23_VERSES

def init_database(app):
    """Initialize database with Bible data"""
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        print("Initializing Bible database...")
        
        # Create books
        books_map = {}
        for book_data in BIBLE_BOOKS:
            book = Book(
                name=book_data['name'],
                abbreviation=book_data['abbreviation'],
                testament=book_data['testament'],
                order=book_data['order'],
                chapters_count=book_data['chapters_count']
            )
            db.session.add(book)
            db.session.flush()  # Get the ID
            books_map[book_data['name']] = book
            print(f"Created book: {book.name}")
        
        # Create chapters and verses for sample books
        sample_data = [
            ('Gênesis', 1, GENESIS_1_VERSES),
            ('João', 3, JOHN_3_VERSES),
            ('Salmos', 23, PSALM_23_VERSES)
        ]
        
        for book_name, chapter_num, verses_data in sample_data:
            if book_name in books_map:
                book = books_map[book_name]
                
                # Create chapter
                chapter = Chapter(
                    book_id=book.id,
                    number=chapter_num,
                    verses_count=len(verses_data)
                )
                db.session.add(chapter)
                db.session.flush()  # Get the ID
                
                print(f"Created chapter: {book_name} {chapter_num}")
                
                # Create verses
                for verse_data in verses_data:
                    verse = Verse(
                        chapter_id=chapter.id,
                        number=verse_data['number'],
                        text=verse_data['text'],
                        version='NVI'
                    )
                    db.session.add(verse)
                
                print(f"Created {len(verses_data)} verses for {book_name} {chapter_num}")
        
        # Create sample annotations
        # Get some verses to annotate
        genesis_verse_3 = Verse.query.join(Chapter).join(Book).filter(
            Book.name == 'Gênesis',
            Chapter.number == 1,
            Verse.number == 3
        ).first()
        
        genesis_verse_4 = Verse.query.join(Chapter).join(Book).filter(
            Book.name == 'Gênesis',
            Chapter.number == 1,
            Verse.number == 4
        ).first()
        
        john_verse_16 = Verse.query.join(Chapter).join(Book).filter(
            Book.name == 'João',
            Chapter.number == 3,
            Verse.number == 16
        ).first()
        
        if genesis_verse_3:
            annotation1 = Annotation(
                verse_id=genesis_verse_3.id,
                type='highlight',
                color='#FFF3CD',
                note_text='Deus cria pela sua palavra'
            )
            db.session.add(annotation1)
        
        if genesis_verse_4:
            annotation2 = Annotation(
                verse_id=genesis_verse_4.id,
                type='highlight',
                color='#FFF3CD'
            )
            db.session.add(annotation2)
        
        if john_verse_16:
            annotation3 = Annotation(
                verse_id=john_verse_16.id,
                type='highlight',
                color='#D4EDDA',
                note_text='O amor de Deus demonstrado'
            )
            db.session.add(annotation3)
        
        # Commit all changes
        db.session.commit()
        print("Database initialized successfully!")
        print(f"Created {Book.query.count()} books")
        print(f"Created {Chapter.query.count()} chapters")
        print(f"Created {Verse.query.count()} verses")
        print(f"Created {Annotation.query.count()} annotations")

if __name__ == '__main__':
    from flask import Flask
    from src.models.bible import db
    
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), '..', 'database', 'bible.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    
    init_database(app)

