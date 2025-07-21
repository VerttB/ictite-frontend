import { pool } from "@/lib/db";
import {  NextRequest, NextResponse } from "next/server";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){
    const { id } = await params

    try{
        const result = await pool.query(
      `SELECT id,name,description FROM project
       WHERE project.school_id = $1`,
      [id]
    );
            
        if (result.rows.length === 0) {
            return NextResponse.json({ msg: "Projetos da escola não encontrados" }, { status: 404 });
            }


        return  NextResponse.json(result.rows)
    }catch(e:any){
      
        return NextResponse.json({msg: "Erro ao dar fetch em equipamento"})
    }
}