import { LucideIcon } from "lucide-react"

interface CardNaoEncontradoProps {
    icon?: LucideIcon;
    text: string;
}

export default function CardNaoEncontrado ({  icon: Icon, text }: CardNaoEncontradoProps) {
    return(
        <div className="border-muted-foreground/40 bg-muted/10 text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-md border border-dashed py-10">
            {Icon && <Icon className="h-8 w-8 opacity-50" />}
            <p className="text-center text-sm font-medium">
                {text}
            </p>
        </div>
    )
}