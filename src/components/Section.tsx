import { CardGenerico } from "./card/CardGenerico";
type SectionProps = {
  title: string;
  items: { title: string; image: string }[];
  onAdd?: () => void;
};

export const Section = ({ title, items, onAdd }: SectionProps) => {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {items.map((item, i) => (
          <CardGenerico key={i} title={item.title} image={item.image} />
        ))}
        <CardGenerico isAddButton onClick={onAdd} />
      </div>
    </section>
  );
};
