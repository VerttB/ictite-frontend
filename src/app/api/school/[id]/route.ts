import { pool } from "@/lib/db";
import {  NextRequest, NextResponse } from "next/server";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){
    const { id } = await params
 
    try{
          const result = await pool.query(
      `
            SELECT 
                s.id,
                s.name,
                s.city,
                s.photo_id,
                s.description,

                COALESCE(
                (
                    SELECT json_agg(json_build_object(
                    'name', r.name,
                    'sex', r.sex,
                    'race', r.race,
                    'type', r.type,
                    'schoolcity', s.city,
                    'schoolname', s.name
                    ))
                    FROM researcher r
                    WHERE r.school_id = s.id
                ), '[]'
                ) AS researchers,

                COALESCE(
                (
                    SELECT json_agg(json_build_object(
                    'id', p.id,
                    'name', p.name,
                    'description', p.description
                    ))
                    FROM project p
                    WHERE p.school_id = s.id
                ), '[]'
                ) AS projects,

                COALESCE(
                (
                    SELECT json_agg(json_build_object(
                    'id', e.id,
                    'name', te.name,          -- Pegando o nome do type_equipment
                    'description', te.description, -- Pegando a descrição do type_equipment
                    'photo', te.photo         -- Pegando a foto do type_equipment
                    ))
                    FROM equipment e
                    JOIN type_equipment te ON e.type_equipment_id = te.id -- JOIN para acessar a tabela type_equipment
                    WHERE e.school_id = s.id
                ), '[]'
                ) AS equipment

            FROM school s
            WHERE s.id = $1
            `,
      [id]
    );

        if (result.rows.length === 0) {
            return NextResponse.json({ msg: "Escola não encontrada" }, { status: 404 });
            }

        const schoolData = result.rows[0];

        const researchersImages = await Promise.all(
            schoolData.researchers.map(async (r:any) => {
                let imageUrl = null;

                try{
                    const res = await fetch(`http://200.128.66.226/ictite/api/researcherName?name=${encodeURIComponent(r.name)}`);

                    if(res.ok){
                        const data = await res.json();
                        if(data && data.length > 0 && data[0] && data[0].id){
                            imageUrl = `http://200.128.66.226/ictite/api/ResearcherData/Image?researcher_id=${data[0].id}`;
                        }
                    }else{
                        console.log("Erro ao fazer a requisição externa para ",r.name,":", res.status);
                    }
                }catch(e){
                    console.log("Erro ao buscar imagem de ", r.name)
                }
                return{
                    ...r,
                    image: imageUrl
                };
            })
        );
        schoolData.researchers = researchersImages;
        return  NextResponse.json(result.rows[0])
    }catch(e:any){
        console.log(e);
        return NextResponse.json(e)
    }
}