import React from 'react';
import { SECTOR_DATA } from '../constants';
import { ShapeFileProperties } from '../types';
import { normalizeSectorName } from '../services/shapeService';

interface InfoPanelProps {
  selectedProperties: ShapeFileProperties | null;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ selectedProperties, onClose }) => {
  if (!selectedProperties) {
    return (
      <div className="h-full flex flex-col justify-center items-center text-slate-400 p-8 text-center bg-white shadow-lg">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-xl font-semibold mb-2">Explora el Territorio</h2>
        <p className="text-sm">Selecciona una zona en el mapa para ver la información detallada del sector.</p>
      </div>
    );
  }

  // Normalize the sector name from the Shapefile to match our constant keys
  const sectorKey = normalizeSectorName(selectedProperties.Sector);
  const data = SECTOR_DATA[sectorKey];

  if (!data) {
     return (
      <div className="h-full p-6 bg-white shadow-lg overflow-y-auto">
        <button onClick={onClose} className="mb-4 text-sm text-blue-500 hover:underline md:hidden">
          ← Volver al mapa
        </button>
        <h2 className="text-2xl font-bold mb-2">{selectedProperties.Sector}</h2>
        <p className="text-slate-600">No hay descripción detallada disponible para este sector.</p>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
           <p className="font-mono text-xs text-gray-500">Municipio (SHP): {selectedProperties.MPIO_CNBRE}</p>
           <p className="font-mono text-xs text-gray-500 mt-1">Área (Shape_Area): {selectedProperties.Shape_Area?.toLocaleString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white shadow-xl overflow-hidden relative">
      {/* Decorative Header Bar */}
      <div className="h-2 w-full" style={{ backgroundColor: data.color }} />

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <button 
          onClick={onClose} 
          className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver al mapa
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl filter drop-shadow-md">{data.emoji}</span>
          <h2 className="text-2xl font-bold text-slate-800 leading-tight">
            {data.title}
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Municipios
            </h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              {data.municipiosList}
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-2">Descripción del Territorio</h3>
            <p className="text-slate-600 text-lg leading-relaxed text-justify">
              {data.description}
            </p>
          </div>

          <div className="border-t border-slate-200 pt-4 mt-6">
             <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Datos del Polígono Seleccionado</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-2 rounded">
                    <span className="block text-xs text-gray-500">Municipio (MPIO_CNBRE)</span>
                    <span className="block font-medium text-slate-700">{selectedProperties.MPIO_CNBRE}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <span className="block text-xs text-gray-500">Área (Shape_Area)</span>
                    <span className="block font-medium text-slate-700">{selectedProperties.Shape_Area ? Math.round(selectedProperties.Shape_Area).toLocaleString() : 'N/A'}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;