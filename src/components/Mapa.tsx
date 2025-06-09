"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { FeatureCollection } from "geojson"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY!

type LngLatBoundsLike =
  | [[number, number], [number, number]]
  | [number, number, number, number]

const brazilBounds: LngLatBoundsLike = [
  [-74.0, -34.0],
  [-34.0, 5.5]
]

export default function MapaRender() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null)

  // 1. Primeiro: buscar os dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/instituicoes_bahia.geojson")
        if (!res.ok) throw new Error("Erro ao carregar GeoJSON")
        const data = await res.json()
        setGeojsonData(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  // 2. Depois: criar o mapa só quando os dados estiverem prontos
  useEffect(() => {
    if (!geojsonData || !mapContainerRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/monochrome", // usar o seu depois
      center: [-41.5, -12.9],
      zoom: 5,
      maxBounds: brazilBounds
    })

    mapRef.current = map

    map.on("load", () => {
      // só adiciona a fonte e os layers quando o mapa estiver pronto
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

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"]
        })

        const feature = features[0]
        if (!feature?.properties || feature.geometry.type !== "Point") return

        const cluster_id = feature.properties.cluster_id
        const coordinates = feature.geometry.coordinates as [number, number]
        const source = map.getSource("instituicoes") as mapboxgl.GeoJSONSource

        source.getClusterExpansionZoom(cluster_id, (err, expansionZoom) => {
          if (err || expansionZoom == null) return
          map.easeTo({ center: coordinates, zoom: expansionZoom })
        })
      })

      map.on("click", "unclustered-point", (e) => {
        const feature = e.features?.[0]
        if (!feature || feature.geometry.type !== "Point") return

        const { cidade, estado } = feature.properties || {}
        alert(`Cidade: ${cidade}\nEstado: ${estado}`)
      })
    })

    return () => map.remove()
  }, [geojsonData])

  return <div  ref={mapContainerRef} className="w-full h-full rounded-2xl" />
}
