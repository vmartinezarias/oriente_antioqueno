import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import shp from 'shpjs';

// --- TYPES ---
export interface ShapeFileProperties {
  Sector: string;
  MPIO_CNBRE: string;
  Shape_Area: number;
  [key: string]: any;
}

export interface SectorDetail {
  id: string;
  title: string;
  emoji: string;
  color: string;
  municipiosList: string;
  description: string;
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: ShapeFileProperties;
  geometry: any;
}

export interface GeoJSONCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// --- CONSTANTS ---
export const SECTOR_DATA: Record<string, SectorDetail> = {
  "Agua Viva": {
    id: "agua_viva",
    title: "Sector Agua Viva",
    emoji: "🌊",
    color: "#0ea5e9", // Sky blue
    municipiosList: "Alejandría, Concepción, San Vicente Ferrer, San Rafael, Peñol, Guatapé",
    description: `El sector Agua Viva corresponde a una subregión estratégica del Oriente Antioqueño caracterizada por su alta importancia hídrica, asociada a sistemas de embalses, cuencas abastecedoras y zonas de regulación ecosistémica. Este sector cumple un rol fundamental en la provisión de servicios ecosistémicos relacionados con el recurso hídrico, tanto a escala regional como metropolitana. Sin embargo, enfrenta presiones crecientes derivadas de actividades turísticas, expansión urbana localizada, infraestructura vial y cambios en el uso del suelo rural. La pérdida de cobertura vegetal en áreas de recarga y la fragmentación de los ecosistemas ribereños representan riesgos significativos para la conectividad ecológica y la calidad del agua. En este contexto, la identificación temprana de focos de deforestación y la evaluación de su impacto sobre la conectividad entre parches naturales resulta clave para la gestión preventiva del territorio y la protección de los sistemas hídricos.`
  },
  "Bosques del Sur": {
    id: "bosques_sur",
    title: "Sector Bosques del Sur",
    emoji: "🌳",
    color: "#16a34a", // Green
    municipiosList: "Sonsón, El Carmen de Viboral, San Francisco, Nariño",
    description: `El sector Bosques del Sur agrupa municipios que conservan extensas áreas de cobertura boscosa y ecosistemas estratégicos de montaña, fundamentales para la conectividad ecológica entre el Oriente Antioqueño y otras regiones del departamento. Esta subárea presenta una alta diversidad biológica y cumple funciones clave como refugio de fauna, regulación climática local y soporte de actividades productivas rurales. No obstante, la deforestación asociada a la ampliación de la frontera agropecuaria, la apertura de vías secundarias y el desarrollo disperso genera procesos de fragmentación progresiva. Estos cambios suelen ocurrir de manera gradual y poco visible, lo que dificulta su detección oportuna. La implementación de alertas tempranas permite anticipar la pérdida de conectividad y priorizar acciones de conservación en núcleos críticos, antes de que se comprometa la integridad funcional del paisaje.`
  },
  "Corredor Granadino": {
    id: "corredor_granadino",
    title: "Sector Corredor Granadino",
    emoji: "🌿",
    color: "#84cc16", // Lime
    municipiosList: "Cocorná, San Luis, San Carlos, Granada",
    description: `El Corredor Granadino constituye una franja de conexión ecológica clave dentro del Oriente Antioqueño, articulando ecosistemas de bosque, zonas agrícolas y áreas de transición entre regiones. Su ubicación estratégica lo convierte en un eje fundamental para la movilidad de especies y el flujo de procesos ecológicos a escala regional. Sin embargo, la presión por el desarrollo de infraestructura, proyectos productivos y asentamientos rurales dispersos ha incrementado el riesgo de interrupción de estos corredores funcionales. En este sector, pequeños cambios en la cobertura vegetal pueden tener efectos desproporcionados sobre la conectividad del paisaje. Por ello, el monitoreo sistemático de alertas de deforestación y su análisis desde una perspectiva de conectividad resulta esencial para identificar puntos críticos, orientar decisiones de ordenamiento territorial y prevenir la ruptura de corredores ecológicos estratégicos.`
  },
  "Núcleo de Expansión": {
    id: "nucleo_expansion",
    title: "Sector Núcleo de Expansión",
    emoji: "🏙️",
    color: "#f59e0b", // Amber
    municipiosList: "Argelia, Abejorral, El Santuario, Rionegro, Retiro, Marinilla, La Unión, La Ceja",
    description: `El sector Núcleo de Expansión se caracteriza por una dinámica acelerada de crecimiento urbano, transformación del suelo y consolidación de infraestructuras, especialmente en los municipios con mayor articulación al sistema metropolitano. Este proceso genera una presión constante sobre la cobertura vegetal remanente y sobre las áreas que funcionan como nodos de conectividad ecológica entre zonas urbanas y rurales. La fragmentación en este sector no suele manifestarse como grandes eventos de deforestación, sino como una acumulación de cambios pequeños pero persistentes, que debilitan progresivamente la red ecológica. En este contexto, las alertas tempranas orientadas a la conectividad permiten anticipar impactos, priorizar áreas de conservación y apoyar decisiones municipales que integren el crecimiento urbano con la protección de los ecosistemas estratégicos.`
  }
};

