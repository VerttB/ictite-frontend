import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
{ params }: { params: Promise<{ name: string }>}
) {
  const { name } =  await params;
  console.log("NOME - ",name);

    let researcherImg = null;
    try {
          const res = await fetch(`http://200.128.66.226/ictite/api/researcherName?name=${encodeURIComponent(name)}`);
          let data = await res.json();
          if (!data[0]) researcherImg = "https://picsum.photos/100/100"
          else researcherImg = `http://200.128.66.226/ictite/api/ResearcherData/Image?researcher_id=${data[0].id}`;
        } catch (e) {
          console.log("Erro ao buscar imagem:", e);
        }


    return NextResponse.json(researcherImg);
}
