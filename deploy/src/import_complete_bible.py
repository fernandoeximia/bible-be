#!/usr/bin/env python3
"""
Script para importar dados completos da Bíblia NVI para o banco de dados SQLite
"""

import json
import sqlite3
import os
from pathlib import Path

def create_database_schema(cursor):
    """Criar tabelas do banco de dados"""
    
    # Tabela de livros
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            abbrev TEXT NOT NULL,
            testament TEXT NOT NULL,
            order_num INTEGER NOT NULL
        )
    ''')
    
    # Tabela de capítulos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chapters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL,
            chapter_num INTEGER NOT NULL,
            verse_count INTEGER NOT NULL,
            FOREIGN KEY (book_id) REFERENCES books (id)
        )
    ''')
    
    # Tabela de versículos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS verses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL,
            chapter_num INTEGER NOT NULL,
            verse_num INTEGER NOT NULL,
            text TEXT NOT NULL,
            FOREIGN KEY (book_id) REFERENCES books (id)
        )
    ''')
    
    # Tabela de anotações
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS annotations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            verse_id INTEGER NOT NULL,
            color TEXT NOT NULL DEFAULT 'yellow',
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (verse_id) REFERENCES verses (id)
        )
    ''')

def get_book_info():
    """Retorna informações sobre os livros da Bíblia"""
    books_info = [
        # Antigo Testamento
        {"abbrev": "gn", "name": "Gênesis", "testament": "old", "order": 1},
        {"abbrev": "ex", "name": "Êxodo", "testament": "old", "order": 2},
        {"abbrev": "lv", "name": "Levítico", "testament": "old", "order": 3},
        {"abbrev": "nm", "name": "Números", "testament": "old", "order": 4},
        {"abbrev": "dt", "name": "Deuteronômio", "testament": "old", "order": 5},
        {"abbrev": "js", "name": "Josué", "testament": "old", "order": 6},
        {"abbrev": "jz", "name": "Juízes", "testament": "old", "order": 7},
        {"abbrev": "rt", "name": "Rute", "testament": "old", "order": 8},
        {"abbrev": "1sm", "name": "1 Samuel", "testament": "old", "order": 9},
        {"abbrev": "2sm", "name": "2 Samuel", "testament": "old", "order": 10},
        {"abbrev": "1rs", "name": "1 Reis", "testament": "old", "order": 11},
        {"abbrev": "2rs", "name": "2 Reis", "testament": "old", "order": 12},
        {"abbrev": "1cr", "name": "1 Crônicas", "testament": "old", "order": 13},
        {"abbrev": "2cr", "name": "2 Crônicas", "testament": "old", "order": 14},
        {"abbrev": "ed", "name": "Esdras", "testament": "old", "order": 15},
        {"abbrev": "ne", "name": "Neemias", "testament": "old", "order": 16},
        {"abbrev": "et", "name": "Ester", "testament": "old", "order": 17},
        {"abbrev": "jó", "name": "Jó", "testament": "old", "order": 18},
        {"abbrev": "sl", "name": "Salmos", "testament": "old", "order": 19},
        {"abbrev": "pv", "name": "Provérbios", "testament": "old", "order": 20},
        {"abbrev": "ec", "name": "Eclesiastes", "testament": "old", "order": 21},
        {"abbrev": "ct", "name": "Cânticos", "testament": "old", "order": 22},
        {"abbrev": "is", "name": "Isaías", "testament": "old", "order": 23},
        {"abbrev": "jr", "name": "Jeremias", "testament": "old", "order": 24},
        {"abbrev": "lm", "name": "Lamentações", "testament": "old", "order": 25},
        {"abbrev": "ez", "name": "Ezequiel", "testament": "old", "order": 26},
        {"abbrev": "dn", "name": "Daniel", "testament": "old", "order": 27},
        {"abbrev": "os", "name": "Oséias", "testament": "old", "order": 28},
        {"abbrev": "jl", "name": "Joel", "testament": "old", "order": 29},
        {"abbrev": "am", "name": "Amós", "testament": "old", "order": 30},
        {"abbrev": "ob", "name": "Obadias", "testament": "old", "order": 31},
        {"abbrev": "jn", "name": "Jonas", "testament": "old", "order": 32},
        {"abbrev": "mq", "name": "Miquéias", "testament": "old", "order": 33},
        {"abbrev": "na", "name": "Naum", "testament": "old", "order": 34},
        {"abbrev": "hc", "name": "Habacuque", "testament": "old", "order": 35},
        {"abbrev": "sf", "name": "Sofonias", "testament": "old", "order": 36},
        {"abbrev": "ag", "name": "Ageu", "testament": "old", "order": 37},
        {"abbrev": "zc", "name": "Zacarias", "testament": "old", "order": 38},
        {"abbrev": "ml", "name": "Malaquias", "testament": "old", "order": 39},
        
        # Novo Testamento
        {"abbrev": "mt", "name": "Mateus", "testament": "new", "order": 40},
        {"abbrev": "mc", "name": "Marcos", "testament": "new", "order": 41},
        {"abbrev": "lc", "name": "Lucas", "testament": "new", "order": 42},
        {"abbrev": "jo", "name": "João", "testament": "new", "order": 43},
        {"abbrev": "atos", "name": "Atos", "testament": "new", "order": 44},
        {"abbrev": "rm", "name": "Romanos", "testament": "new", "order": 45},
        {"abbrev": "1co", "name": "1 Coríntios", "testament": "new", "order": 46},
        {"abbrev": "2co", "name": "2 Coríntios", "testament": "new", "order": 47},
        {"abbrev": "gl", "name": "Gálatas", "testament": "new", "order": 48},
        {"abbrev": "ef", "name": "Efésios", "testament": "new", "order": 49},
        {"abbrev": "fp", "name": "Filipenses", "testament": "new", "order": 50},
        {"abbrev": "cl", "name": "Colossenses", "testament": "new", "order": 51},
        {"abbrev": "1ts", "name": "1 Tessalonicenses", "testament": "new", "order": 52},
        {"abbrev": "2ts", "name": "2 Tessalonicenses", "testament": "new", "order": 53},
        {"abbrev": "1tm", "name": "1 Timóteo", "testament": "new", "order": 54},
        {"abbrev": "2tm", "name": "2 Timóteo", "testament": "new", "order": 55},
        {"abbrev": "tt", "name": "Tito", "testament": "new", "order": 56},
        {"abbrev": "fm", "name": "Filemom", "testament": "new", "order": 57},
        {"abbrev": "hb", "name": "Hebreus", "testament": "new", "order": 58},
        {"abbrev": "tg", "name": "Tiago", "testament": "new", "order": 59},
        {"abbrev": "1pe", "name": "1 Pedro", "testament": "new", "order": 60},
        {"abbrev": "2pe", "name": "2 Pedro", "testament": "new", "order": 61},
        {"abbrev": "1jo", "name": "1 João", "testament": "new", "order": 62},
        {"abbrev": "2jo", "name": "2 João", "testament": "new", "order": 63},
        {"abbrev": "3jo", "name": "3 João", "testament": "new", "order": 64},
        {"abbrev": "jd", "name": "Judas", "testament": "new", "order": 65},
        {"abbrev": "ap", "name": "Apocalipse", "testament": "new", "order": 66}
    ]
    return {book["abbrev"]: book for book in books_info}

