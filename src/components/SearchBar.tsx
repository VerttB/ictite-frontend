import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { useDebounce } from "@/hooks/useDebouce";

interface SearchBarProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    initialValue?: string;
}

export function SearchBar({ onSearch, placeholder, initialValue = "" }: SearchBarProps) {
    const [value, setValue] = useState(initialValue);
    const deboucedValue = useDebounce(value, 300);

    useEffect(() => {
        if (deboucedValue === initialValue) {
            onSearch("");
            return;
        }
        if (deboucedValue.length >= 2) {
            onSearch(deboucedValue);
        } else if (deboucedValue.length === 0) {
            onSearch("");
        }
    }, [deboucedValue, onSearch, initialValue]);

    const submitSearch = () => {
        onSearch(value);
    };
    return (
        <div className="relative w-full flex-grow">
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border-2 px-4 py-2 pr-10"
            />
            <Button
                variant="ghost"
                size="icon"
                onClick={submitSearch}
                className="bg-primary absolute top-1/2 right-1 -translate-y-1/2">
                <Search className="text-white" />
            </Button>
        </div>
    );
}
