import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [expandedTestament, setExpandedTestament] = useState('old');
  const [selectedBook, setSelectedBook] = useState('genesis');

  const oldTestamentBooks = [
    { id: 'genesis', name: 'Gênesis', chapters: 50 },
    { id: 'exodus', name: 'Êxodo', chapters: 40 },
    { id: 'leviticus', name: 'Levítico', chapters: 27 },
    { id: 'numbers', name: 'Números', chapters: 36 },
    { id: 'deuteronomy', name: 'Deuteronômio', chapters: 34 },
    { id: 'joshua', name: 'Josué', chapters: 24 },
    { id: 'ruth', name: 'Rute', chapters: 4 }
  ];

  const newTestamentBooks = [
    { id: 'matthew', name: 'Mateus', chapters: 28 },
    { id: 'mark', name: 'Marcos', chapters: 16 },
    { id: 'luke', name: 'Lucas', chapters: 24 },
    { id: 'john', name: 'João', chapters: 21 },
    { id: 'acts', name: 'Atos', chapters: 28 }
  ];

  const toggleTestament = (testament) => {
    setExpandedTestament(expandedTestament === testament ? null : testament);
  };

  const selectBook = (bookId) => {
    setSelectedBook(bookId);
  };

  return (
    <aside className="w-80 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        {/* Search Books */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar livro..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Old Testament */}
        <div className="mb-4">
          <button
            onClick={() => toggleTestament('old')}
            className="flex items-center justify-between w-full p-2 text-left font-semibold text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <span>ANTIGO TESTAMENTO</span>
            {expandedTestament === 'old' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedTestament === 'old' && (
            <div className="ml-4 mt-2 space-y-1">
              {oldTestamentBooks.map((book) => (
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
                    <span>{book.name}</span>
                    <span className="text-xs text-gray-400">{book.chapters}</span>
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
            className="flex items-center justify-between w-full p-2 text-left font-semibold text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <span>NOVO TESTAMENTO</span>
            {expandedTestament === 'new' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedTestament === 'new' && (
            <div className="ml-4 mt-2 space-y-1">
              {newTestamentBooks.map((book) => (
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
                    <span>{book.name}</span>
                    <span className="text-xs text-gray-400">{book.chapters}</span>
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
            <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
              Gênesis 1
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
              João 3
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
              Salmos 23
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

