import { SectorDetail } from './types';

// Mapping the prompt descriptions to a structured format.
// The keys in 'SECTOR_DATA' should attempt to match the 'Sector' column from the Shapefile partially or fully.

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

// Default style for polygons
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