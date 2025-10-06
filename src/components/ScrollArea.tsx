import { twMerge } from "tailwind-merge"
interface ScrollAreaProps {
    className?:string,
    children: React.ReactNode
}
export const ScrollArea = ({ className, children }: ScrollAreaProps) => {
    return (
    <div className={twMerge(`scroll-both scroll-color pr-3 scroll-thin min-h-0 w-full overflow-hidden hover:overflow-y-auto h-24 sm:h-40 xl:h-52 ${className}`)}>
        {children}
    </div>
    )
}   