import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const result = await pool.query(`
            SELECT researcher.name,researcher.lattes_id,researcher.sex,researcher.race,researcher.type
            ,school.name as schoolName FROM researcher
            INNER JOIN school
            ON school.id = researcher.school_id
            `)
        console.log("Resultado reseachers")
        return  NextResponse.json(result.rows)
    }catch(e:any){
        console.log(e);
        return NextResponse.json({msg: "Erro ao dar em pesquisadores fetch"})
    }
}