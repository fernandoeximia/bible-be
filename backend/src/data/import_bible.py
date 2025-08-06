#!/usr/bin/env python3
"""
Script para importar dados bíblicos completos do arquivo PorBLivre.json
"""

import json
import sqlite3
import os
from pathlib import Path

def create_database():
    """Cria o banco de dados com as tabelas necessárias"""
    db_path = Path(__file__).parent.parent / "bible.db"
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Criar tabelas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            testament TEXT NOT NULL,
            book_order INTEGER NOT NULL,
            chapters_count INTEGER NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chapters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL,
            chapter_number INTEGER NOT NULL,
            verses_count INTEGER NOT NULL,
            FOREIGN KEY (book_id) REFERENCES books (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS verses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL,
            chapter_number INTEGER NOT NULL,
            verse_number INTEGER NOT NULL,
            text TEXT NOT NULL,
            version TEXT DEFAULT 'PorBLivre',
            FOREIGN KEY (book_id) REFERENCES books (id)
        )
    ''')
    
    # Criar índices para performance
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_verses_book_chapter ON verses (book_id, chapter_number)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_verses_search ON verses (book_id, chapter_number, verse_number)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_books_order ON books (book_order)')
    
    conn.commit()
    conn.close()
    print("✅ Banco de dados criado com sucesso!")

def get_testament(book_name):
    """Determina o testamento baseado no nome do livro"""
    old_testament = [
        'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
        'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
        '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
        'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
        'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
        'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
        'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
    ]
    
    return 'Antigo Testamento' if book_name in old_testament else 'Novo Testamento'

def translate_book_name(english_name):
    """Traduz nomes dos livros para português"""
    translations = {
        'Genesis': 'Gênesis',
        'Exodus': 'Êxodo',
        'Leviticus': 'Levítico',
        'Numbers': 'Números',
        'Deuteronomy': 'Deuteronômio',
        'Joshua': 'Josué',
        'Judges': 'Juízes',
        'Ruth': 'Rute',
        '1 Samuel': '1 Samuel',
        '2 Samuel': '2 Samuel',
        '1 Kings': '1 Reis',
        '2 Kings': '2 Reis',
        '1 Chronicles': '1 Crônicas',
        '2 Chronicles': '2 Crônicas',
        'Ezra': 'Esdras',
        'Nehemiah': 'Neemias',
        'Esther': 'Ester',
        'Job': 'Jó',
        'Psalms': 'Salmos',
        'Proverbs': 'Provérbios',
        'Ecclesiastes': 'Eclesiastes',
        'Song of Solomon': 'Cantares',
        'Isaiah': 'Isaías',
        'Jeremiah': 'Jeremias',
        'Lamentations': 'Lamentações',
        'Ezekiel': 'Ezequiel',
        'Daniel': 'Daniel',
        'Hosea': 'Oséias',
        'Joel': 'Joel',
        'Amos': 'Amós',
        'Obadiah': 'Obadias',
        'Jonah': 'Jonas',
        'Micah': 'Miquéias',
        'Nahum': 'Naum',
        'Habakkuk': 'Habacuque',
        'Zephaniah': 'Sofonias',
        'Haggai': 'Ageu',
        'Zechariah': 'Zacarias',
        'Malachi': 'Malaquias',
        'Matthew': 'Mateus',
        'Mark': 'Marcos',
        'Luke': 'Lucas',
        'John': 'João',
        'Acts': 'Atos',
        'Romans': 'Romanos',
        '1 Corinthians': '1 Coríntios',
        '2 Corinthians': '2 Coríntios',
        'Galatians': 'Gálatas',
        'Ephesians': 'Efésios',
        'Philippians': 'Filipenses',
        'Colossians': 'Colossenses',
        '1 Thessalonians': '1 Tessalonicenses',
        '2 Thessalonians': '2 Tessalonicenses',
        '1 Timothy': '1 Timóteo',
        '2 Timothy': '2 Timóteo',
        'Titus': 'Tito',
        'Philemon': 'Filemom',
        'Hebrews': 'Hebreus',
        'James': 'Tiago',
        '1 Peter': '1 Pedro',
        '2 Peter': '2 Pedro',
        '1 John': '1 João',
        '2 John': '2 João',
        '3 John': '3 João',
        'Jude': 'Judas',
        'Revelation': 'Apocalipse'
    }
    
    return translations.get(english_name, english_name)

def import_bible_data():
    """Importa os dados bíblicos do arquivo JSON"""
    json_path = Path(__file__).parent.parent.parent / "PorBLivre.json"
    db_path = Path(__file__).parent.parent / "bible.db"
    
    if not json_path.exists():
        print(f"❌ Arquivo {json_path} não encontrado!")
        return
    
    print(f"📖 Carregando dados de {json_path}...")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        bible_data = json.load(f)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Limpar dados existentes
    cursor.execute('DELETE FROM verses')
    cursor.execute('DELETE FROM chapters')
    cursor.execute('DELETE FROM books')
    
    print("🗑️ Dados antigos removidos")
    
    book_order = 1
    total_books = len(bible_data['books'])
    total_verses = 0
    
    for book_data in bible_data['books']:
        book_name_en = book_data['name']
        book_name_pt = translate_book_name(book_name_en)
        testament = get_testament(book_name_en)
        chapters_count = len(book_data['chapters'])
        
        # Inserir livro
        cursor.execute('''
            INSERT INTO books (name, testament, book_order, chapters_count)
            VALUES (?, ?, ?, ?)
        ''', (book_name_pt, testament, book_order, chapters_count))
        
        book_id = cursor.lastrowid
        
        for chapter_data in book_data['chapters']:
            chapter_number = chapter_data['chapter']
            verses_count = len(chapter_data['verses'])
            
            # Inserir capítulo
            cursor.execute('''
                INSERT INTO chapters (book_id, chapter_number, verses_count)
                VALUES (?, ?, ?)
            ''', (book_id, chapter_number, verses_count))
            
            # Inserir versículos
            for verse_data in chapter_data['verses']:
                verse_number = verse_data['verse']
                text = verse_data['text'].strip()
                
                cursor.execute('''
                    INSERT INTO verses (book_id, chapter_number, verse_number, text, version)
                    VALUES (?, ?, ?, ?, ?)
                ''', (book_id, chapter_number, verse_number, text, 'PorBLivre'))
                
                total_verses += 1
        
        print(f"✅ {book_name_pt} ({book_order}/{total_books}) - {chapters_count} capítulos")
        book_order += 1
    
    conn.commit()
    conn.close()
    
    print(f"\n🎉 Importação concluída!")
    print(f"📚 {total_books} livros importados")
    print(f"📖 {total_verses} versículos importados")
    print(f"💾 Banco de dados salvo em: {db_path}")

if __name__ == "__main__":
    print("🚀 Iniciando importação da Bíblia completa...")
    create_database()
    import_bible_data()
    print("✨ Processo concluído com sucesso!")

