import Image from "next/image"

export const Header = () => {
    return(
        <div className="w-full p-3 bg-cinza-light flex justify-between items-center">
            <div>
                <Image
                src={"/logo_ia_editais.png"}
                alt="Logo"
                width={200}
                height={200}
                className="
                    inline-block ml-2
                "
            />

            <Image 
                src={"/logo_fiocruz.png"}
                alt="Logo"
                width={150}
                height={150}
                className="
                    ml-2 inline-block mb-[3px]
                "
            />
            </div>
            <button className="bg-verde text-xl cursor-pointer text-branco rounded-xl py-2 h-fit px-10">
                Fazer Login
            </button>
        </div>
    )
}