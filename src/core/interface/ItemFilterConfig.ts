type ItemType = "array" | "text";

export interface ItemFilterConfig<T> {
    label: string;
    type: ItemType;
    value: string | number | boolean | undefined | Array<string | number | boolean>;
    placeholder?: string;
    key: keyof T & string;
    options?: string[];
}
