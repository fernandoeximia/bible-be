from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Book(db.Model):
    __tablename__ = 'books'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    abbreviation = db.Column(db.String(10), nullable=False)
    testament = db.Column(db.String(20), nullable=False)  # 'old' or 'new'
    order = db.Column(db.Integer, nullable=False)
    chapters_count = db.Column(db.Integer, nullable=False)
    
    # Relationship
    chapters = db.relationship('Chapter', backref='book', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'abbreviation': self.abbreviation,
            'testament': self.testament,
            'order': self.order,
            'chapters_count': self.chapters_count
        }

class Chapter(db.Model):
    __tablename__ = 'chapters'
    
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    number = db.Column(db.Integer, nullable=False)
    verses_count = db.Column(db.Integer, nullable=False)
    
    # Relationship
    verses = db.relationship('Verse', backref='chapter', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'book_id': self.book_id,
            'number': self.number,
            'verses_count': self.verses_count,
            'book_name': self.book.name if self.book else None
        }

class Verse(db.Model):
    __tablename__ = 'verses'
    
    id = db.Column(db.Integer, primary_key=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapters.id'), nullable=False)
    number = db.Column(db.Integer, nullable=False)
    text = db.Column(db.Text, nullable=False)
    version = db.Column(db.String(10), default='NVI')  # Bible version
    
    def to_dict(self):
        return {
            'id': self.id,
            'chapter_id': self.chapter_id,
            'number': self.number,
            'text': self.text,
            'version': self.version,
            'reference': f"{self.chapter.book.name} {self.chapter.number}:{self.number}" if self.chapter and self.chapter.book else None
        }

class Annotation(db.Model):
    __tablename__ = 'annotations'
    
    id = db.Column(db.Integer, primary_key=True)
    verse_id = db.Column(db.Integer, db.ForeignKey('verses.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'highlight', 'note', 'bookmark'
    color = db.Column(db.String(7), nullable=True)  # Hex color for highlights
    note_text = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    verse = db.relationship('Verse', backref='annotations')
    
    def to_dict(self):
        return {
            'id': self.id,
            'verse_id': self.verse_id,
            'type': self.type,
            'color': self.color,
            'note_text': self.note_text,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'verse_reference': f"{self.verse.chapter.book.name} {self.verse.chapter.number}:{self.verse.number}" if self.verse else None,
            'verse_text': self.verse.text if self.verse else None
        }

