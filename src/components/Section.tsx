import { Image } from "@/core/interface/Image";
import { CardGenerico } from "./card/CardGenerico";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenuLabel, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

type ItemTitle = { 
  title: string;
  name?: never
 };
type ItemName = {
   name: string;
   title?: never
   };
type ItemType = (ItemTitle | ItemName) & {
  images: Image[]
};

type SectionProps = {
  title: string;
  items: ItemType[];
  icon?: React.ReactNode;
  onAdd?: () => void;
  onUpdate?: (item: any) => void;
  onDelete?: (item: any) => void;
};

export const Section = ({ title, items, icon, onAdd }: SectionProps) => {
  console.log(items);
  return (
    <section className="mb-10">
      <div className="flex items-center border-b-2 h-8 mb-4 border-gray-300">
        <div className="flex items-center gap-2">
          {icon}
        <h2 className="text-lg font-semibold  ">{title}</h2>
        </div>
        <p className="ml-4 text-sm text-white px-1 py-0.5 rounded-md bg-primary ">Total: {items.length}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {items.map((item, i) => (
          <DropdownMenu key={(item.title ?? item.name) + i}>
            <DropdownMenuTrigger>
              <CardGenerico  title={item.title ?? item.name} image={item.images?.[0]?.path ?? ""} />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" sideOffset={4}>
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Excluir</DropdownMenuItem>

          </DropdownMenuContent>
          </DropdownMenu>
        ))}
        <CardGenerico isAddButton onClick={onAdd} />
      </div>
    </section>
  );
};
