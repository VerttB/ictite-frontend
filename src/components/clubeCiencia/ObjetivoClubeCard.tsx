import { FlaskConical } from "lucide-react";

export default function ObjetivoClubeCard() {
    return (
        <div className="bg-foreground hover:shadow-primary hover:border-primary flex w-[300px] flex-col gap-3 rounded-md border p-4 transition-all hover:border-2 hover:shadow-sm">
            <div className="text-primary flex items-center gap-2">
                <FlaskConical />
                <h3 className="text-2xl font-semibold">Objetivo 01</h3>
            </div>
            <div className="line-clamp-4 text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
                ipsa quis illo dignissimos laborum, asperiores neque nisi iste,
                a non commodi repudiandae tempore explicabo nihil dolore totam
                rerum quibusdam ratione!
            </div>
        </div>
    );
}
