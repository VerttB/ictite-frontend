import { LucideIcon } from "lucide-react";

interface InfoBarItem {
  titulo: string;
  valor: number;
  Icon: LucideIcon;
}

interface InfoBarProps {
  data: InfoBarItem[];
  position?: "horizontal" | "vertical"; // novo atributo
}

export default function InfoBar({ data, position = "horizontal" }: InfoBarProps) {
    const isVertical = position === "vertical";
        
    if (!data || data.length === 0 ||  !Array.isArray(data)) {
        return null;
    }

    return (
        <div
            className={`bg-foreground rounded-md border p-4 shadow-sm transition-all duration-300 
            ${isVertical ? "flex flex-col gap-3" : "grid grid-cols-1 gap-4 md:grid-cols-4"}`}
        >
            {data.map(({ titulo, valor, Icon }) => (
                <div
                    key={titulo}
                    className={`bg-primary text-white rounded-md border p-3 transition-all duration-300 hover:scale-95
                        ${isVertical ? "flex flex-row items-center justify-between  gap-3" : "flex flex-col items-center text-center"}`}>
                    <div
                        className={`flex items-center justify-center 
                        ${isVertical ? "w-10 h-10 rounded-full bg-primary/20" : ""}`}>
                        <Icon />
                    </div>

                    <div
                        className={`flex flex-col ${isVertical ? "items-end" : "items-center"}`}>
                        <span className="text-lg font-light sm:text-xl">{titulo}</span>
                        <span className="text-3xl font-extrabold sm:text-4xl">{valor}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
