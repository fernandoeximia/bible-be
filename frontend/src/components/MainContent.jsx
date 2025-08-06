import { useState, useEffect } from 'react';

const MainContent = () => {
  const [selectedText, setSelectedText] = useState('');
  const [showAnnotationMenu, setShowAnnotationMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState('base');
  const [isMobile, setIsMobile] = useState(false);
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [annotations, setAnnotations] = useState([]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load chapter data from API
  useEffect(() => {
    const loadChapterData = async () => {
      try {
        setLoading(true);
        // Load Gênesis 1 by default
        const response = await fetch('/api/books/1/chapters/1');
        const result = await response.json();
        
        if (result.success) {
          setChapterData(result.data);
          
          // Load annotations for this chapter
          const annotationsResponse = await fetch('/api/annotations');
          const annotationsResult = await annotationsResponse.json();
          
          if (annotationsResult.success) {
            setAnnotations(annotationsResult.data);
          }
        } else {
          setError(result.error || 'Erro ao carregar capítulo');
        }
      } catch (err) {
        setError('Erro de conexão com o servidor');
        console.error('Error loading chapter:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChapterData();
  }, []);

  // Get annotations for a specific verse
  const getVerseAnnotations = (verseId) => {
    return annotations.filter(annotation => annotation.verse_id === verseId);
  };

  // Get highlight color for verse
  const getVerseHighlight = (verseId) => {
    const verseAnnotations = getVerseAnnotations(verseId);
    const highlight = verseAnnotations.find(ann => ann.type === 'highlight');
    
    if (highlight && highlight.color) {
      // Convert hex color to Tailwind-like background
      const colorMap = {
        '#FFF3CD': 'bg-yellow-100',
        '#D4EDDA': 'bg-green-100',
        '#D1ECF1': 'bg-blue-100',
        '#F8D7DA': 'bg-red-100',
        '#E2E3E5': 'bg-gray-100',
        '#FCF8E3': 'bg-yellow-50'
      };
      return colorMap[highlight.color] || 'bg-yellow-100';
    }
    return '';
  };

  const handleTextSelection = (e, verseNumber) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text && text.length > 0) {
      setSelectedText(text);
      setMenuPosition({ x: e.clientX, y: e.clientY });
      setShowAnnotationMenu(true);
    }
  };

  const handleAnnotation = (type, color = null) => {
    console.log(`Anotação ${type} criada:`, selectedText);
    if (color) {
      console.log('Cor:', color);
    }
    setShowAnnotationMenu(false);
    setSelectedText('');
  };

  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-6 bg-white overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 md:p-6 bg-white overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Erro ao carregar conteúdo</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="flex-1 p-4 md:p-6 bg-white overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Nenhum conteúdo disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {chapterData.book.name}
            </h1>
            <p className="text-lg text-gray-600">Capítulo {chapterData.number}</p>
          </div>
          
          {/* Font size controls - Mobile */}
          {isMobile && (
            <div className="flex items-center gap-2 mt-4 md:mt-0">
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
        </div>

        {/* Verses */}
        <div className="space-y-4">
          {chapterData.verses.map((verse) => {
            const highlight = getVerseHighlight(verse.id);
            const verseAnnotations = getVerseAnnotations(verse.id);
            
            return (
              <div
                key={verse.number}
                className={`flex gap-4 p-3 rounded-lg transition-colors ${highlight} hover:bg-gray-50`}
                onMouseUp={(e) => handleTextSelection(e, verse.number)}
              >
                <span className="text-blue-600 font-bold text-sm md:text-base min-w-[2rem] flex-shrink-0">
                  {verse.number}
                </span>
                <div className="flex-1">
                  <p className={`${fontSizeClasses[fontSize]} leading-relaxed text-gray-800 font-serif`}>
                    {verse.text}
                  </p>
                  
                  {/* Show annotations */}
                  {verseAnnotations.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {verseAnnotations.map((annotation) => (
                        annotation.note_text && (
                          <div key={annotation.id} className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
                            📝 {annotation.note_text}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chapter Navigation */}
        <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <span>←</span>
            <span className="hidden md:inline">Anterior</span>
          </button>
          
          <div className="flex gap-2">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className={`w-8 h-8 rounded ${
                  num === 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <span className="hidden md:inline">Próximo</span>
            <span>→</span>
          </button>
        </div>

        {/* Recent Readings */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leituras Recentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { book: 'Gênesis', chapter: '1', verses: '17' },
              { book: 'João', chapter: '3', verses: '16' },
              { book: 'Salmos', chapter: '23', verses: '6' }
            ].map((reading, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <h4 className="font-medium text-gray-900">{reading.book} {reading.chapter}</h4>
                <p className="text-sm text-gray-600">{reading.verses} versículos</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Annotation Menu */}
      {showAnnotationMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => handleAnnotation('highlight', '#FFF3CD')}
              className="w-6 h-6 bg-yellow-200 rounded border hover:scale-110 transition-transform"
              title="Destacar em amarelo"
            />
            <button
              onClick={() => handleAnnotation('highlight', '#D4EDDA')}
              className="w-6 h-6 bg-green-200 rounded border hover:scale-110 transition-transform"
              title="Destacar em verde"
            />
            <button
              onClick={() => handleAnnotation('highlight', '#D1ECF1')}
              className="w-6 h-6 bg-blue-200 rounded border hover:scale-110 transition-transform"
              title="Destacar em azul"
            />
          </div>
          <button
            onClick={() => handleAnnotation('note')}
            className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
          >
            📝 Adicionar nota
          </button>
        </div>
      )}

      {/* Click outside to close menu */}
      {showAnnotationMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowAnnotationMenu(false)}
        />
      )}
    </div>
  );
};

export default MainContent;

