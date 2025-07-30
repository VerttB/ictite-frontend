import { pool } from "@/lib/db";
import {  NextRequest, NextResponse } from "next/server";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){
    const { id } = await params
    console.log(id)
    try{
        const result = await pool.query(
      `SELECT name,description FROM type_equipment
       INNER JOIN equipment ON equipment.type_equipment_id = type_equipment.id
       WHERE equipment.school_id = $1`,
      [id]
    );
            
        if (result.rows.length === 0) {
            return NextResponse.json({ msg: "Equipamntos da escola não encontrados" }, { status: 404 });
            }


        return  NextResponse.json(result.rows)
    }catch(e:any){
        console.log(e);
        return NextResponse.json({msg: "Erro ao dar fetch em equipamento"})
    }
}