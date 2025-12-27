import type { LucideIcon } from "lucide-react";
export interface TabsConfig {
    value: string;
    label: string;
    icon: LucideIcon;
    isLoading: boolean;
    isError: boolean;
    data?: any[];
    renderItem?: (item: any) => React.ReactNode;
    emptyMessage?: string;
    minCardWidth?: string;
    layoutType?: "grid" | "list" | "masonry";
    masonryGutter?: string;
    className?: string;
    children?: React.ReactNode;
}
