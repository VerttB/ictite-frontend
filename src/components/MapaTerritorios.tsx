"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Feature, FeatureCollection, MultiPolygon, Point, Polygon } from "geojson";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/navigation";
import { Route } from "next";
import useSWR from "swr";
import { toast } from "sonner";
import { Map as MapIcon, MapPin } from "lucide-react";

import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { getSchoolGeoData } from "@/core/service/SchoolService";
import { useTheme } from "@/core/providers/ThemeProvider";
import { SchoolGeoJson } from "@/core/domain/School";
import { useSidebar } from "./ui/sidebar";
import { Spinner } from "./LoadingSpin";

import "mapbox-gl/dist/mapbox-gl.css";

type SchoolMapProperties = SchoolGeoJson["features"][number]["properties"];
type SchoolFeature = Feature<Point, SchoolMapProperties>;

interface MunicipalityProperties {
    id?: string;
    name: string;
    description?: string;
    territorio_id: string | number;
    territorio_identidade: string;
}

type MunicipalityFeature = Feature<Polygon | MultiPolygon, MunicipalityProperties>;
type TerritoryGeoJson = FeatureCollection<Polygon | MultiPolygon, MunicipalityProperties>;
type LngLatBoundsLike = [[number, number], [number, number]] | [number, number, number, number];

interface TerritorySummary {
    id: string;
    name: string;
    count: number;
}

const TERRITORY_GEOJSON_URL = "/territorio_relacionado.json";
const TERRITORY_COLORS = [
    "#e6194B",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#42d4f4",
    "#f032e6",
    "#bfef45",
    "#fabed4",
    "#469990",
    "#dcbeff",
    "#9A6324",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#808080",
    "#00e676",
];

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

function normalizeCity(value?: string | null) {
    return (value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function getColor(id?: string | number | null) {
    const parsedId = Number(id);
    const numericId = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : 1;
    return TERRITORY_COLORS[(numericId - 1) % TERRITORY_COLORS.length];
}

async function fetchTerritoryGeoJson(): Promise<TerritoryGeoJson> {
    const response = await fetch(TERRITORY_GEOJSON_URL);

    if (!response.ok) {
        throw new Error("Erro ao carregar GeoJSON de territórios.");
    }

    const data = await response.json();

    if (
        data?.type !== "FeatureCollection" ||
        !Array.isArray(data.features) ||
        !data.features.every(
            (feature: MunicipalityFeature) =>
                feature?.type === "Feature" &&
                ["Polygon", "MultiPolygon"].includes(feature.geometry?.type) &&
                typeof feature.properties?.name === "string" &&
                ["string", "number"].includes(typeof feature.properties?.territorio_id) &&
                typeof feature.properties?.territorio_identidade === "string"
        )
    ) {
        throw new Error("GeoJSON de territórios inválido.");
    }

    return data as TerritoryGeoJson;
}

function createMunicipalityIndex(geoJson?: TerritoryGeoJson) {
    const index = new Map<string, MunicipalityProperties>();

    geoJson?.features.forEach((feature) => {
        const city = normalizeCity(feature.properties.name);
        if (city) index.set(city, feature.properties);
    });

    return index;
}

function getTerritoryIdFromSchool(
    school: SchoolMapProperties,
    municipalityIndex: Map<string, MunicipalityProperties>
) {
    return (
        school.identity_territory_number ||
        municipalityIndex.get(normalizeCity(school.city))?.territorio_id ||
        "sem-territorio"
    ).toString();
}

function getTerritoryNameFromSchool(
    school: SchoolMapProperties,
    municipalityIndex: Map<string, MunicipalityProperties>
) {
    return (
        school.identity_territory_name ||
        municipalityIndex.get(normalizeCity(school.city))?.territorio_identidade ||
        "Sem território"
    );
}

function getSchoolFeatures(geoJson?: SchoolGeoJson): SchoolFeature[] {
    return (geoJson?.features ?? []) as SchoolFeature[];
}

function buildTerritorySummaries(
    schools: SchoolFeature[],
    municipalityIndex: Map<string, MunicipalityProperties>,
    territoryGeoJson?: TerritoryGeoJson
) {
    const summaries = new Map<string, TerritorySummary>();

    territoryGeoJson?.features.forEach((feature) => {
        const id = String(feature.properties.territorio_id);
        if (!summaries.has(id)) {
            summaries.set(id, {
                id,
                name: feature.properties.territorio_identidade,
                count: 0,
            });
        }
    });

    schools.forEach((school) => {
        const id = getTerritoryIdFromSchool(school.properties, municipalityIndex);
        const name = getTerritoryNameFromSchool(school.properties, municipalityIndex);
        const current = summaries.get(id) ?? { id, name, count: 0 };
        current.count += 1;
        summaries.set(id, current);
    });

    return Array.from(summaries.values()).sort((a, b) => Number(a.id) - Number(b.id));
}

function buildTerritoryColorExpression(summaries: TerritorySummary[]) {
    const expression: unknown[] = ["match", ["to-string", ["get", "territorio_id"]]];

    summaries.forEach((summary) => {
        expression.push(summary.id, summary.count > 0 ? getColor(summary.id) : "#d1d5db");
    });

    expression.push("#d1d5db");
    return expression;
}

function schoolsForTerritory(
    schools: SchoolFeature[],
    territoryId: string,
    municipalityIndex: Map<string, MunicipalityProperties>
) {
    return schools
        .filter((school) => getTerritoryIdFromSchool(school.properties, municipalityIndex) === territoryId)
        .map((school) => school.properties);
}

function extendBoundsFromPosition(bounds: mapboxgl.LngLatBounds, position: number[]) {
    if (typeof position[0] === "number" && typeof position[1] === "number") {
        bounds.extend(position as [number, number]);
    }
}

function getGeoJsonBounds(geoJson: TerritoryGeoJson) {
    const bounds = new mapboxgl.LngLatBounds();

    geoJson.features.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
            feature.geometry.coordinates.forEach((ring) => {
                ring.forEach((position) => extendBoundsFromPosition(bounds, position));
            });
            return;
        }

        feature.geometry.coordinates.forEach((polygon) => {
            polygon.forEach((ring) => {
                ring.forEach((position) => extendBoundsFromPosition(bounds, position));
            });
        });
    });

    return bounds;
}

