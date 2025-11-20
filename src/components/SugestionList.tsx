import { SugestionBase } from "@/core/interface/SugestionBase";
import { capitalize } from "@/core/utils/capitalize";
import Link from "next/link";

interface SugestionListProps {
    data: Record<string, SugestionBase[]>;
}

export const SugestionList = ({ data }: SugestionListProps) => {
    if (!data) return;

    const allEmpty = Object.values(data).every((arr) => arr.length === 0);
    return (
        <div className="flex w-full flex-wrap gap-4">
            {allEmpty ? (
                <span className="px-4 py-2 text-gray-500">
                    Nenhuma sugestão encontrada
                </span>
            ) : (
                Object.keys(data).map((key) => {
                    const items = data[key];
                    if (!items.length) return null;

                    return (
                        <div className="flex flex-wrap gap-4" key={key}>
                            <div className="flex w-full flex-col gap-2">
                                <h3 className="text-font-primary bg-accent w-fit rounded-md px-8 py-2">
                                    {capitalize(key)}
                                </h3>

                                <div className="grid w-full grid-cols-2 items-start gap-1">
                                    {items.map((e) => (
                                        <Link
                                            href={`${key}/${e.id}`}
                                            key={e.id}
                                            className="hover:bg-primary w-full rounded-md px-4 py-1 hover:text-white">
                                            {e.name ?? e.title ?? "Sem título"}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};
