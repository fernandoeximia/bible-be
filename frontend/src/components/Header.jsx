import { Search, Settings, BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = ({ onToggleSidebar, onToggleAnnotations }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
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
              <h1 className="text-lg sm:text-2xl font-bold">BIBLE-BE</h1>
            </div>
          </div>

          {/* Center Section - Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar versículo ou texto..."
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
              className="w-full pl-9 pr-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              autoFocus
            />
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

