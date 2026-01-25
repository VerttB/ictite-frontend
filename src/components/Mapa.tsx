"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { School } from "@/core/domain/School";
import { Spinner } from "./LoadingSpin";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getSchoolGeoData } from "@/core/service/SchoolService";
import { useSidebar } from "./ui/sidebar";
import { useTheme } from "@/core/providers/ThemeProvider";
import { Route } from "next";

type LngLatBoundsLike =
    | [[number, number], [number, number]]
    | [number, number, number, number];

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

export default function MapaRender() {
    const router = useRouter();
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const { data: geojsonData, isLoading: loading } = useSWR(
        "schools-geo-data",
        getSchoolGeoData,
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            revalidadeOnReconnect: false,
            dedupingInterval: 60000,
        }
    );
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 });
    const [popoverContent, setPopoverContent] = useState<School[]>([]);
    const { open } = useSidebar();
    const { theme } = useTheme();
    const brazilBounds = useMemo<LngLatBoundsLike>(
        () => [
            [-84.0, -34.0],
            [-34.0, 5.5],
        ],
        []
    );

    useEffect(() => {
        if (
            !geojsonData ||
            !mapContainerRef.current ||
            !process.env.NEXT_PUBLIC_MAPBOX_KEY
        )
            return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style:
                "mapbox://styles/mapbox/" + (theme === "dark" ? "dark-v10" : "light-v10"),
            center: [-41.5, -12.9],
            zoom: 5,
            trackResize: true,
            maxBounds: brazilBounds,
        });

        const map = mapRef.current;

        map.on("load", () => {
            map.addSource("instituicoes", {
                type: "geojson",
                data: geojsonData,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50,
            });

            map.addLayer({
                id: "clusters",
                type: "circle",
                source: "instituicoes",
                filter: ["has", "point_count"],
                paint: {
                    "circle-color": [
                        "step",
                        ["get", "point_count"],
                        "#00737A",
                        5,
                        "#00737A",
                        30,
                        "#00737A",
                    ],
                    "circle-radius": ["step", ["get", "point_count"], 15, 10, 25, 30, 35],
                },
            });
            map.addLayer({
                id: "cluster-count",
                type: "symbol",
                source: "instituicoes",
                filter: ["has", "point_count"],
                layout: {
                    "text-field": ["get", "point_count_abbreviated"],
                    "text-size": 12,
                },
                paint: { "text-color": "white" },
            });
            map.addLayer({
                id: "unclustered-point",
                type: "circle",
                source: "instituicoes",
                filter: ["!", ["has", "point_count"]],
                paint: {
                    "circle-color": "#B13124",
                    "circle-radius": 6,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#FF0000",
                },
            });

            map.on("mouseenter", "unclustered-point", () => {
                map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", "unclustered-point", () => {
                map.getCanvas().style.cursor = "";
            });

            map.on("click", "clusters", (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["clusters"],
                });
                if (!features.length) return;
                if (!features[0].properties) return;
                const clusterId = features[0].properties.cluster_id;
                if (features[0].geometry.type !== "Point") return;
                const coordinates = features[0].geometry.coordinates.slice() as [
                    number,
                    number,
                ];

                const source = map.getSource("instituicoes") as mapboxgl.GeoJSONSource;

                source.getClusterLeaves(clusterId, Infinity, 0, (err, leaves) => {
                    if (err || !leaves) {
                        return;
                    }

                    const position = map.project(coordinates);
                    const School = leaves.map((leaf) => leaf.properties as School);
                    setPopoverContent(School);
                    setPopoverPosition(position);
                    setPopoverOpen(true);
                });
            });

            map.on("click", "unclustered-point", (e) => {
                setPopoverOpen(false);
                const feat = e.features?.[0];
                if (!feat || feat.geometry.type !== "Point") return;
                if (feat.properties && feat.properties.id)
                    router.push(`escolas/${feat.properties.id}` as Route);
            });

            map.on("move", () => setPopoverOpen(false));
            map.on("click", (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["clusters", "unclustered-point"],
                });
                if (!features.length) {
                    setPopoverOpen(false);
                }
            });
        });

        return () => {
            map.remove();
        };
    }, [geojsonData, brazilBounds, router, theme]);

    useEffect(() => {
        if (open) {
            mapRef.current?.resize();
        } else {
            setTimeout(() => {
                mapRef.current?.resize();
            }, 250);
        }
    }, [mapRef, open]);

    if (loading)
        return (
            <div className="flex h-64 w-full flex-col items-center justify-center">
                <Spinner />
                <h2>Carregando Mapa....</h2>
            </div>
        );

    return (
        <div className="relative w-full">
            <div
                ref={mapContainerRef}
                className="border-style relative h-128 w-full rounded-sm border-gray-600"
                style={{
                    boxShadow: "3px 3px 3px rgba(0, 0, 0, .3)",
                }}
            />

            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverAnchor
                    style={{
                        position: "absolute",
                        top: popoverPosition.y,
                        left: popoverPosition.x,
                    }}
                />
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="leading-none font-medium">Escolas</h4>
                            <p className="text-muted-foreground text-sm">
                                Lista de instituições neste ponto.
                            </p>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            <ul>
                                {popoverContent.map((school) => (
                                    <li
                                        onClick={() => {
                                            setPopoverOpen(false);
                                            router.push(`escolas/${school.id}` as Route);
                                        }}
                                        key={school.id}
                                        className="hover:bg-primary cursor-pointer rounded-md border-b p-2 text-sm hover:text-white">
                                        {school.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
