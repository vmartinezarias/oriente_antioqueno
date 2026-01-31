import React, { useState } from 'react';
import MapView from './components/MapView';
import InfoPanel from './components/InfoPanel';
import { ShapeFileProperties } from './types';

function App() {
  const [selectedFeature, setSelectedFeature] = useState<ShapeFileProperties | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFeatureSelect = (properties: ShapeFileProperties) => {
    setSelectedFeature(properties);
    setIsSidebarOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50">
      
      {/* Header */}
      <header className="bg-white z-50 shadow-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 h-auto min-h-[4rem]">
        <div className="flex items-center gap-4 flex-1">
           {/* Logo placeholder - assuming merceditas.png is in root/public */}
           <img 
            src="./merceditas.png" 
            alt="Logo Merceditas" 
            className="h-12 w-auto object-contain hidden sm:block"
            onError={(e) => {
                // Fallback if image load fails
                (e.target as HTMLImageElement).style.display = 'none';
            }}
           />
           <div className="flex flex-col justify-center">
             <h1 className="text-xs md:text-sm font-bold text-slate-800 leading-snug uppercase tracking-tight max-w-4xl">
               Más allá de las alertas tempranas: descifrando el vínculo entre los focos de deforestación y las dinámicas del paisaje para mejorar las estrategias de conservación de la biodiversidad en el oriente Antioqueño (Colombia)
             </h1>
           </div>
        </div>
        <div className="hidden md:block pl-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              title="Ver en GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar - Desktop: Static, Mobile: Absolute Overlay */}
        <aside 
          className={`
            fixed inset-y-0 right-0 z-[1000] w-full md:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:static md:z-0 md:transform-none md:border-r border-gray-200
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            ${!selectedFeature ? 'md:hidden lg:flex' : 'flex'} 
          `}
        >
          <div className="w-full h-full relative">
             <InfoPanel 
                selectedProperties={selectedFeature} 
                onClose={() => {
                  setIsSidebarOpen(false);
                  setSelectedFeature(null);
                }} 
             />
          </div>
        </aside>

        {/* Map Area */}
        <div className="flex-1 relative bg-slate-100 z-0">
          <MapView 
            onFeatureSelect={handleFeatureSelect} 
            selectedFeature={selectedFeature}
          />
          
          {/* Mobile Toggle Button (only visible when sidebar closed) */}
          {!isSidebarOpen && selectedFeature && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="absolute bottom-6 right-6 z-[999] bg-white p-3 rounded-full shadow-lg text-blue-600 md:hidden animate-bounce"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;