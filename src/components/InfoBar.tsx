interface InfoBarProps{
    titulo : string,
    valor : number
}

export default function InfoBar(props: { data: InfoBarProps[] }){
    return(
        <div className="flex gap-8 p-4 sm:py-10 text-center bg-foreground rounded-md w-full justify-around border-1 border-border  ">

            {props.data.map(({titulo, valor}) => (
               <div key={titulo} className="flex flex-col">
                <span className="font-light text-lg sm:text-xl">{titulo}</span>
                <span className="font-extrabold text-3xl sm:text-5xl">{valor}</span>
               </div>
            ))}
        </div>
    )
}