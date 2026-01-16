export interface SearchParams {
    [key: string]:
        | string
        | number
        | boolean
        | undefined
        | Array<string | number | boolean>;
}
