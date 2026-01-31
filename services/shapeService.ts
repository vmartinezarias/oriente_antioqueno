import shp from 'shpjs';
import { GeoJSONCollection } from '../types';

/**
 * Loads the shapefile from the public directory.
 * Note: shpjs works best with a .zip file containing .shp, .dbf, and .shx.
 * 
 * Instructions for the user:
 * Please compress 'AreaEstudio.shp', 'AreaEstudio.dbf', and 'AreaEstudio.shx' (and .prj if available)
 * into a single file named 'AreaEstudio.zip' and place it in the public folder.
 */
export const loadShapefile = async (): Promise<GeoJSONCollection | null> => {
  try {
    // We use a relative path. In production (GitHub Pages), this resolves correctly
    // provided the zip file is at the root of the published site.
    const geojson = await shp('./AreaEstudio.zip');
    
    // shpjs can return an array if multiple layers are in the zip, or a single FeatureCollection.
    if (Array.isArray(geojson)) {
      return geojson[0] as GeoJSONCollection;
    }
    return geojson as GeoJSONCollection;
  } catch (error) {
    console.error("Error loading shapefile:", error);
    return null;
  }
};

/**
 * Helper to normalize Sector names for matching
 */
export const normalizeSectorName = (name: string): string => {
  if (!name) return "";
  const n = name.toLowerCase().trim();
  if (n.includes("agua viva")) return "Agua Viva";
  if (n.includes("bosques del sur") || n.includes("bosque")) return "Bosques del Sur";
  if (n.includes("granadino")) return "Corredor Granadino";
  if (n.includes("expansión") || n.includes("expansion")) return "Núcleo de Expansión";
  return "Unknown";
};