import { LucideIcon } from "lucide-react"

interface InfoBarProps{
    titulo : string,
    valor  : number,
    Icon   : LucideIcon 
}

export default function InfoBar(props: { data: InfoBarProps[] }){
    return(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-foreground rounded-md shadow-sm border  ">

            {props.data.map(({titulo, valor, Icon}) => (
               <div key={titulo} className="flex flex-col items-center text-center p-3 rounded-md bg-primary transition-all duration-300 hover:scale-95 border text-white">
                <Icon />
                <span className="font-light text-lg sm:text-xl">{titulo}</span>
                <span className="font-extrabold text-3xl sm:text-4xl">{valor}</span>
               </div>
            ))}
        </div>
    )
}