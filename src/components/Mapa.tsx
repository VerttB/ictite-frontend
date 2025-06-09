"use client"
import { useEffect, useRef, useState } from "react"
import mapboxgl, { GeoJSONFeature } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

type LngLatBoundsLike =
  | [[number, number], [number, number]]
  | [number, number, number, number]

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY

export default function MapaRender() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [geojsonData, setGeojsonData] = useState<any>(null)

  const brazilBounds: LngLatBoundsLike = [
    [-74.0, -34.0],
    [-34.0, 5.5]
  ]

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/instituicoes_bahia.geojson")
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

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "instituicoes",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            10,
            "#f1f075",
            30,
            "#f28cb1"
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            15,
            10,
            25,
            30,
            35
          ]
        }
      })

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "instituicoes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-size": 12
        }
      })

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "instituicoes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      })
      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers:['clusters']
        });

        if(features[0].properties){
           const cluster_id = features[0].properties.cluster_id;
           const source = map.getSource('instituicoes') as mapboxgl.GeoJSONSource;
           if (features[0].geometry.type !== 'Point') return;
           const coordinates = features[0].geometry.coordinates

           source.getClusterExpansionZoom(cluster_id, 
            (err, zoom) => {
              if(err) return;
              map.easeTo({
                center: coordinates as [number,number],
                zoom: zoom as number
              });
            });}

      });

      

      map.on('click', 'unclustered-point', (e) => {
        if(e.features && e.features[0]){
          const features  = e.features[0];

          if(features.geometry.type !== 'Point') return;
          const coordinates = features.geometry.coordinates.slice();
          if(features.properties)
            alert(`Cidade: ${features.properties.cidade}
          \nEstado: ${features.properties.estado}`)
          
        }
      
           
      })
    })

    return () => map.remove()
  }, [geojsonData])

  return <div ref={mapContainerRef} className="w-full h-128" />
}
