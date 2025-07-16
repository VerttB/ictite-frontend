import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const result = await pool.query(`
            SELECT name, city, id, latitude ,longitude from school
            `)

            const features = result.rows.map((row: any) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [row.longitude, row.latitude], 
                },
                properties: {
                    id: row.id,
                    name: row.name,
                    city: row.city,
                    ictite_id: row.ictite_id,
                },
                }));

            const geoJson = {
                collection:"FeatureCollection",
                features
            }
        return  NextResponse.json(geoJson)
    }catch(e:any){
        console.log(e);
        return NextResponse.json({msg: "Erro ao dar fetch"})
    }
}