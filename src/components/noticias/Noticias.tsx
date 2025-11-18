import CardNoticias from "./CardNoticias";
import CardSecundariaNoticias from "./CardSecundariaNoticias";

export default function Noticias() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-3">
            <div>
                <CardNoticias />
            </div>
            <div className="flex flex-col justify-between">
                {Array.from({ length: 3 }).map((_, i) => (
                    <CardSecundariaNoticias key={i} />
                ))}
            </div>
        </div>
    )
}   