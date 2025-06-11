import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const result = await pool.query(`
            SELECT name, city, ictite_id from school
            `)
        return  NextResponse.json(result.rows)
    }catch(e:any){
        console.log(e);
        return NextResponse.json({msg: "Erro ao dar fetch"})
    }
}