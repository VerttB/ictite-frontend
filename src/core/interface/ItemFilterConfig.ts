type ItemType = "array" | "text";

export interface ItemFilterConfig {
    label: string;
    type: ItemType;
    value: any;
    placeholder?: string;
    key: string;
    options?: string[];
}
