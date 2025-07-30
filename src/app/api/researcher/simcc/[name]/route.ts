import { NextRequest, NextResponse } from "next/server";
import { ResearchSIMCC } from "@/core/interface/Pesquisador/ResearcherSIMCC"; // Ensure this interface matches the API response

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  console.log("NOME - ", name);

  let researcherData: ResearchSIMCC | null = null;
  let researcherArticlesData: any[] | null = null; 

  try {
    const resResearcher = await fetch(`http://200.128.66.226/ictite/api/researcherName?name=${encodeURIComponent(name)}`);

    if (!resResearcher.ok) {
      console.error(`Erro ao buscar pesquisador por nome (${name}): ${resResearcher.status} ${resResearcher.statusText}`);

    } else {
      const data = await resResearcher.json();
      if (data && data.length > 0 && data[0]) {
        researcherData = data[0] as ResearchSIMCC; 
      } else {
        console.log(`Nenhum dado de pesquisador encontrado para: ${name}`);
      }
    }

    if (researcherData && researcherData.id) {
      const resArticles = await fetch(`http://200.128.66.226/ictite/api/bibliographic_production_article?researcher_id=${researcherData.id}`);

      if (!resArticles.ok) {
        console.error(`Erro ao buscar artigos para o pesquisador ID ${researcherData.id}: ${resArticles.status} ${resArticles.statusText}`);
      } else {
        researcherArticlesData = await resArticles.json();
      }
    }

  } catch (e: any) {
    console.error("Erro geral na requisição:", e);
    return NextResponse.json({ error: "Erro interno do servidor", details: e.message }, { status: 500 });
  }


  const responsePayload = {
    ...researcherData,
    articlesData: researcherArticlesData
  };

  if (!researcherData) {
    return NextResponse.json({ msg: "Pesquisador não encontrado" }, { status: 404 });
  }

  return NextResponse.json(responsePayload);
}