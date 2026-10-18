import type { LucideIcon } from "lucide-react";
export interface TabsConfig<T = unknown> {
    value: string;
    label: string;
    icon: LucideIcon;
    isLoading: boolean;
    isError: boolean;
    data?: T[];
    renderItem?: (item: T) => React.ReactNode;
    emptyMessage?: string;
    minCardWidth?: string;
    layoutType?: "grid" | "list" | "masonry";
    masonryGutter?: string;
    className?: string;
    children?: React.ReactNode;
}

export const createTabsConfig = <T,>(config: TabsConfig<T>): TabsConfig => ({
    ...config,
    renderItem: config.renderItem
        ? (item: unknown) => config.renderItem?.(item as T)
        : undefined,
});
