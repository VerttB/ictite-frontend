import { twMerge } from "tailwind-merge";
interface ScrollAreaProps {
    className?: string;
    children: React.ReactNode;
}
export const ScrollArea = ({ className, children }: ScrollAreaProps) => {
    return (
        <div
            className={twMerge(
                `scroll-both scroll-thumb scroll-color scroll-thin h-24 min-h-0 w-full overflow-hidden pr-3 hover:overflow-y-auto sm:h-40 xl:h-52 ${className}`
            )}>
            {children}
        </div>
    );
};
