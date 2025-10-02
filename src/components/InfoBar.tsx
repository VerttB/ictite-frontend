interface InfoBarProps{
    titulo : string,
    valor : number
}

export default function InfoBar(props: { data: InfoBarProps[] }){
    return(
        <div className="flex gap-4 py-10 px-4 text-center bg-foreground rounded-md w-full justify-around border-1 border-border  ">

            {props.data.map(({titulo, valor}) => (
               <div key={titulo} className="flex flex-col">
                <span className="font-light text-xl">{titulo}</span>
                <span className="font-extrabold text-5xl">{valor}</span>
               </div>
            ))}
        </div>
    )
}