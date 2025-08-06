import React, { useState } from 'react';
import { Search, Menu, BookOpen, ChevronDown, X, Settings } from 'lucide-react';

const Header = ({ onToggleSidebar, onToggleAnnotations, currentBookName, currentChapter, onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      // Use quick search endpoint
      const response = await fetch(`/api/search/quick?q=${encodeURIComponent(query)}`);
      const result = await response.json();
      
      if (result.success) {
        if (result.data.verses) {
          // Text search results
          setSearchResults([{
            type: 'verses',
            data: result.data.verses.slice(0, 5)
          }]);
        } else if (result.data.book) {
          // Reference search result
          setSearchResults([{
            type: 'reference',
            data: result.data
          }]);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSelect = (result) => {
    if (result.type === 'reference') {
      // Navigate to the reference
      if (onSearch) {
        onSearch({
          type: 'reference',
          book: result.data.book,
          chapter: result.data.chapter,
          verses: result.data.verses
        });
      }
    } else if (result.type === 'verses') {
      // Navigate to first verse result
      if (result.data.length > 0) {
        const firstVerse = result.data[0];
        if (onSearch) {
          onSearch({
            type: 'verse',
            book: firstVerse.book,
            chapter: firstVerse.chapter_num,
            verse: firstVerse.verse_num
          });
        }
      }
    }
    
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchExpanded(false);
  };

  return (
    <header className="bg-slate-800 text-white shadow-lg relative z-50">
      {/* Main Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left Section - Logo + Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-700 rounded-md transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">BIBLE-BE</h1>
                {currentBookName && (
                  <p className="text-xs text-gray-300 hidden sm:block">
                    {currentBookName} {currentChapter}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Center Section - Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar versículo (ex: João 3:16) ou texto..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchResults.map((result, index) => (
                    <div key={index}>
                      {result.type === 'reference' && (
                        <div className="p-3 border-b border-gray-100">
                          <div className="font-semibold text-gray-900 mb-2">
                            {result.data.book.name} {result.data.chapter}
                          </div>
                          {result.data.verses.map((verse, vIndex) => (
                            <button
                              key={vIndex}
                              onClick={() => handleSearchSelect(result)}
                              className="block w-full text-left p-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                            >
                              <span className="font-medium">{verse.verse_num}.</span> {verse.text.substring(0, 100)}...
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {result.type === 'verses' && (
                        <div className="p-3">
                          <div className="font-semibold text-gray-900 mb-2">Resultados da busca</div>
                          {result.data.map((verse, vIndex) => (
                            <button
                              key={vIndex}
                              onClick={() => handleSearchSelect(result)}
                              className="block w-full text-left p-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                            >
                              <span className="font-medium">{verse.reference}</span>
                              <div className="text-xs text-gray-500 mt-1">
                                {verse.text.substring(0, 100)}...
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {isSearching && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50">
                  <div className="text-gray-500 text-sm">Buscando...</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Search Button */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 hover:bg-gray-700 rounded-md transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Bible Version Selector - Hidden on small mobile */}
            <select className="hidden sm:block bg-gray-700 text-white px-2 sm:px-3 py-1 sm:py-2 text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="nvi">NVI</option>
              <option value="arc">ARC</option>
              <option value="nlt">NLT</option>
            </select>

            {/* Annotations Button */}
            <button 
              onClick={onToggleAnnotations}
              className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 hover:bg-blue-700 px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors"
            >
              <span className="hidden sm:inline text-sm sm:text-base">Anotações</span>
              <span className="sm:hidden text-xs">Notas</span>
              <span className="bg-blue-800 text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">3</span>
            </button>

            {/* Settings - Desktop only */}
            <button 
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-gray-700 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchExpanded && (
        <div className="md:hidden px-4 pb-3 border-t border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar versículo ou texto..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              autoFocus
            />
            
            {/* Mobile Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {searchResults.map((result, index) => (
                  <div key={index}>
                    {result.type === 'reference' && result.data.verses.map((verse, vIndex) => (
                      <button
                        key={vIndex}
                        onClick={() => handleSearchSelect(result)}
                        className="block w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 text-sm text-gray-700"
                      >
                        <div className="font-medium text-blue-600">
                          {result.data.book.name} {result.data.chapter}:{verse.verse_num}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {verse.text.substring(0, 80)}...
                        </div>
                      </button>
                    ))}
                    
                    {result.type === 'verses' && result.data.map((verse, vIndex) => (
                      <button
                        key={vIndex}
                        onClick={() => handleSearchSelect(result)}
                        className="block w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 text-sm text-gray-700"
                      >
                        <div className="font-medium text-blue-600">{verse.reference}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {verse.text.substring(0, 80)}...
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Settings Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-800 border-t border-gray-700 shadow-lg z-40">
          <div className="px-4 py-3 space-y-3">
            {/* Bible Version for Mobile */}
            <div className="sm:hidden">
              <label className="block text-sm text-gray-300 mb-1">Versão da Bíblia:</label>
              <select className="w-full bg-gray-700 text-white px-3 py-2 text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="nvi">Nova Versão Internacional (NVI)</option>
                <option value="arc">Almeida Revista e Corrigida (ARC)</option>
                <option value="nlt">New Living Translation (NLT)</option>
              </select>
            </div>

            {/* Settings Options */}
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                Configurações de Leitura
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                Tamanho da Fonte
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                Modo Escuro
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                Sobre o App
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

