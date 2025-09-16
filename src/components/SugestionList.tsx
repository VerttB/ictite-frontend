
import { SugestionBase } from "@/core/interface/SugestionBase";
import { capitalize } from "@/core/utils/capitalize";
import Link from "next/link";


interface SugestionListProps{
    data: Record<string, SugestionBase[]> 
}

export const SugestionList = ({data}: SugestionListProps) => {
    if(!data) return
    
    const allEmpty = Object.values(data).every((arr) => arr.length === 0);
    return (
    <div className="flex flex-wrap gap-4 w-full">
      {allEmpty ? (
        <span className="text-gray-500 py-2 px-4">
          Nenhuma sugestão encontrada
        </span>
      ) : (
        Object.keys(data).map((key) => {
          const items = data[key];
          if (!items.length) return null; 

          return (
            <div className="flex flex-wrap  gap-4" key={key}>
              <div className="flex flex-col gap-2 w-full">
                <h3 className="py-2 px-8 rounded-md w-fit bg-blue-100">{capitalize(key)}</h3>

                <div className="grid grid-cols-2 items-start gap-1 w-full">
                  {items.map((e) => (
                    <Link
                      href={`${key}/${e.id}`}
                      key={e.id}
                      className="w-full hover:bg-verde py-1 px-4 rounded-md hover:text-white"
                    >
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
}