export const DEFAULT_STYLE = {
  fillColor: '#94a3b8',
  weight: 2,
  opacity: 1,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.5
};

export const HOVER_STYLE = {
  weight: 3,
  color: '#666',
  dashArray: '',
  fillOpacity: 0.7
};

// --- SERVICES ---
const loadShapefile = async (): Promise<GeoJSONCollection | null> => {
  try {
    const geojson = await shp('./AreaEstudio.zip');
    if (Array.isArray(geojson)) {
      return geojson[0] as GeoJSONCollection;
    }
    return geojson as GeoJSONCollection;
  } catch (error) {
    console.error("Error loading shapefile:", error);
    return null;
  }
};

const normalizeSectorName = (name: string): string => {
  if (!name) return "";
  const n = name.toLowerCase().trim();
  if (n.includes("agua viva")) return "Agua Viva";
  if (n.includes("bosques del sur") || n.includes("bosque")) return "Bosques del Sur";
  if (n.includes("granadino")) return "Corredor Granadino";
  if (n.includes("expansión") || n.includes("expansion")) return "Núcleo de Expansión";
  return "Unknown";
};

// --- LEAFLET FIXES ---
// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

if (L && L.Marker && L.Marker.prototype && L.Marker.prototype.options) {
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;
}

// --- COMPONENTS ---