def import_bible_data(json_file_path, db_path):
    """Importar dados da Bíblia do arquivo JSON para o banco SQLite"""
    
    # Conectar ao banco de dados
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Criar schema do banco
        create_database_schema(cursor)
        
        # Limpar dados existentes
        cursor.execute('DELETE FROM annotations')
        cursor.execute('DELETE FROM verses')
        cursor.execute('DELETE FROM chapters')
        cursor.execute('DELETE FROM books')
        
        # Carregar dados do JSON
        with open(json_file_path, 'r', encoding='utf-8-sig') as f:
            bible_data = json.load(f)
        
        # Obter informações dos livros
        books_info = get_book_info()
        
        print(f"Importando {len(bible_data)} livros da Bíblia...")
        
        for book_data in bible_data:
            abbrev = book_data['abbrev']
            chapters = book_data['chapters']
            
            # Obter informações do livro
            if abbrev not in books_info:
                print(f"Aviso: Livro {abbrev} não encontrado na lista de livros conhecidos")
                continue
                
            book_info = books_info[abbrev]
            
            # Inserir livro
            cursor.execute('''
                INSERT INTO books (name, abbrev, testament, order_num)
                VALUES (?, ?, ?, ?)
            ''', (book_info['name'], abbrev, book_info['testament'], book_info['order']))
            
            book_id = cursor.lastrowid
            
            print(f"Importando {book_info['name']} ({len(chapters)} capítulos)...")
            
            # Inserir capítulos e versículos
            for chapter_num, verses in enumerate(chapters, 1):
                # Inserir capítulo
                cursor.execute('''
                    INSERT INTO chapters (book_id, chapter_num, verse_count)
                    VALUES (?, ?, ?)
                ''', (book_id, chapter_num, len(verses)))
                
                # Inserir versículos
                for verse_num, verse_text in enumerate(verses, 1):
                    cursor.execute('''
                        INSERT INTO verses (book_id, chapter_num, verse_num, text)
                        VALUES (?, ?, ?, ?)
                    ''', (book_id, chapter_num, verse_num, verse_text))
        
        # Inserir algumas anotações de exemplo
        cursor.execute('''
            INSERT INTO annotations (verse_id, color, note)
            VALUES (3, 'yellow', 'Primeira menção da luz na criação')
        ''')
        
        cursor.execute('''
            INSERT INTO annotations (verse_id, color, note)
            VALUES (4, 'blue', 'Deus viu que a luz era boa')
        ''')
        
        cursor.execute('''
            INSERT INTO annotations (verse_id, color, note)
            VALUES (27, 'green', 'Criação do homem à imagem de Deus')
        ''')
        
        # Confirmar transação
        conn.commit()
        
        # Mostrar estatísticas
        cursor.execute('SELECT COUNT(*) FROM books')
        books_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM chapters')
        chapters_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM verses')
        verses_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM annotations')
        annotations_count = cursor.fetchone()[0]
        
        print(f"\n✅ Importação concluída com sucesso!")
        print(f"📚 Livros: {books_count}")
        print(f"📖 Capítulos: {chapters_count}")
        print(f"📝 Versículos: {verses_count}")
        print(f"🏷️ Anotações: {annotations_count}")
        
    except Exception as e:
        print(f"❌ Erro durante a importação: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

def main():
    """Função principal"""
    # Caminhos dos arquivos
    current_dir = Path(__file__).parent
    json_file = current_dir.parent.parent.parent / 'nvi_complete.json'
    db_file = current_dir.parent.parent.parent / 'bible.db'
    
    print("🚀 Iniciando importação da Bíblia completa...")
    print(f"📁 Arquivo JSON: {json_file}")
    print(f"🗄️ Banco de dados: {db_file}")
    
    if not json_file.exists():
        print(f"❌ Arquivo JSON não encontrado: {json_file}")
        return
    
    import_bible_data(str(json_file), str(db_file))

if __name__ == '__main__':
    main()

