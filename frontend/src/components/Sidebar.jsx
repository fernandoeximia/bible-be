import React, { useState, useEffect } from 'react';
import { Search, X, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, onBookSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTestament, setExpandedTestament] = useState('Antigo Testamento');

  // Load books from API
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/books');
        const result = await response.json();
        
        if (result.success) {
          setBooks(result.data);
        } else {
          setError(result.error || 'Erro ao carregar livros');
        }
      } catch (err) {
        setError('Erro de conexão com o servidor');
        console.error('Error loading books:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  // Filter books based on search term
  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group books by testament
  const oldTestamentBooks = filteredBooks.filter(book => book.testament === 'old');
  const newTestamentBooks = filteredBooks.filter(book => book.testament === 'new');

  const handleBookClick = (book) => {
    console.log('Livro selecionado:', book.name);
    // Navigate to first chapter of the book
    if (onBookSelect) {
      onBookSelect(book.id, 1, book.name);
    }
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const toggleTestament = (testament) => {
    setExpandedTestament(expandedTestament === testament ? null : testament);
  };

  if (loading) {
    return (
      <div className={`
        fixed md:relative top-0 left-0 h-full w-80 bg-gray-50 border-r border-gray-200 z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`
        fixed md:relative top-0 left-0 h-full w-80 bg-gray-50 border-r border-gray-200 z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium text-sm">Erro ao carregar livros</h3>
            <p className="text-red-600 text-xs mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 left-0 h-full w-80 bg-gray-50 border-r border-gray-200 z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Livros</h2>
              <button
                onClick={onClose}
                className="md:hidden p-1 hover:bg-gray-200 rounded"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar livro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Books List */}
          <div className="flex-1 overflow-y-auto">
            {/* Old Testament */}
            <div className="p-4">
              <button
                onClick={() => toggleTestament('Antigo Testamento')}
                className="w-full flex items-center justify-between p-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors mb-2"
              >
                <span className="font-medium text-purple-800">ANTIGO TESTAMENTO</span>
                <span className="text-purple-600">
                  {expandedTestament === 'Antigo Testamento' ? 
                    <ChevronDown size={16} /> : <ChevronRight size={16} />
                  }
                </span>
              </button>
              
              {expandedTestament === 'Antigo Testamento' && (
                <div className="space-y-1 ml-2">
                  {oldTestamentBooks.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleBookClick(book)}
                      className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-200 rounded transition-colors group"
                    >
                      <span className="text-gray-700 group-hover:text-gray-900">
                        {book.name}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {book.chapters_count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New Testament */}
            <div className="px-4 pb-4">
              <button
                onClick={() => toggleTestament('Novo Testamento')}
                className="w-full flex items-center justify-between p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors mb-2"
              >
                <span className="font-medium text-blue-800">NOVO TESTAMENTO</span>
                <span className="text-blue-600">
                  {expandedTestament === 'Novo Testamento' ? 
                    <ChevronDown size={16} /> : <ChevronRight size={16} />
                  }
                </span>
              </button>
              
              {expandedTestament === 'Novo Testamento' && (
                <div className="space-y-1 ml-2">
                  {newTestamentBooks.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleBookClick(book)}
                      className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-200 rounded transition-colors group"
                    >
                      <span className="text-gray-700 group-hover:text-gray-900">
                        {book.name}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {book.chapters_count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Readings */}
            <div className="px-4 pb-4">
              <h3 className="font-medium text-gray-900 mb-3">RECENTES</h3>
              <div className="space-y-1">
                {[
                  { name: 'Gênesis 1', chapters: '17' },
                  { name: 'João 3', chapters: '16' },
                  { name: 'Salmos 23', chapters: '6' }
                ].map((recent, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-200 rounded transition-colors group"
                  >
                    <span className="text-gray-700 group-hover:text-gray-900">
                      {recent.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {recent.chapters}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

