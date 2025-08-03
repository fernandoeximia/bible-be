import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import AnnotationPanel from './components/AnnotationPanel';
import './App.css';

function App() {
  const [isAnnotationPanelOpen, setIsAnnotationPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleAnnotationPanel = () => {
    setIsAnnotationPanelOpen(!isAnnotationPanelOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile, collapsible on tablet/desktop */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 z-30 transition-transform duration-300 ease-in-out lg:block`}>
          <Sidebar />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          <MainContent />
          
          {/* Annotation Panel */}
          <div className={`${
            isAnnotationPanelOpen ? 'translate-x-0' : 'translate-x-full'
          } fixed lg:relative lg:translate-x-0 z-30 transition-transform duration-300 ease-in-out ${
            isAnnotationPanelOpen ? 'lg:block' : 'lg:hidden'
          }`}>
            <AnnotationPanel 
              isOpen={isAnnotationPanelOpen} 
              onToggle={toggleAnnotationPanel} 
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={toggleSidebar}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-md"
          >
            <span className="text-sm">Livros</span>
          </button>
          
          <div className="flex space-x-2">
            <button className="px-3 py-2 bg-gray-100 rounded-md text-sm">
              ← Cap
            </button>
            <button className="px-3 py-2 bg-gray-100 rounded-md text-sm">
              Cap →
            </button>
          </div>
          
          <button
            onClick={toggleAnnotationPanel}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            <span className="text-sm">Notas</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

