import { CardGenerico } from "./card/CardGenerico";
type SectionProps = {
  title: string;
  items: { title: string; image: string }[];
  icon?: React.ReactNode;
  onAdd?: () => void;
};

export const Section = ({ title, items, icon, onAdd }: SectionProps) => {
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
          <CardGenerico key={i} title={item.title} image={item.image} />
        ))}
        <CardGenerico isAddButton onClick={onAdd} />
      </div>
    </section>
  );
};