const InfoPanel: React.FC<{
  selectedProperties: ShapeFileProperties | null;
  onClose: () => void;
}> = ({ selectedProperties, onClose }) => {
  if (!selectedProperties) {
    return (
      <div className="h-full flex flex-col justify-center items-center text-slate-400 p-8 text-center bg-white shadow-lg">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-xl font-semibold mb-2">Explora el Territorio</h2>
        <p className="text-sm">Selecciona una zona en el mapa para ver la información detallada del sector.</p>
      </div>
    );
  }

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

const FitBounds = ({ data }: { data: GeoJSONCollection }) => {
  const map = useMap();
  useEffect(() => {
    if (data && data.features && data.features.length > 0) {
      try {
        const geoJsonLayer = L.geoJSON(data);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
             map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (e) {
        console.error("Error fitting bounds:", e);
      }
    }
  }, [data, map]);
  return null;
};

const MapView: React.FC<{
  onFeatureSelect: (properties: ShapeFileProperties) => void;
  selectedFeature: ShapeFileProperties | null;
}> = ({ onFeatureSelect, selectedFeature }) => {
  const [geoData, setGeoData] = useState<GeoJSONCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await loadShapefile();
        if (data) {
          setGeoData(data);
        } else {
          console.warn("Shapefile loaded but returned null/empty.");
          setError("No se pudo cargar 'AreaEstudio.zip'. Verifica que el archivo exista.");
        }
      } catch (e) {
        console.error("Critical error loading shapefile:", e);
        setError("Error crítico cargando el mapa: " + (e as Error).message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const styleFeature = (feature: any) => {
    const sectorKey = normalizeSectorName(feature.properties.Sector);
    const sectorInfo = SECTOR_DATA[sectorKey];
    
    const isSelected = selectedFeature && normalizeSectorName(selectedFeature.Sector) === sectorKey;
    const isSpecificSelected = selectedFeature && selectedFeature === feature.properties;

    return {
      ...DEFAULT_STYLE,
      fillColor: sectorInfo ? sectorInfo.color : '#94a3b8',
      weight: isSpecificSelected ? 4 : 1,
      opacity: 1,
      color: isSpecificSelected ? '#333' : 'white',
      fillOpacity: isSelected ? 0.8 : 0.5
    };
  };

  const onEachFeature = (feature: GeoJSONFeature, layer: L.Layer) => {
    const sectorName = feature.properties.Sector;
    layer.bindTooltip(
        `<strong>${feature.properties.MPIO_CNBRE}</strong><br/>${sectorName}`,
        { sticky: true, direction: 'top' }
    );
    layer.on({
      click: () => onFeatureSelect(feature.properties),
      mouseover: (e) => {
        const l = e.target;
        l.setStyle(HOVER_STYLE);
        l.bringToFront();
      },
      mouseout: (e) => {
        const l = e.target;
        const sectorKey = normalizeSectorName(feature.properties.Sector);
        const sectorInfo = SECTOR_DATA[sectorKey];
        l.setStyle({
            weight: 1,
            color: 'white',
            fillOpacity: 0.5,
            fillColor: sectorInfo ? sectorInfo.color : '#94a3b8'
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        <p>Cargando cartografía...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-600 p-8 text-center">
        <div>
          <h3 className="font-bold text-lg mb-2">Error de Carga</h3>
          <p>{error}</p>
          <p className="text-sm mt-4 text-slate-600">Asegúrate de subir <code>AreaEstudio.zip</code>.</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[6.1, -75.3]} 
      zoom={10} 
      className="w-full h-full"
      zoomControl={false}
      style={{ height: "100%", width: "100%", minHeight: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {geoData && (
        <>
           <GeoJSON data={geoData} style={styleFeature} onEachFeature={onEachFeature} />
           <FitBounds data={geoData} />
        </>
      )}
    </MapContainer>
  );
};

// --- APP COMPONENT ---
function App() {
  const [selectedFeature, setSelectedFeature] = useState<ShapeFileProperties | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFeatureSelect = (properties: ShapeFileProperties) => {
    setSelectedFeature(properties);
    setIsSidebarOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50">
      <header className="bg-white z-50 shadow-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 h-auto min-h-[4rem]">
        <div className="flex items-center gap-4 flex-1">
           <img 
            src="./merceditas.png" 
            alt="Logo Merceditas" 
            className="h-12 w-auto object-contain hidden sm:block"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
           />
           <div className="flex flex-col justify-center">
             <h1 className="text-xs md:text-sm font-bold text-slate-800 leading-snug uppercase tracking-tight max-w-4xl">
               Más allá de las alertas tempranas: descifrando el vínculo entre los focos de deforestación y las dinámicas del paisaje para mejorar las estrategias de conservación de la biodiversidad en el oriente Antioqueño (Colombia)
             </h1>
           </div>
        </div>
        <div className="hidden md:block pl-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
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

        <div className="flex-1 relative bg-slate-100 z-0">
          <MapView onFeatureSelect={handleFeatureSelect} selectedFeature={selectedFeature} />
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

// --- ROOT MOUNT ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
