"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

export function SearchBar({ onChange }: { onChange: (value: string) => void }) {
    const [value, setValue] = useState("");

    const handleChange = (e: any) => {
        const v = e.target.value;
        setValue(v);

        if (v.length >= 2) {
            const t = setTimeout(() => onChange(v), 400);
            return () => clearTimeout(t);
        }

        onChange(""); 
    };

    return (
        <div className="relative mt-5 w-full flex-grow">
            <Input
                value={value}
                onChange={handleChange}
                placeholder="Buscar escola, clube, pesquisador ou projeto"
                className="w-full rounded-lg border-2 px-4 py-2 pr-10"
            />
            <Button
                variant="ghost"
                size="icon"
                className="bg-primary absolute top-1/2 right-1 -translate-y-1/2"
            >
                <Search className="text-white" />
            </Button>
        </div>
    );
}
