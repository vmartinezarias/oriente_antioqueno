// Define the properties expected in the Shapefile GeoJSON conversion
export interface ShapeFileProperties {
  Sector: string;
  MPIO_CNBRE: string;
  Shape_Area: number;
  [key: string]: any; // Allow other properties
}

export interface SectorDetail {
  id: string;
  title: string;
  emoji: string;
  color: string;
  municipiosList: string; // The list provided in the prompt text
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