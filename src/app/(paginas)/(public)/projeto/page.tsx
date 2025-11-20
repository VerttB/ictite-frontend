import { getAssetPrefix } from "@/core/utils/api";

export default function Projeto() {
    return (
        <div className="w-full overflow-hidden">
            <iframe
                className="h-[720px] w-full"
                src={`${getAssetPrefix()}/projeto.pdf`}></iframe>
        </div>
    );
}
