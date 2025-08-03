import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import AnnotationPanel from './components/AnnotationPanel';
import './App.css';

function App() {
  const [isAnnotationPanelOpen, setIsAnnotationPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-open sidebar on desktop
      if (width >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Touch gesture handling
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isScrolling = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = false;
    };

    const handleTouchMove = (e) => {
      if (!startX || !startY) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      // Determine if user is scrolling vertically
      if (Math.abs(diffY) > Math.abs(diffX)) {
        isScrolling = true;
        return;
      }

      // Prevent default if horizontal swipe
      if (Math.abs(diffX) > 10 && !isScrolling) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (!startX || !startY || isScrolling) {
        startX = 0;
        startY = 0;
        return;
      }

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      const threshold = 50;

      // Swipe right to open sidebar (from left edge)
      if (diffX < -threshold && startX < 50 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
      
      // Swipe left to close sidebar
      if (diffX > threshold && isSidebarOpen) {
        setIsSidebarOpen(false);
      }

      // Swipe left to open annotation panel (from right edge)
      if (diffX > threshold && startX > window.innerWidth - 50 && !isAnnotationPanelOpen) {
        setIsAnnotationPanelOpen(true);
      }
      
      // Swipe right to close annotation panel
      if (diffX < -threshold && isAnnotationPanelOpen) {
        setIsAnnotationPanelOpen(false);
      }

      startX = 0;
      startY = 0;
    };

    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isSidebarOpen, isAnnotationPanelOpen]);

  const toggleAnnotationPanel = () => {
    setIsAnnotationPanelOpen(!isAnnotationPanelOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const closeAnnotationPanel = () => {
    setIsAnnotationPanelOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <Header 
        onToggleSidebar={toggleSidebar}
        onToggleAnnotations={toggleAnnotationPanel}
      />
      
      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          <MainContent />
          
          {/* Annotation Panel */}
          <AnnotationPanel 
            isOpen={isAnnotationPanelOpen} 
            onToggle={toggleAnnotationPanel}
            onClose={closeAnnotationPanel}
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 safe-area-pb">
          <div className="flex justify-between items-center">
            <button
              onClick={toggleSidebar}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">📚 Livros</span>
            </button>
            
            <div className="flex space-x-2">
              <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                ← Cap
              </button>
              <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                Cap →
              </button>
            </div>
            
            <button
              onClick={toggleAnnotationPanel}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">📝 Notas</span>
              <span className="bg-blue-800 text-xs px-1.5 py-0.5 rounded-full">3</span>
            </button>
          </div>
        </div>
      )}

      {/* Tablet Bottom Navigation */}
      {isTablet && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <button
              onClick={toggleSidebar}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">📚 Navegação</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                ← Capítulo Anterior
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
              
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                Próximo Capítulo →
              </button>
            </div>
            
            <button
              onClick={toggleAnnotationPanel}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">📝 Anotações</span>
              <span className="bg-blue-800 text-xs px-2 py-1 rounded-full">3</span>
            </button>
          </div>
        </div>
      )}

      {/* Swipe Indicators for Mobile */}
      {isMobile && (
        <>
          {/* Left edge swipe indicator */}
          {!isSidebarOpen && (
            <div className="fixed left-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-blue-400 rounded-r-full opacity-30 z-10 pointer-events-none" />
          )}
          
          {/* Right edge swipe indicator */}
          {!isAnnotationPanelOpen && (
            <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-blue-400 rounded-l-full opacity-30 z-10 pointer-events-none" />
          )}
        </>
      )}
    </div>
  );
}

export default App;