export default function MapaTerritorios() {
    const router = useRouter();
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const { open } = useSidebar();
    const { theme } = useTheme();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
    const [popoverContent, setPopoverContent] = useState<SchoolMapProperties[]>([]);

    const {
        data: geojsonData,
        isLoading: loadingSchools,
        error: schoolsError,
    } = useSWR("schools-geo-data", getSchoolGeoData, {
        keepPreviousData: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000,
    });

    const {
        data: territoryGeoJson,
        isLoading: loadingTerritories,
        error: territoriesError,
    } = useSWR("territory-geo-data", fetchTerritoryGeoJson, {
        keepPreviousData: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000,
    });

    const municipalityIndex = useMemo(
        () => createMunicipalityIndex(territoryGeoJson),
        [territoryGeoJson]
    );
    const schools = useMemo(() => getSchoolFeatures(geojsonData), [geojsonData]);
    const territorySummaries = useMemo(
        () => buildTerritorySummaries(schools, municipalityIndex, territoryGeoJson),
        [municipalityIndex, schools, territoryGeoJson]
    );
    const territoryColorExpression = useMemo(
        () => buildTerritoryColorExpression(territorySummaries),
        [territorySummaries]
    );
    const brazilBounds = useMemo<LngLatBoundsLike>(
        () => [
            [-47.8, -18.5],
            [-36.0, -8.0],
        ],
        []
    );

    useEffect(() => {
        const error = schoolsError || territoriesError;
        if (!error) return;
        toast.error(
            error instanceof Error ? error.message : "Erro ao carregar dados do mapa",
            { position: "top-center", duration: 5000, closeButton: true }
        );
    }, [schoolsError, territoriesError]);

    useEffect(() => {
        if (
            !geojsonData ||
            !territoryGeoJson ||
            !mapContainerRef.current ||
            !process.env.NEXT_PUBLIC_MAPBOX_KEY
        ) {
            return;
        }

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/" + (theme === "dark" ? "dark-v10" : "light-v10"),
            center: [-41.5, -12.9],
            zoom: 5.4,
            trackResize: true,
            maxBounds: brazilBounds,
        });

        mapRef.current = map;

        map.on("load", () => {
            map.addSource("territorios", {
                type: "geojson",
                data: territoryGeoJson,
            });

            map.addLayer({
                id: "territory-fill",
                type: "fill",
                source: "territorios",
                paint: {
                    "fill-color": territoryColorExpression,
                    "fill-opacity": 0.72,
                },
            });

            map.addLayer({
                id: "territory-borders",
                type: "line",
                source: "territorios",
                paint: {
                    "line-color": theme === "dark" ? "#f8fafc" : "#475569",
                    "line-opacity": 0.45,
                    "line-width": 0.8,
                },
            });

            map.addSource("instituicoes", {
                type: "geojson",
                data: geojsonData,
                cluster: true,
                clusterMaxZoom: 12,
                clusterRadius: 48,
            });

            map.addLayer({
                id: "clusters",
                type: "circle",
                source: "instituicoes",
                filter: ["has", "point_count"],
                paint: {
                    "circle-color": "#111827",
                    "circle-radius": ["step", ["get", "point_count"], 17, 10, 24, 30, 34],
                    "circle-stroke-color": "#ffffff",
                    "circle-stroke-width": 2,
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
                    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                },
                paint: { "text-color": "#ffffff" },
            });

            map.addLayer({
                id: "unclustered-point",
                type: "circle",
                source: "instituicoes",
                filter: ["!", ["has", "point_count"]],
                paint: {
                    "circle-color": "#B13124",
                    "circle-radius": 6,
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                },
            });

            const bounds = getGeoJsonBounds(territoryGeoJson);
            if (!bounds.isEmpty()) {
                map.fitBounds(bounds, { padding: 24, duration: 0 });
            }

            map.on("mouseenter", "territory-fill", () => {
                map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", "territory-fill", () => {
                map.getCanvas().style.cursor = "";
            });
            map.on("mouseenter", "unclustered-point", () => {
                map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", "unclustered-point", () => {
                map.getCanvas().style.cursor = "";
            });

            map.on("click", "clusters", (event) => {
                const features = map.queryRenderedFeatures(event.point, { layers: ["clusters"] });
                const feature = features[0];
                if (!feature?.properties || feature.geometry.type !== "Point") return;

                const source = map.getSource("instituicoes") as mapboxgl.GeoJSONSource;
                const coordinates = feature.geometry.coordinates.slice() as [number, number];
                const clusterId = feature.properties.cluster_id;

                source.getClusterLeaves(clusterId, Infinity, 0, (err, leaves) => {
                    if (err || !leaves) return;
                    setPopoverContent(leaves.map((leaf) => leaf.properties as SchoolMapProperties));
                    setPopoverPosition(map.project(coordinates));
                    setPopoverOpen(true);
                });
            });

            map.on("click", "unclustered-point", (event) => {
                const feature = event.features?.[0];
                if (!feature || feature.geometry.type !== "Point") return;

                const coordinates = feature.geometry.coordinates.slice() as [number, number];
                setPopoverContent([feature.properties as SchoolMapProperties]);
                setPopoverPosition(map.project(coordinates));
                setPopoverOpen(true);
            });

            map.on("click", "territory-fill", (event) => {
                const feature = event.features?.[0] as MunicipalityFeature | undefined;
                const territoryId = feature?.properties?.territorio_id?.toString();
                if (!territoryId) return;

                const territorySchools = schoolsForTerritory(schools, territoryId, municipalityIndex);

                if (!territorySchools.length) {
                    setPopoverOpen(false);
                    return;
                }

                setPopoverContent(territorySchools);
                setPopoverPosition(event.point);
                setPopoverOpen(true);
            });

            map.on("move", () => setPopoverOpen(false));
            map.on("click", (event) => {
                const features = map.queryRenderedFeatures(event.point, {
                    layers: ["clusters", "unclustered-point", "territory-fill"],
                });
                if (!features.length) setPopoverOpen(false);
            });
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [
        brazilBounds,
        geojsonData,
        municipalityIndex,
        schools,
        territoryColorExpression,
        territoryGeoJson,
        theme,
    ]);

    useEffect(() => {
        if (open) {
            mapRef.current?.resize();
            return;
        }

        const timeoutId = window.setTimeout(() => {
            mapRef.current?.resize();
        }, 250);

        return () => window.clearTimeout(timeoutId);
    }, [open]);

    const loading = loadingSchools || loadingTerritories;

    if (loading) {
        return (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-3 text-font-secondary">
                <Spinner />
                <h2>Carregando mapa...</h2>
            </div>
        );
    }

    if (!process.env.NEXT_PUBLIC_MAPBOX_KEY) {
        return (
            <div className="rounded-md border border-border bg-card p-6 text-sm text-font-secondary">
                Chave do Mapbox não configurada.
            </div>
        );
    }

    return (
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="relative min-w-0">
                <div
                    ref={mapContainerRef}
                    className="h-[clamp(360px,62vh,680px)] w-full rounded-md border border-border shadow-sm"
                />

                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverAnchor
                        style={{
                            position: "absolute",
                            top: popoverPosition.y,
                            left: popoverPosition.x,
                        }}
                    />
                    <PopoverContent className="w-82">
                        <div className="grid gap-4">
                            <div className="space-y-1">
                                <h4 className="leading-none font-semibold text-font-primary">
                                    Escolas
                                </h4>
                                <p className="text-sm text-font-secondary">
                                    {popoverContent.length} instituição
                                    {popoverContent.length !== 1 ? "ões" : ""} nesta área.
                                </p>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                <ul className="space-y-2">
                                    {popoverContent.map((school) => (
                                        <li
                                            onClick={() => {
                                                setPopoverOpen(false);
                                                router.push(`/escolas/${school.id}` as Route);
                                            }}
                                            key={school.id}
                                            className="group cursor-pointer rounded-md border border-border p-3 text-sm transition-colors hover:bg-primary">
                                            <div className="font-semibold text-font-primary transition-colors group-hover:text-white">
                                                {school.name}
                                            </div>

                                            {school.city && (
                                                <div className="mt-1 flex items-center gap-1 text-xs text-font-secondary group-hover:text-white">
                                                    <MapPin size={14} />
                                                    <span>{school.city}</span>
                                                </div>
                                            )}

                                            {school.identity_territory_name && (
                                                <div className="mt-2 flex w-fit items-center gap-1 rounded bg-muted/50 px-2 py-1 text-[11px] font-medium text-font-secondary group-hover:text-white">
                                                    <MapIcon size={14} />
                                                    <span>
                                                        TI:{" "}
                                                        {school.identity_territory_number
                                                            ? `${school.identity_territory_number} - `
                                                            : ""}
                                                        {school.identity_territory_name}
                                                    </span>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Legend summaries={territorySummaries} />
        </div>
    );
}

function Legend({ summaries }: { summaries: TerritorySummary[] }) {
    return (
        <aside className="rounded-md border border-border bg-card p-4 text-sm text-font-primary lg:max-h-[clamp(360px,62vh,680px)] lg:overflow-y-auto">
            <h3 className="mb-3 font-bold">Territórios de Identidade</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {summaries.map((summary) => (
                    <div className="flex items-start gap-2" key={summary.id}>
                        <span
                            className="mt-0.5 h-4 w-4 shrink-0 rounded-[3px]"
                            style={{
                                backgroundColor: summary.count > 0 ? getColor(summary.id) : "#d1d5db",
                            }}
                        />
                        <span className="min-w-0 text-font-secondary [overflow-wrap:anywhere]">
                            <strong className="text-font-primary">{summary.id}</strong> - {summary.name}
                            {summary.count > 0 && (
                                <span className="font-semibold text-font-primary"> ({summary.count})</span>
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </aside>
    );
}
