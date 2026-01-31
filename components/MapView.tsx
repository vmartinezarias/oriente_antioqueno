import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoJSONCollection, GeoJSONFeature, ShapeFileProperties } from '../types';
import { loadShapefile, normalizeSectorName } from '../services/shapeService';
import { SECTOR_DATA, DEFAULT_STYLE, HOVER_STYLE } from '../constants';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  onFeatureSelect: (properties: ShapeFileProperties) => void;
  selectedFeature: ShapeFileProperties | null;
}

const FitBounds = ({ data }: { data: GeoJSONCollection }) => {
  const map = useMap();
  useEffect(() => {
    if (data && data.features.length > 0) {
      const geoJsonLayer = L.geoJSON(data);
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });
    }
  }, [data, map]);
  return null;
};

const MapView: React.FC<MapViewProps> = ({ onFeatureSelect, selectedFeature }) => {
  const [geoData, setGeoData] = useState<GeoJSONCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await loadShapefile();
      if (data) {
        setGeoData(data);
      } else {
        setError("No se pudo cargar el archivo 'AreaEstudio.zip'. Asegúrate de que esté en la raíz del repositorio.");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const styleFeature = (feature: any) => {
    const sectorKey = normalizeSectorName(feature.properties.Sector);
    const sectorInfo = SECTOR_DATA[sectorKey];
    
    // Check if this feature corresponds to the currently selected property (if we want to highlight all polygons of that sector)
    // Or check specific identity if needed. Here we style by Sector Type.
    
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
    
    // Add simple tooltip
    layer.bindTooltip(
        `<strong>${feature.properties.MPIO_CNBRE}</strong><br/>${sectorName}`,
        { sticky: true, direction: 'top' }
    );

    layer.on({
      click: () => {
        onFeatureSelect(feature.properties);
        // We can manually style click here if we weren't using the declarative style prop
      },
      mouseover: (e) => {
        const l = e.target;
        l.setStyle(HOVER_STYLE);
        l.bringToFront();
      },
      mouseout: (e) => {
        const l = e.target;
        // Reset style is handled by React Leaflet re-render usually, but for perf we can use resetStyle if we had access to the GeoJSON layer ref.
        // For simplicity in this structure, we let the declarative style takes over on re-render or we can manually reset partial properties:
        // However, declarative is cleaner. To force declarative update, we rely on parent state, but mouseout needs immediate feedback.
        // Since we are inside the closure, we can't easily access the dynamic 'styleFeature' result without recalculating.
        
        // Quick fix: Re-apply base logic roughly or just light reset
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
          <p className="text-sm mt-4 text-slate-600">
             Nota para el desarrollador: Sube un archivo llamado <code>AreaEstudio.zip</code> 
             (que contenga .shp, .shx, .dbf) a la carpeta pública de GitHub.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[6.1, -75.3]} // Approximate center of Oriente Antioqueño
      zoom={10} 
      className="w-full h-full"
      zoomControl={false} // We will add it manually or let default be disabled for cleaner mobile look
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {geoData && (
        <>
           <GeoJSON 
             data={geoData} 
             style={styleFeature} 
             onEachFeature={onEachFeature} 
           />
           <FitBounds data={geoData} />
        </>
      )}
    </MapContainer>
  );
};

export default MapView;