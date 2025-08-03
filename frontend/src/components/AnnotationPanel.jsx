import { Search, Filter, Edit, Trash2, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const AnnotationPanel = ({ isOpen, onToggle, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Dados de exemplo de anotações
  const annotations = [
    {
      id: 1,
      reference: 'Gênesis 1:3',
      text: 'Disse Deus: "Haja luz!" E houve luz.',
      type: 'highlight',
      color: '#FFF3CD',
      note: 'Deus cria pela sua palavra',
      date: '2025-01-15'
    },
    {
      id: 2,
      reference: 'João 15:5',
      text: 'Eu sou a videira; vocês são os ramos.',
      type: 'highlight',
      color: '#D4EDDA',
      note: 'Permanecer em Cristo',
      date: '2025-01-14'
    },
    {
      id: 3,
      reference: 'Mateus 22:39',
      text: 'Ame o seu próximo como a si mesmo.',
      type: 'highlight',
      color: '#CCE5FF',
      note: 'O segundo maior mandamento',
      date: '2025-01-13'
    },
    {
      id: 4,
      reference: 'Romanos 8:28',
      text: 'Sabemos que Deus age em todas as coisas para o bem daqueles que o amam.',
      type: 'highlight',
      color: '#F8D7DA',
      note: 'Uma promessa consoladora',
      date: '2025-01-12'
    }
  ];

  const getColorClass = (color) => {
    const colorMap = {
      '#FFF3CD': 'bg-yellow-200',
      '#D4EDDA': 'bg-green-200',
      '#CCE5FF': 'bg-blue-200',
      '#F8D7DA': 'bg-pink-200',
      '#FFE4B5': 'bg-orange-200',
      '#E2D9F3': 'bg-purple-200'
    };
    return colorMap[color] || 'bg-gray-200';
  };

  const filteredAnnotations = annotations.filter(annotation => {
    const matchesSearch = annotation.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         annotation.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         annotation.note.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || annotation.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <ChevronRight className="h-5 w-5 transform rotate-180" />
      </button>
    );
  }

  return (
    <aside className="w-96 bg-white border-l border-gray-200 h-full overflow-y-auto shadow-lg">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Anotações</h2>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar anotações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filtrar por:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="highlight">Destaques</option>
            <option value="note">Notas</option>
            <option value="bookmark">Marcadores</option>
          </select>
        </div>

        {/* Color Legend */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Cores:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-200 rounded"></div>
              <span>Importantes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span>Promessas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <span>Comandos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-200 rounded"></div>
              <span>Avisos</span>
            </div>
          </div>
        </div>

        {/* Annotations List */}
        <div className="space-y-3">
          {filteredAnnotations.map((annotation) => (
            <div
              key={annotation.id}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Reference */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-blue-600 text-sm">
                  {annotation.reference}
                </h3>
                <div className="flex items-center space-x-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit className="h-3 w-3 text-gray-500" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Trash2 className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Highlighted Text */}
              <div className={`p-2 rounded text-sm mb-2 ${getColorClass(annotation.color)}`}>
                {annotation.text}
              </div>

              {/* Note */}
              {annotation.note && (
                <p className="text-sm text-gray-600 italic mb-2">
                  "{annotation.note}"
                </p>
              )}

              {/* Date */}
              <p className="text-xs text-gray-400">
                {new Date(annotation.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>

        {filteredAnnotations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Nenhuma anotação encontrada</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AnnotationPanel;

