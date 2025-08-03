import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedTestament, setExpandedTestament] = useState('old');
  const [selectedBook, setSelectedBook] = useState('genesis');
  const [searchTerm, setSearchTerm] = useState('');

  const oldTestamentBooks = [
    { id: 'genesis', name: 'Gênesis', chapters: 50 },
    { id: 'exodus', name: 'Êxodo', chapters: 40 },
    { id: 'leviticus', name: 'Levítico', chapters: 27 },
    { id: 'numbers', name: 'Números', chapters: 36 },
    { id: 'deuteronomy', name: 'Deuteronômio', chapters: 34 },
    { id: 'joshua', name: 'Josué', chapters: 24 },
    { id: 'ruth', name: 'Rute', chapters: 4 },
    { id: 'samuel1', name: '1 Samuel', chapters: 31 },
    { id: 'samuel2', name: '2 Samuel', chapters: 24 },
    { id: 'kings1', name: '1 Reis', chapters: 22 },
    { id: 'psalms', name: 'Salmos', chapters: 150 },
    { id: 'proverbs', name: 'Provérbios', chapters: 31 }
  ];

  const newTestamentBooks = [
    { id: 'matthew', name: 'Mateus', chapters: 28 },
    { id: 'mark', name: 'Marcos', chapters: 16 },
    { id: 'luke', name: 'Lucas', chapters: 24 },
    { id: 'john', name: 'João', chapters: 21 },
    { id: 'acts', name: 'Atos', chapters: 28 },
    { id: 'romans', name: 'Romanos', chapters: 16 },
    { id: 'corinthians1', name: '1 Coríntios', chapters: 16 },
    { id: 'corinthians2', name: '2 Coríntios', chapters: 13 },
    { id: 'galatians', name: 'Gálatas', chapters: 6 },
    { id: 'ephesians', name: 'Efésios', chapters: 6 }
  ];

  const toggleTestament = (testament) => {
    setExpandedTestament(expandedTestament === testament ? null : testament);
  };

  const selectBook = (bookId) => {
    setSelectedBook(bookId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  const filteredOldBooks = oldTestamentBooks.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNewBooks = newTestamentBooks.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative top-0 left-0 h-full z-50 bg-gray-50 border-r border-gray-200 overflow-y-auto
        transition-transform duration-300 ease-in-out
        w-80 md:w-72 lg:w-80
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-3 md:p-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-800">Navegação</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Books */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar livro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Old Testament */}
          <div className="mb-4">
            <button
              onClick={() => toggleTestament('old')}
              className="flex items-center justify-between w-full p-2 text-left font-semibold text-gray-700 hover:bg-gray-100 rounded-md text-sm md:text-base"
            >
              <span>ANTIGO TESTAMENTO</span>
              {expandedTestament === 'old' ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {expandedTestament === 'old' && (
              <div className="ml-2 md:ml-4 mt-2 space-y-1 max-h-64 md:max-h-80 overflow-y-auto">
                {filteredOldBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => selectBook(book.id)}
                    className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                      selectedBook === book.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{book.name}</span>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{book.chapters}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Testament */}
          <div className="mb-4">
            <button
              onClick={() => toggleTestament('new')}
              className="flex items-center justify-between w-full p-2 text-left font-semibold text-gray-700 hover:bg-gray-100 rounded-md text-sm md:text-base"
            >
              <span>NOVO TESTAMENTO</span>
              {expandedTestament === 'new' ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {expandedTestament === 'new' && (
              <div className="ml-2 md:ml-4 mt-2 space-y-1 max-h-64 md:max-h-80 overflow-y-auto">
                {filteredNewBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => selectBook(book.id)}
                    className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                      selectedBook === book.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{book.name}</span>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{book.chapters}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Recent Readings */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">RECENTES</h3>
            <div className="space-y-1">
              <button 
                onClick={() => selectBook('genesis')}
                className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Gênesis 1
              </button>
              <button 
                onClick={() => selectBook('john')}
                className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                João 3
              </button>
              <button 
                onClick={() => selectBook('psalms')}
                className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Salmos 23
              </button>
            </div>
          </div>

          {/* Quick Navigation for Mobile */}
          <div className="lg:hidden mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">ACESSO RÁPIDO</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => selectBook('genesis')}
                className="p-2 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                Gênesis
              </button>
              <button 
                onClick={() => selectBook('psalms')}
                className="p-2 text-xs bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                Salmos
              </button>
              <button 
                onClick={() => selectBook('matthew')}
                className="p-2 text-xs bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
              >
                Mateus
              </button>
              <button 
                onClick={() => selectBook('john')}
                className="p-2 text-xs bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors"
              >
                João
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

