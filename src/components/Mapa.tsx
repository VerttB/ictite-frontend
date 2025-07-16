"use client"
import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Importe os componentes do ShadCN
import {
  Popover,
  PopoverContent,
  PopoverAnchor, // Usaremos o Anchor para posicionar o Popover dinamicamente
} from "@/components/ui/popover" // Ajuste o caminho se necessário
import { SchoolData } from "@/core/interface/School"

type LngLatBoundsLike =
  | [[number, number], [number, number]]
  | [number, number, number, number]

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY

export type MapProps = {
    onUnclusteredPointClick: (props: any) => void;
};



export default function MapaRender({ onUnclusteredPointClick }: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [geojsonData, setGeojsonData] = useState<any>(null)

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [popoverContent, setPopoverContent] = useState<SchoolData[]>([]);

  const brazilBounds: LngLatBoundsLike = [
    [-74.0, -34.0],
    [-34.0, 5.5]
  ]

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/school")
      const data = await res.json()
      setGeojsonData(data)
    }
    fetchData()
  }, [])


  useEffect(() => {
    if (!geojsonData || !mapContainerRef.current || !process.env.NEXT_PUBLIC_MAPBOX_KEY) return

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/verttb/cmav7e36p00vx01sd6w6h9690",
        center: [-41.5, -12.9], 
        zoom: 5,
        maxBounds: brazilBounds
      })

    const map = mapRef.current

    map.on("load", () => {
      map.addSource("instituicoes", {
        type: "geojson",
        data: geojsonData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      map.addLayer({ id: "clusters", type: "circle", source: "instituicoes", filter: ["has", "point_count"], paint: { "circle-color": [ "step", ["get", "point_count"], "#51bbd6", 10, "#f1f075", 30, "#f28cb1" ], "circle-radius": [ "step", ["get", "point_count"], 15, 10, 25, 30, 35 ] } });
      map.addLayer({ id: "cluster-count", type: "symbol", source: "instituicoes", filter: ["has", "point_count"], layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 } });
      map.addLayer({ id: "unclustered-point", type: "circle", source: "instituicoes", filter: ["!", ["has", "point_count"]], paint: { "circle-color": "#11b4da", "circle-radius": 6, "circle-stroke-width": 1, "circle-stroke-color": "#fff" } });

      map.on("mouseenter", "unclustered-point", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "unclustered-point", () => { map.getCanvas().style.cursor = ""; });

      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        if (!features.length) return;
        if(!features[0].properties) return
        const clusterId = features[0].properties.cluster_id;
        if (features[0].geometry.type !== 'Point') return;
        const coordinates = features[0].geometry.coordinates.slice() as [number, number];
        
        const source = map.getSource('instituicoes') as mapboxgl.GeoJSONSource;

        source.getClusterLeaves(clusterId, Infinity, 0, (err, leaves) => {
            if (err || !leaves) {
                return;
            }

            const position = map.project(coordinates);
            const schoolData = leaves.map(leaf => leaf.properties as SchoolData);
            setPopoverContent(schoolData);
            setPopoverPosition(position);
            setPopoverOpen(true);
        });
      });

      map.on("click", "unclustered-point", (e) => {
          setPopoverOpen(false); // Fecha o popover se um ponto único for clicado
          const feat = e.features?.[0];
          if (!feat || feat.geometry.type !== "Point") return;
          onUnclusteredPointClick(feat.properties);
      });

    
      map.on('move', () => setPopoverOpen(false));
      map.on('click', (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ['clusters', 'unclustered-point'] });
          if (!features.length) {
              setPopoverOpen(false);
          }
      });
    });

    return () => { map.remove() };
  }, [geojsonData, onUnclusteredPointClick]);


  return (
   
    <div ref={mapContainerRef} className="relative w-full h-128">
      
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
       
        <PopoverAnchor
          style={{
            position: 'absolute',
            top: popoverPosition.y,
            left: popoverPosition.x,
          }}
        />
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Escolas</h4>
              <p className="text-sm text-muted-foreground">
                Lista de instituições neste ponto.
              </p>
            </div>
            <div className="max-h-60 overflow-y-auto">
              <ul>
                {popoverContent.map((school) => (
                  <li onClick={() => {
                              setPopoverOpen(false);
                              onUnclusteredPointClick(school)}} key={school.id} className="text-sm border-b rounded-md p-2 hover:bg-verde hover:text-white cursor-pointer">
                    {school.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PopoverContent>
      </Popover>

    </div>
  )
}