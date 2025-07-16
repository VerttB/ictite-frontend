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
      `SELECT name,city,id,photo_id,description FROM school 
       WHERE id = $1`,
      [id]
    );
            
        if (result.rows.length === 0) {
            return NextResponse.json({ msg: "Escola não encontrada" }, { status: 404 });
            }

        
        return  NextResponse.json(result.rows[0])
    }catch(e:any){
        console.log(e);
        return NextResponse.json({msg: "Erro ao dar fetch em escolas/id"})
    }
}