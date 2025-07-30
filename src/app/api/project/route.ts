import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const result = await pool.query("SELECT * FROM ictite")
        console.log("Consegui")
        return  NextResponse.json(result.rows)
    }catch(e:any){
        console.log(e);
        return NextResponse.json({msg: "Erro ao dar fetch"})
    }
}