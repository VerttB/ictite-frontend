'use client'
import MapaRender from "@/components/Map";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Mapa"), {
    loading: () => <p>Carregando..</p>,
    ssr: false
  })

  
export default function page(){
    return(
        <div className="w-full p-8 flex flex-col space-between rounded-xl">
            <h1 className="h-fit text-xl rounded-xl bg-cinza-light p-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores earum quis in quos vel sequi exercitationem assumenda, quasi distinctio. Autem nostrum laboriosam harum aliquid assumenda nesciunt voluptatibus velit eveniet? Quisquam?</h1>
            <div className='h-full  w-full  p-4'>
            <Map/>
        </div>
        </div>
    )
}