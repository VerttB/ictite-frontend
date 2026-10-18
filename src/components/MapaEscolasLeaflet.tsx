"use client";

import { useEffect, useMemo, useState } from "react";
import type { Feature, FeatureCollection, MultiPolygon, Point, Polygon } from "geojson";
import L from "leaflet";
import {
    GeoJSON,
    MapContainer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { union } from "@turf/union";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import useSWR from "swr";
import { MapPin } from "lucide-react";

import { getSchoolGeoData } from "@/core/service/SchoolService";
import type { SchoolGeoJson } from "@/core/domain/School";
import { Spinner } from "@/components/LoadingSpin";
import { useSidebar } from "@/components/ui/sidebar";
import styles from "./MapaEscolasLeaflet.module.css";

type SchoolProperties = SchoolGeoJson["features"][number]["properties"];
type SchoolFeature = Feature<Point, SchoolProperties>;
type MunicipalityProperties = {
    name: string;
    territorio_id: string | number;
    territorio_identidade: string;
};
type MunicipalityFeature = Feature<Polygon | MultiPolygon, MunicipalityProperties>;
type MunicipalityCollection = FeatureCollection<
    Polygon | MultiPolygon,
    MunicipalityProperties
>;

interface SchoolGroup {
    id: string;
    name: string;
    schools: SchoolFeature[];
    position: L.LatLng;
}

interface TerritoryGroup {
    id: string;
    name: string;
    features: MunicipalityFeature[];
    schools: SchoolFeature[];
}

const MUNICIPAL_ZOOM = 8;
const EMPTY_FILL = "#d5dbe0";
const COLORS = [
    "#dcbf74",
    "#95caa1",
    "#aab8dc",
    "#bdd88d",
    "#e6ae78",
    "#df9c82",
    "#88c9b8",
    "#c4b6d7",
    "#a7d2a2",
    "#e7a4bb",
    "#d9bd8b",
    "#bda8df",
    "#e4cb85",
    "#9bc3d0",
    "#e3a9a2",
    "#b4ce85",
    "#d4b4a1",
    "#a7d3bd",
    "#d9c693",
    "#9fc1e1",
    "#dfb2ce",
    "#a4c4a0",
    "#e3bc94",
    "#9fbac6",
    "#c2c989",
    "#e7b681",
];

function normalizeCity(value?: string | null) {
    return (value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function territoryColor(id: string) {
    return COLORS[Number(id) - 1] || EMPTY_FILL;
}

async function fetchMunicipalities(): Promise<MunicipalityCollection> {
    const response = await fetch("/territorio_relacionado.json");
    if (!response.ok) throw new Error("Não foi possível carregar os municípios do mapa.");
    const data: unknown = await response.json();
    if (
        !data ||
        typeof data !== "object" ||
        !("type" in data) ||
        data.type !== "FeatureCollection" ||
        !("features" in data) ||
        !Array.isArray(data.features) ||
        data.features.length === 0 ||
        !data.features.every(
            (feature: MunicipalityFeature) =>
                feature?.type === "Feature" &&
                (feature.geometry?.type === "Polygon" ||
                    feature.geometry?.type === "MultiPolygon") &&
                Array.isArray(feature.geometry.coordinates) &&
                typeof feature.properties?.name === "string" &&
                ["string", "number"].includes(typeof feature.properties?.territorio_id) &&
                typeof feature.properties?.territorio_identidade === "string"
        )
    ) {
        throw new Error("O arquivo de municípios do mapa é inválido.");
    }
    return data as MunicipalityCollection;
}

function centerOf(features: MunicipalityFeature[]) {
    const collection: MunicipalityCollection = { type: "FeatureCollection", features };
    const bounds = L.geoJSON(collection).getBounds();
    return bounds.isValid() ? bounds.getCenter() : null;
}

function buildMapData(municipalities: MunicipalityCollection, schools: SchoolFeature[]) {
    const cityIndex = new Map<string, MunicipalityFeature>();
    const territories = new Map<string, TerritoryGroup>();
    const citySchools = new Map<string, SchoolFeature[]>();

    municipalities.features.forEach((feature) => {
        const cityKey = normalizeCity(feature.properties.name);
        if (cityKey) cityIndex.set(cityKey, feature);
        const id = String(feature.properties.territorio_id);
        const territory = territories.get(id) || {
            id,
            name: feature.properties.territorio_identidade,
            features: [],
            schools: [],
        };
        territory.features.push(feature);
        territories.set(id, territory);
    });

    const unlocatedSchools: SchoolFeature[] = [];
    schools.forEach((school) => {
        const cityKey = normalizeCity(school.properties.city);
        const municipality = cityIndex.get(cityKey);
        const territoryId = municipality
            ? String(municipality.properties.territorio_id)
            : school.properties.identity_territory_number;
        if (territoryId) territories.get(territoryId)?.schools.push(school);

        if (municipality) {
            const group = citySchools.get(cityKey) || [];
            group.push(school);
            citySchools.set(cityKey, group);
        } else {
            unlocatedSchools.push(school);
        }
    });

    const territoryMarkers: SchoolGroup[] = [];
    territories.forEach((territory) => {
        if (!territory.schools.length) return;
        const position = centerOf(territory.features);
        if (position)
            territoryMarkers.push({
                id: territory.id,
                name: territory.name,
                schools: territory.schools,
                position,
            });
    });

    const cityMarkers: SchoolGroup[] = [];
    const cityGroups = new Map<string, SchoolFeature[]>();
    citySchools.forEach((group, cityKey) => {
        const municipality = cityIndex.get(cityKey);
        if (!municipality) return;
        const position = centerOf([municipality]);
        if (!position) return;
        cityGroups.set(cityKey, group);
        cityMarkers.push({
            id: cityKey,
            name: municipality.properties.name,
            schools: group,
            position,
        });
    });

    unlocatedSchools.forEach((school) => {
        const [longitude, latitude] = school.geometry.coordinates;
        if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return;
        cityMarkers.push({
            id: `school-${school.properties.id}`,
            name: school.properties.city || school.properties.name,
            schools: [school],
            position: L.latLng(latitude, longitude),
        });
    });

    const summaries = Array.from(territories.values())
        .map(({ id, name, schools: items }) => ({ id, name, count: items.length }))
        .sort((a, b) => Number(a.id) - Number(b.id));

    const territoryShapes: MunicipalityCollection = {
        type: "FeatureCollection",
        features: Array.from(territories.values()).map((territory) => {
            const merged = union({
                type: "FeatureCollection",
                features: territory.features,
            });
            if (!merged) throw new Error(`Território ${territory.id} sem geometria.`);
            return {
                type: "Feature",
                properties: {
                    name: territory.name,
                    territorio_id: territory.id,
                    territorio_identidade: territory.name,
                },
                geometry: merged.geometry,
            };
        }),
    };

    return {
        territories,
        cityGroups,
        territoryMarkers,
        cityMarkers,
        summaries,
        territoryShapes,
    };
}

function FitBounds({ municipalities }: { municipalities: MunicipalityCollection }) {
    const map = useMap();

    useEffect(() => {
        const bounds = L.geoJSON(municipalities).getBounds();
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [20, 20], animate: false });
            map.setMaxBounds(bounds.pad(0.4));
        }
    }, [map, municipalities]);

    return null;
}

