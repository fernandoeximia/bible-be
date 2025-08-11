#!/usr/bin/env python3
"""
Script para importar dados completos da Bíblia
"""
import json
import os
import sys

# Add src to path
sys.path.insert(0, 'src')

from src.main import app, db
from src.models.bible import Book, Chapter, Verse

def import_complete_bible():
    """Importa dados completos da Bíblia NVI"""
    
    # Mapeamento de nomes para abreviações
    book_abbreviations = {
        "Gênesis": "Gn", "Êxodo": "Ex", "Levítico": "Lv", "Números": "Nm", "Deuteronômio": "Dt",
        "Josué": "Js", "Juízes": "Jz", "Rute": "Rt", "1 Samuel": "1Sm", "2 Samuel": "2Sm",
        "1 Reis": "1Rs", "2 Reis": "2Rs", "1 Crônicas": "1Cr", "2 Crônicas": "2Cr",
        "Esdras": "Ed", "Neemias": "Ne", "Ester": "Et", "Jó": "Jó", "Salmos": "Sl",
        "Provérbios": "Pv", "Eclesiastes": "Ec", "Cânticos": "Ct", "Isaías": "Is",
        "Jeremias": "Jr", "Lamentações": "Lm", "Ezequiel": "Ez", "Daniel": "Dn",
        "Oséias": "Os", "Joel": "Jl", "Amós": "Am", "Obadias": "Ob", "Jonas": "Jn",
        "Miquéias": "Mq", "Naum": "Na", "Habacuque": "Hc", "Sofonias": "Sf",
        "Ageu": "Ag", "Zacarias": "Zc", "Malaquias": "Ml", "Mateus": "Mt",
        "Marcos": "Mc", "Lucas": "Lc", "João": "Jo", "Atos": "At", "Romanos": "Rm",
        "1 Coríntios": "1Co", "2 Coríntios": "2Co", "Gálatas": "Gl", "Efésios": "Ef",
        "Filipenses": "Fp", "Colossenses": "Cl", "1 Tessalonicenses": "1Ts",
        "2 Tessalonicenses": "2Ts", "1 Timóteo": "1Tm", "2 Timóteo": "2Tm",
        "Tito": "Tt", "Filemom": "Fm", "Hebreus": "Hb", "Tiago": "Tg",
        "1 Pedro": "1Pe", "2 Pedro": "2Pe", "1 João": "1Jo", "2 João": "2Jo",
        "3 João": "3Jo", "Judas": "Jd", "Apocalipse": "Ap"
    }
    
    with app.app_context():
        print("Iniciando importação da Bíblia completa...")
        
        # Carregar dados JSON
        with open('nvi_complete.json', 'r', encoding='utf-8-sig') as f:
            bible_data = json.load(f)
        
        # Limpar dados existentes
        db.session.query(Verse).delete()
        db.session.query(Chapter).delete()
        db.session.query(Book).delete()
        db.session.commit()
        
        book_order = 1
        
        for book_data in bible_data:
            book_name = book_data['name']
            book_chapters = book_data['chapters']
            
            # Determinar testamento
            testament = "Antigo Testamento" if book_order <= 39 else "Novo Testamento"
            
            # Criar livro
            book = Book(
                name=book_name,
                abbreviation=book_abbreviations.get(book_name, book_name[:3]),
                testament=testament,
                order=book_order,
                chapters_count=len(book_chapters)
            )
            db.session.add(book)
            db.session.flush()  # Para obter o ID
            
            print(f"Importando {book_name}...")
            
            for chapter_num, verses_data in enumerate(book_chapters, 1):
                # Criar capítulo
                chapter = Chapter(
                    book_id=book.id,
                    number=chapter_num,
                    verses_count=len(verses_data)
                )
                db.session.add(chapter)
                db.session.flush()  # Para obter o ID
                
                for verse_num, verse_text in enumerate(verses_data, 1):
                    # Criar versículo
                    verse = Verse(
                        chapter_id=chapter.id,
                        number=verse_num,
                        text=verse_text
                    )
                    db.session.add(verse)
            
            book_order += 1
        
        # Salvar todas as alterações
        db.session.commit()
        
        # Verificar importação
        total_books = db.session.query(Book).count()
        total_chapters = db.session.query(Chapter).count()
        total_verses = db.session.query(Verse).count()
        
        print(f"Importação concluída!")
        print(f"- {total_books} livros")
        print(f"- {total_chapters} capítulos")
        print(f"- {total_verses} versículos")

if __name__ == "__main__":
    import_complete_bible()

