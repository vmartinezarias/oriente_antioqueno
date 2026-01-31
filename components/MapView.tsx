import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoJSONCollection, GeoJSONFeature, ShapeFileProperties } from '../types';
import { loadShapefile, normalizeSectorName } from '../services/shapeService';
import { SECTOR_DATA, DEFAULT_STYLE, HOVER_STYLE } from '../constants';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Explicitly setting the prototype options can sometimes fail in strict ESM, 
// so we check if L.Marker is available.
if (L && L.Marker && L.Marker.prototype && L.Marker.prototype.options) {
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;
}

interface MapViewProps {
  onFeatureSelect: (properties: ShapeFileProperties) => void;
  selectedFeature: ShapeFileProperties | null;
}

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

const MapView: React.FC<MapViewProps> = ({ onFeatureSelect, selectedFeature }) => {
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
          // This usually happens if the ZIP is missing or corrupt
          console.warn("Shapefile loaded but returned null/empty.");
          setError("No se pudo cargar 'AreaEstudio.zip'. Verifica que el archivo exista en la carpeta pública.");
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
      click: () => {
        onFeatureSelect(feature.properties);
      },
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
          <p className="text-sm mt-4 text-slate-600">
             Asegúrate de subir el archivo <code>AreaEstudio.zip</code> al repositorio.
          </p>
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