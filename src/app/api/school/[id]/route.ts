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
                    'type', r.type
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

        
        return  NextResponse.json(result.rows[0])
    }catch(e:any){
        console.log(e);
        return NextResponse.json(e)
    }
}