import { FlaskConical } from "lucide-react";

export default function ObjetivoClubeCard () {
    return(
        <div className="w-[300px] flex flex-col gap-3 bg-foreground p-4 rounded-md border">
            <div className="flex gap-2 items-center text-primary">
                <FlaskConical />
                <h3 className="text-2xl font-semibold">Objetivo 01</h3>
            </div>
            <div className="line-clamp-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro ipsa quis illo dignissimos laborum, asperiores neque nisi iste, a non commodi repudiandae tempore explicabo nihil dolore totam rerum quibusdam ratione!
            </div>
        </div>
    )
}