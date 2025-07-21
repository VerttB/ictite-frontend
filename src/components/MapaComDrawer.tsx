"use client"
import { useState } from "react";
import Escola from "./escola/Escola";
import MapaRender from "./Mapa";
import { useFetch } from "@/hooks/useFetch";
import { SchoolData } from "@/core/interface/School";



export default function MapaComDrawer () {


    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
    async function handlePointClick(props: any) {
        setSelectedSchoolId(props.id);
        setDrawerOpen(true);
    }

    return (
        <>
        <MapaRender onUnclusteredPointClick={handlePointClick} />
        {selectedSchoolId &&
        <Escola
            schoolId={selectedSchoolId}
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
        />}
        </>
    );
}