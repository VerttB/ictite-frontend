import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  request: NextRequest,
{ params }: { params: Promise<{ id: string }>}
) {
  const { id } =  await params;
  console.log(id)
  try {
    const result = await pool.query(
      `SELECT researcher.name,researcher.lattes_id,researcher.sex,researcher.race,researcher.type
            ,school.name as schoolName, school.city as schoolCity FROM researcher
            INNER JOIN school
            ON school.id = researcher.school_id
            WHERE researcher.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ msg: "Nenhum pesquisador encontrado." }, { status: 404 });
    }

    const researcherSIMCC = await Promise.all(
      result.rows.map(async (r) => {
        //https://simcc.uesc.br/v3/api/ResearcherData/Image?researcher_id=9ae33668-b5a9-4d1c-af5d-2b5d1f166601
        try {
          console.log(r.name)
          const res = await fetch(`http://200.128.66.226/ictite/api/researcherName?name=${encodeURIComponent(r.name)}`);
          let data = await res.json();
          let image = null;
          if (!data[0]) data[0] = null
          else image = `http://200.128.66.226/ictite/api/ResearcherData/Image?researcher_id=${data[0].id}`;
          return {
            ...r,
            simcc: data[0],
            image: image
          };
        } catch (e) {
          console.error("Erro ao buscar SIMCC:", e);
          return {
            ...r,
            simcc: null,
            image: null
          };
        }
      })
    );

    return NextResponse.json(researcherSIMCC);
  } catch (e: any) {
    console.error("Erro geral:", e);
    return NextResponse.json({ msg: "Erro ao buscar pesquisadores" }, { status: 500 });
  }
}
