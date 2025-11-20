import { LucideIcon } from "lucide-react";

interface InfoBarProps {
    titulo: string;
    valor: number;
    Icon: LucideIcon;
}

export default function InfoBar(props: { data: InfoBarProps[] }) {
    return (
        <div className="bg-foreground grid grid-cols-1 gap-4 rounded-md border p-4 shadow-sm md:grid-cols-4">
            {props.data.map(({ titulo, valor, Icon }) => (
                <div
                    key={titulo}
                    className="bg-primary flex flex-col items-center rounded-md border p-3 text-center text-white transition-all duration-300 hover:scale-95">
                    <Icon />
                    <span className="text-lg font-light sm:text-xl">
                        {titulo}
                    </span>
                    <span className="text-3xl font-extrabold sm:text-4xl">
                        {valor}
                    </span>
                </div>
            ))}
        </div>
    );
}