function ResizeWithSidebar() {
    const map = useMap();
    const { open } = useSidebar();

    useEffect(() => {
        const timer = window.setTimeout(() => map.invalidateSize(), 260);
        return () => window.clearTimeout(timer);
    }, [map, open]);

    return null;
}

function SchoolPopup({ name, schools }: { name: string; schools: SchoolFeature[] }) {
    const router = useRouter();

    return (
        <div className="text-font-primary max-w-80 min-w-64">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-font-secondary mt-1 text-sm">{`${schools.length} escola${schools.length !== 1 ? "s" : ""}`}</p>
            <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                {schools.map(({ properties: school }) => (
                    <li key={school.id}>
                        <button
                            type="button"
                            onClick={() => router.push(`/escolas/${school.id}` as Route)}
                            className="border-border hover:bg-muted w-full rounded border p-2 text-left text-sm">
                            <span className="text-font-primary block font-semibold">
                                {school.name}
                            </span>
                            {school.city && (
                                <span className="text-font-secondary mt-1 flex items-center gap-1">
                                    <MapPin size={14} />
                                    {school.city}
                                </span>
                            )}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function countIcon(count: number) {
    return L.divIcon({
        className: styles.marker,
        html: `<span>${count}</span>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
    });
}

function CountMarker({ group }: { group: SchoolGroup }) {
    const count = group.schools.length;
    return (
        <Marker
            position={group.position}
            icon={countIcon(count)}
            title={`${group.name}: ${count} escola${count !== 1 ? "s" : ""}`}>
            <Popup className={styles.popup} maxWidth={360} minWidth={280}>
                <SchoolPopup name={group.name} schools={group.schools} />
            </Popup>
        </Marker>
    );
}

function ZoomAwareLayers({
    municipalities,
    mapData,
}: {
    municipalities: MunicipalityCollection;
    mapData: ReturnType<typeof buildMapData>;
}) {
    const [zoom, setZoom] = useState(7);
    const [selected, setSelected] = useState<{
        name: string;
        schools: SchoolFeature[];
        position: L.LatLng;
    } | null>(null);
    const map = useMapEvents({
        zoomend() {
            setZoom(map.getZoom());
            setSelected(null);
        },
    });
    const detailed = zoom >= MUNICIPAL_ZOOM;

    return (
        <>
            <GeoJSON
                key={detailed ? "municipalities" : "territories"}
                data={detailed ? municipalities : mapData.territoryShapes}
                style={(feature) => {
                    const id = String(feature?.properties?.territorio_id || "");
                    const hasSchools = Boolean(
                        mapData.territories.get(id)?.schools.length
                    );
                    return {
                        fillColor: hasSchools ? territoryColor(id) : EMPTY_FILL,
                        fillOpacity: 1,
                        color: "#ffffff",
                        weight: detailed ? 0.75 : 0,
                    };
                }}
                onEachFeature={(feature, layer) => {
                    const properties = feature.properties as MunicipalityProperties;
                    const tooltip = document.createElement("div");
                    const title = document.createElement("strong");
                    title.textContent = properties.territorio_identidade;
                    tooltip.append(title);
                    if (detailed) {
                        tooltip.append(
                            document.createElement("br"),
                            document.createTextNode(properties.name)
                        );
                    }
                    layer.bindTooltip(tooltip, { sticky: true });
                    layer.on("click", (event: L.LeafletMouseEvent) => {
                        const group = detailed
                            ? mapData.cityGroups.get(normalizeCity(properties.name))
                            : mapData.territories.get(String(properties.territorio_id))
                                  ?.schools;
                        setSelected(
                            group?.length
                                ? {
                                      name: detailed
                                          ? properties.name
                                          : properties.territorio_identidade,
                                      schools: group,
                                      position: event.latlng,
                                  }
                                : null
                        );
                    });
                }}
            />
            {(detailed ? mapData.cityMarkers : mapData.territoryMarkers).map((group) => (
                <CountMarker
                    key={`${detailed ? "city" : "territory"}-${group.id}`}
                    group={group}
                />
            ))}
            {selected && (
                <Popup
                    position={selected.position}
                    className={styles.popup}
                    maxWidth={360}
                    minWidth={280}>
                    <SchoolPopup name={selected.name} schools={selected.schools} />
                </Popup>
            )}
        </>
    );
}

export default function MapaEscolasLeaflet() {
    const {
        data: schoolGeoJson,
        error: schoolError,
        isLoading: loadingSchools,
    } = useSWR("schools-geo-data", getSchoolGeoData, {
        revalidateOnFocus: false,
        dedupingInterval: 60000,
    });
    const {
        data: municipalities,
        error: municipalityError,
        isLoading: loadingMunicipalities,
    } = useSWR("territory-geo-data", fetchMunicipalities, {
        revalidateOnFocus: false,
        dedupingInterval: 60000,
    });
    const schoolFeatures = useMemo(
        () => (schoolGeoJson?.features || []) as SchoolFeature[],
        [schoolGeoJson]
    );
    const mapData = useMemo(
        () => (municipalities ? buildMapData(municipalities, schoolFeatures) : null),
        [municipalities, schoolFeatures]
    );

    if (loadingSchools || loadingMunicipalities) {
        return (
            <div className="text-font-secondary flex h-80 items-center justify-center gap-3">
                <Spinner />
                Carregando mapa...
            </div>
        );
    }
    if (schoolError || municipalityError || !municipalities || !mapData) {
        return (
            <p role="alert" className="text-font-secondary py-8">
                Não foi possível carregar o mapa de escolas.
            </p>
        );
    }

    return (
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_270px]">
            <MapContainer
                center={[-12.5, -41.7]}
                zoom={7}
                minZoom={5}
                maxZoom={12}
                zoomSnap={0.25}
                zoomControl
                attributionControl={false}
                style={{ backgroundColor: "#f1f5f9" }}
                className={`${styles.map} border-border h-[clamp(360px,62vh,680px)] w-full min-w-0 rounded-md border`}
                aria-label="Mapa de escolas por território e município">
                <FitBounds municipalities={municipalities} />
                <ResizeWithSidebar />
                <ZoomAwareLayers municipalities={municipalities} mapData={mapData} />
            </MapContainer>
            <aside className="border-border max-h-[clamp(360px,62vh,680px)] overflow-y-auto border-t pt-3 text-sm lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
                <h3 className="text-font-primary mb-3 font-semibold">
                    Territórios de Identidade
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                    {mapData.summaries.map((summary) => (
                        <li
                            key={summary.id}
                            className="text-font-secondary flex items-start gap-2">
                            <span
                                className="mt-0.5 size-4 shrink-0 rounded-sm border border-black/10"
                                style={{
                                    backgroundColor: summary.count
                                        ? territoryColor(summary.id)
                                        : EMPTY_FILL,
                                }}
                            />
                            <span className="min-w-0 flex-1">
                                <strong className="text-font-primary">
                                    {summary.id}
                                </strong>{" "}
                                - {summary.name}
                            </span>
                            {summary.count > 0 && (
                                <span className="text-font-primary font-semibold tabular-nums">
                                    {summary.count}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}
