import Image from "next/image";

export default function CardMateriais() {
    return(
        <div className="h-[280px] w-[220px] md:w-[260px]  bg-secondary rounded-sm shadow-sm hover:scale-105 transition-all cursor-pointer">
            <div className="flex flex-col gap-3 w-full items-center justify-center pt-2.5">
                <Image src={"https://picsum.photos/100/100"} alt="Material" width={100} height={100}
                    className="rounded-full"
                ></Image>
                <h2 className="text-2xl text-white font-semibold">Título</h2>
                <p className="px-1.5 text-justify line-clamp-4 text-white">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est ullam perferendis enim iure commodi nemo eveniet, voluptatibus perspiciatis quas inventore consectetur velit. Doloremque odio blanditiis aliquid rem corrupti. Optio, numquam.</p>
            </div>
        </div>
    );
}