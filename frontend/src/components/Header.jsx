import { Search, Settings, BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-slate-800 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-bold">BIBLE-BE</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar versículo ou texto..."
              className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Bible Version Selector */}
          <select className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="nvi">NVI</option>
            <option value="arc">ARC</option>
            <option value="nlt">NLT</option>
          </select>

          {/* Annotations Button */}
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
            <span>Anotações</span>
            <span className="bg-blue-800 text-xs px-2 py-1 rounded-full">3</span>
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

