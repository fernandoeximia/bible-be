import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, MessageCircle } from 'lucide-react';

const MainContent = ({ selectedBook, selectedChapter, onAnnotationClick, onChapterChange }) => {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [totalChapters, setTotalChapters] = useState(1);
  const [fontSize, setFontSize] = useState('base');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (selectedBook && selectedChapter) {
      fetchChapter();
      fetchAnnotations();
    }
  }, [selectedBook, selectedChapter]);

  const fetchChapter = async () => {
    if (!selectedBook || !selectedChapter) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/books/${selectedBook.id}/chapters/${selectedChapter}`);
      const data = await response.json();
      
      if (data.success) {
        setVerses(data.data.verses || []);
        setTotalChapters(data.data.total_chapters || 1);
      } else {
        setError(data.error || 'Erro ao carregar capítulo');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Error fetching chapter:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnotations = async () => {
    try {
      const response = await fetch('/api/annotations');
      const data = await response.json();
      
      if (data.success) {
        setAnnotations(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching annotations:', err);
    }
  };

  const getVerseAnnotation = (verseId) => {
    return annotations.find(ann => ann.verse_id === verseId);
  };

  const handleVerseClick = (verse) => {
    const annotation = getVerseAnnotation(verse.id);
    if (onAnnotationClick) {
      onAnnotationClick(verse, annotation);
    }
  };

  const navigateChapter = (direction) => {
    const newChapter = direction === 'prev' ? selectedChapter - 1 : selectedChapter + 1;
    if (newChapter >= 1 && newChapter <= totalChapters && onChapterChange) {
      onChapterChange(selectedBook, newChapter);
    }
  };

  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (!selectedBook) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Selecione um livro
          </h2>
          <p className="text-gray-500">
            Escolha um livro na barra lateral para começar a leitura
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando capítulo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-red-800 font-medium mb-2">Erro ao carregar</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white overflow-hidden flex flex-col">
      {/* Header do capítulo */}
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {selectedBook.name} {selectedChapter}
              </h1>
              <p className="text-gray-600 mt-1">
                {verses.length} versículos
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-4 md:mt-0">
              {/* Controles de fonte - Mobile */}
              {isMobile && (
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-sm text-gray-600">Fonte:</span>
                  {['sm', 'base', 'lg', 'xl'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        fontSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size === 'sm' ? 'S' : size === 'base' ? 'M' : size === 'lg' ? 'L' : 'XL'}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Navegação entre capítulos */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateChapter('prev')}
                  disabled={selectedChapter <= 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium">
                  {selectedChapter} / {totalChapters}
                </span>
                
                <button
                  onClick={() => navigateChapter('next')}
                  disabled={selectedChapter >= totalChapters}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo dos versículos */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {verses.map((verse) => {
              const annotation = getVerseAnnotation(verse.id);
              const hasAnnotation = !!annotation;
              
              return (
                <div
                  key={verse.id}
                  className={`group relative p-4 rounded-lg cursor-pointer transition-all ${
                    hasAnnotation
                      ? `bg-${annotation.color}-50 border border-${annotation.color}-200`
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleVerseClick(verse)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                      {verse.verse_num}
                    </span>
                    
                    <div className="flex-1">
                      <p className={`text-gray-900 leading-relaxed font-serif ${fontSizeClasses[fontSize]}`}>
                        {verse.text}
                      </p>
                      
                      {hasAnnotation && annotation.note && (
                        <div className="mt-2 p-2 bg-white bg-opacity-50 rounded border-l-4 border-blue-400">
                          <div className="flex items-center space-x-1 mb-1">
                            <MessageCircle size={14} className="text-blue-600" />
                            <span className="text-xs font-medium text-blue-800">Anotação</span>
                          </div>
                          <p className="text-sm text-gray-700">{annotation.note}</p>
                        </div>
                      )}
                    </div>
                    
                    {hasAnnotation && (
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full bg-${annotation.color}-400`}></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;

