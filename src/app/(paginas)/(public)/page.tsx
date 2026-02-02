export const dynamic = "force-dynamic";

import { GETictite } from "@/core/service/ICTITEService";
import Mapa from "@/components/Mapa";
import { Spinner } from "@/components/LoadingSpin";
import EscolaList from "@/components/escola/EscolaList";
import { SugestionBase } from "@/core/interface/SugestionBase";
import PesquisadorLoader from "@/components/pesquisador/PesquisadorLoader";
import ProjetoLoader from "@/components/projeto/ProjetoLoader";
import ClubeCienciaLoader from "@/components/clubeCiencia/ClubeCienciaLoader";
import Noticias from "@/components/noticias/Noticias";
import SearchClient from "@/components/SearchList";

export default async function ProjetoPage() {
    const projeto = await GETictite();

    return (
        <div className="space-between flex w-full flex-col gap-4 rounded-xl px-2 py-2 sm:px-8">

            <div>
                <Noticias />
            </div>

            <div className="flex w-full flex-row gap-4">
                <div className="bg-foreground border-border w-full rounded-md border-2 px-4 py-6 text-justify indent-4">
                    <h1 className="sm:text-sm md:text-xl">{projeto.objective}</h1>
                </div>
            </div>

            <SearchClient />
            <Mapa />
        </div>
    );
}
