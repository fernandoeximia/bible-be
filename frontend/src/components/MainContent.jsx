import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

const MainContent = () => {
  const [selectedText, setSelectedText] = useState('');
  const [showAnnotationMenu, setShowAnnotationMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
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

  // Dados de exemplo para Gênesis 1
  const chapterData = {
    book: 'Gênesis',
    chapter: 1,
    verses: [
      {
        number: 1,
        text: 'No princípio, Deus criou os céus e a terra.',
        annotations: []
      },
      {
        number: 2,
        text: 'A terra era sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava sobre as águas.',
        annotations: []
      },
      {
        number: 3,
        text: 'Disse Deus: "Haja luz!" E houve luz.',
        annotations: [{ type: 'highlight', color: 'bg-yellow-200' }]
      },
      {
        number: 4,
        text: 'Deus viu que a luz era boa. Deus separou a luz das trevas.',
        annotations: [{ type: 'highlight', color: 'bg-yellow-200' }]
      },
      {
        number: 5,
        text: 'Deus chamou à luz Dia e às trevas chamou Noite. Houve tarde e manhã, o primeiro dia.',
        annotations: []
      },
      {
        number: 6,
        text: 'Disse Deus: "Haja um firmamento no meio das águas, e que ele separe águas de águas."',
        annotations: []
      },
      {
        number: 7,
        text: 'Então Deus fez o firmamento e separou as águas que ficaram abaixo do firmamento das que ficaram por cima. E assim foi.',
        annotations: []
      },
      {
        number: 8,
        text: 'Deus chamou ao firmamento céu. Houve tarde e manhã: foi o segundo dia.',
        annotations: []
      }
    ]
  };

  const handleTextSelection = (event) => {
    // Disable text selection menu on mobile for better UX
    if (isMobile) return;
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(selectedText);
      setMenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setShowAnnotationMenu(true);
    } else {
      setShowAnnotationMenu(false);
    }
  };

  const handleVerseClick = (verse) => {
    if (isMobile) {
      // On mobile, show a simplified annotation menu
      setSelectedText(verse.text);
      setShowAnnotationMenu(true);
      setMenuPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
  };

  const handleAnnotation = (type, color = null) => {
    console.log('Annotation:', { type, color, text: selectedText });
    setShowAnnotationMenu(false);
    setSelectedText('');
  };

  const annotationColors = [
    { name: 'Amarelo', color: 'bg-yellow-200', value: '#FFF3CD' },
    { name: 'Verde', color: 'bg-green-200', value: '#D4EDDA' },
    { name: 'Azul', color: 'bg-blue-200', value: '#CCE5FF' },
    { name: 'Rosa', color: 'bg-pink-200', value: '#F8D7DA' },
    { name: 'Laranja', color: 'bg-orange-200', value: '#FFE4B5' },
    { name: 'Roxo', color: 'bg-purple-200', value: '#E2D9F3' }
  ];

  const fontSizeClasses = {
    small: 'text-sm md:text-base',
    base: 'text-base md:text-lg',
    large: 'text-lg md:text-xl',
    xlarge: 'text-xl md:text-2xl'
  };

  return (
    <main className="flex-1 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Chapter Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-800 mb-1 md:mb-2">
            {chapterData.book}
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl font-serif text-gray-600">
            Capítulo {chapterData.chapter}
          </h2>
        </div>

        {/* Font Size Controls - Mobile */}
        <div className="md:hidden mb-4 flex items-center justify-center space-x-2">
          <span className="text-xs text-gray-500">Aa</span>
          <div className="flex space-x-1">
            {Object.keys(fontSizeClasses).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  fontSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {size === 'small' ? 'S' : size === 'base' ? 'M' : size === 'large' ? 'L' : 'XL'}
              </button>
            ))}
          </div>
          <span className="text-lg text-gray-500">Aa</span>
        </div>

        {/* Verses */}
        <div className="space-y-3 md:space-y-4" onMouseUp={handleTextSelection}>
          {chapterData.verses.map((verse) => (
            <div key={verse.number} className="flex group">
              {/* Verse Number */}
              <span className="text-xs md:text-sm font-bold text-gray-400 mr-3 md:mr-4 mt-1 min-w-[1.5rem] md:min-w-[2rem] select-none flex-shrink-0">
                {verse.number}
              </span>
              
              {/* Verse Text */}
              <div className="flex-1">
                <p 
                  className={`${fontSizeClasses[fontSize]} leading-relaxed font-serif text-gray-800 cursor-text ${
                    verse.annotations.length > 0 ? verse.annotations[0].color : ''
                  } ${isMobile ? 'select-none' : ''}`}
                  onClick={() => handleVerseClick(verse)}
                >
                  {verse.text}
                </p>
                
                {/* Mobile Annotation Button */}
                {isMobile && (
                  <button
                    onClick={() => handleVerseClick(verse)}
                    className="mt-2 flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Anotar</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 md:mt-12">
          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-center items-center space-x-8">
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
              <ChevronLeft className="h-5 w-5" />
              <span>Anterior</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors">
                1
              </button>
              <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                2
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors">
                3
              </button>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
              <span>Próximo</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex justify-between items-center mb-4">
              <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm text-gray-600 transition-colors">
                  1
                </button>
                <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                  2
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm text-gray-600 transition-colors">
                  3
                </button>
              </div>
              
              <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                <span>Próximo</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Annotation Menu */}
      {showAnnotationMenu && (
        <div
          className={`fixed bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 ${
            isMobile ? 'inset-x-4 top-1/2 transform -translate-y-1/2' : ''
          }`}
          style={!isMobile ? {
            left: menuPosition.x - 150,
            top: menuPosition.y - 120
          } : {}}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Adicionar Anotação</h3>
            {isMobile && (
              <button
                onClick={() => setShowAnnotationMenu(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          
          {/* Selected Text Preview for Mobile */}
          {isMobile && (
            <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600 max-h-20 overflow-y-auto">
              {selectedText.length > 100 ? selectedText.substring(0, 100) + '...' : selectedText}
            </div>
          )}
          
          {/* Highlight Colors */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Destacar:</p>
            <div className={`grid ${isMobile ? 'grid-cols-3' : 'flex'} gap-2`}>
              {annotationColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleAnnotation('highlight', color.value)}
                  className={`${isMobile ? 'w-full h-8' : 'w-6 h-6'} rounded ${color.color} border border-gray-300 hover:scale-110 transition-transform flex items-center justify-center`}
                  title={color.name}
                >
                  {isMobile && <span className="text-xs font-medium">{color.name}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`${isMobile ? 'grid grid-cols-2 gap-2' : 'flex space-x-2'}`}>
            <button
              onClick={() => handleAnnotation('note')}
              className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Adicionar Nota
            </button>
            <button
              onClick={() => handleAnnotation('bookmark')}
              className="px-3 py-2 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Marcar
            </button>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {showAnnotationMenu && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowAnnotationMenu(false)}
        />
      )}
    </main>
  );
};

export default MainContent;

