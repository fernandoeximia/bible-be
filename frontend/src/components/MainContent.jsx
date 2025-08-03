import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const MainContent = () => {
  const [selectedText, setSelectedText] = useState('');
  const [showAnnotationMenu, setShowAnnotationMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

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
      }
    ]
  };

  const handleTextSelection = (event) => {
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

  return (
    <main className="flex-1 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Chapter Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">
            {chapterData.book}
          </h1>
          <h2 className="text-2xl font-serif text-gray-600">
            Capítulo {chapterData.chapter}
          </h2>
        </div>

        {/* Verses */}
        <div className="space-y-4" onMouseUp={handleTextSelection}>
          {chapterData.verses.map((verse) => (
            <div key={verse.number} className="flex group">
              {/* Verse Number */}
              <span className="text-sm font-bold text-gray-400 mr-4 mt-1 min-w-[2rem] select-none">
                {verse.number}
              </span>
              
              {/* Verse Text */}
              <p className={`text-lg leading-relaxed font-serif text-gray-800 cursor-text ${
                verse.annotations.length > 0 ? verse.annotations[0].color : ''
              }`}>
                {verse.text}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center mt-12 space-x-8">
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
      </div>

      {/* Annotation Menu */}
      {showAnnotationMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
          style={{
            left: menuPosition.x - 150,
            top: menuPosition.y - 120
          }}
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Adicionar Anotação</h3>
          
          {/* Highlight Colors */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Destacar:</p>
            <div className="flex space-x-2">
              {annotationColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleAnnotation('highlight', color.value)}
                  className={`w-6 h-6 rounded ${color.color} border border-gray-300 hover:scale-110 transition-transform`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleAnnotation('note')}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Adicionar Nota
            </button>
            <button
              onClick={() => handleAnnotation('bookmark')}
              className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Marcar
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default MainContent;

