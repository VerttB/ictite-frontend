import Image from "next/image";

export default function CardMateriais() {
    return (
        <div className="bg-secondary h-[280px] w-[220px] cursor-pointer rounded-sm shadow-sm transition-all hover:scale-105 md:w-[260px]">
            <div className="flex w-full flex-col items-center justify-center gap-3 pt-2.5">
                <Image
                    src={"https://picsum.photos/100/100"}
                    alt="Material"
                    width={100}
                    height={100}
                    className="rounded-full"></Image>
                <h2 className="text-2xl font-semibold text-white">Título</h2>
                <p className="line-clamp-4 px-1.5 text-justify text-white">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Est ullam perferendis enim iure commodi nemo eveniet,
                    voluptatibus perspiciatis quas inventore consectetur velit.
                    Doloremque odio blanditiis aliquid rem corrupti. Optio,
                    numquam.
                </p>
            </div>
        </div>
    );
}
